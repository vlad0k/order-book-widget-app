import { PublicWsContext } from "context/PublicWsContext";
import { useCallback, useContext, useEffect, useState } from "react";
import useDispatch from "./useDispatch";
import store from "store";
import {
  IOrderBookRecord,
  updateAsksData,
  updateBidsData,
} from "store/orderBook";
import { useSelector } from "react-redux";
import { selectOrderBookSymbol } from "store/orderBook/selector";

const useOrderBook = () => {
  const [precision, setPrecision] = useState(0);
  const symbol = useSelector(selectOrderBookSymbol);
  const { ws, sendMessage } = useContext(PublicWsContext);

  const dispatch = useDispatch();

  useEffect(() => {
    let channelId: number | null = null;

    const messageListener = (e: MessageEvent) => {
      const storeState = store.getState();

      const bidsData = [...storeState.orderBook.bids];
      const asksData = [...storeState.orderBook.asks];

      const data = JSON.parse(e.data);

      if (data.event === "subscribed") {
        channelId = data.chanId;
      }

      if (data[0] === channelId) {
        if (data[1].length > 3) {
          const { asks, bids } = data[1]?.reduce(
            (
              acc: {
                asks: IOrderBookRecord[];
                bids: IOrderBookRecord[];
              },
              [price, count, amount]: number[]
            ) => {
              if (amount > 0) {
                acc.bids.push({
                  price,
                  count,
                  amount,
                  total: amount + (acc.bids[acc.bids.length - 1]?.total || 0),
                });
              }
              if (amount < 0) {
                const currentAmount = amount * -1;
                acc.asks.push({
                  price,
                  count,
                  amount: currentAmount,
                  total:
                    currentAmount + (acc.asks[acc.asks.length - 1]?.total || 0),
                });
              }
              return acc;
            },
            { asks: [], bids: [] } as {
              asks: IOrderBookRecord[];
              bids: IOrderBookRecord[];
            }
          );
          dispatch(updateAsksData(asks));
          dispatch(updateBidsData(bids));
        }

        if (data[1].length === 3) {
          const [price, count, amount] = data[1];

          if (count > 0) {
            if (amount > 0) {
              let currentBidIdx = bidsData.findIndex(
                ({ price: currPrice }) => currPrice === price
              );

              if (currentBidIdx === -1) {
                bidsData.push({
                  price,
                  count,
                  amount,
                  total: 0,
                });
                bidsData.sort((a, b) => b.price - a.price);
              }

              currentBidIdx = bidsData.findIndex(
                ({ price: currPrice }) => currPrice === price
              );

              bidsData[currentBidIdx] = {
                price,
                count,
                amount,
                total: amount + (bidsData[currentBidIdx - 1]?.total || 0),
              };

              dispatch(updateBidsData(bidsData));
            } else {
              const currentAmount = amount * -1;
              let currentAskIdx = asksData.findIndex(
                ({ price: currPrice }) => currPrice === price
              );

              if (currentAskIdx === -1) {
                console.log(currentAmount);

                asksData.push({
                  price,
                  count,
                  amount: currentAmount,
                  total: 0,
                });
                asksData.sort((a, b) => a.price - b.price);
              }

              currentAskIdx = asksData.findIndex(
                ({ price: currPrice }) => currPrice === price
              );

              asksData[currentAskIdx] = {
                price,
                count,
                amount: currentAmount,
                total:
                  currentAmount + (asksData[currentAskIdx - 1]?.total || 0),
              };

              dispatch(updateAsksData(asksData));
            }
          } else if (count === 0) {
            if (amount === 1) {
              const bids = [...bidsData].filter(
                ({ price: bidPrice }) => bidPrice !== price
              );

              dispatch(updateBidsData(bids));
            }

            if (amount === -1) {
              const asks = [...asksData].filter(
                ({ price: askPrice }) => askPrice !== price
              );

              dispatch(updateAsksData(asks));
            }
          }
        }
      }
    };

    ws?.addEventListener("message", messageListener);

    return () => {
      ws?.removeEventListener("message", messageListener);

      sendMessage({
        event: "unsubscribe",
        chanId: channelId,
      });

      dispatch(updateAsksData([]));
      dispatch(updateBidsData([]));
    };
  }, [dispatch, precision, sendMessage, symbol, ws]);

  useEffect(() => {
    if (ws?.readyState === 1) {
      sendMessage({
        event: "subscribe",
        channel: "book",
        symbol,
        prec: `P${precision}`,
        freq: `F0`,
        len: "25",
        subId: 123,
      });
    } else {
      ws?.addEventListener("open", () => {
        sendMessage({
          event: "subscribe",
          channel: "book",
          symbol,
          prec: `P${precision}`,
          freq: `F0`,
          len: "25",
          subId: 123,
        });
      });
    }
  }, [precision, sendMessage, symbol, ws]);

  return {
    updatePrecision: setPrecision,
    precision,
  };
};

export default useOrderBook;
