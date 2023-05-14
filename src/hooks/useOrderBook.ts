import { PublicWsContext } from "context/PublicWsContext";
import { useContext, useEffect } from "react";
import useDispatch from "./useDispatch";
import {
  deleteAskPrice,
  deleteBidPrice,
  resetOrderBookData,
  saveOrderBookSnapshot,
  updateAsksByPrice,
  updateBidsByPrice,
} from "store/orderBook";
import { useSelector } from "react-redux";
import { selectOrderBookSymbol } from "store/orderBook/selector";
import { prepareOrderBookSnapshotMap } from "utils/prepareOrderBookSnapshot";

const useOrderBook = (precision: number) => {
  const symbol = useSelector(selectOrderBookSymbol);
  const { ws, sendMessage } = useContext(PublicWsContext);

  const dispatch = useDispatch();

  useEffect(() => {
    let channelId: number | null = null;

    const messageListener = (e: MessageEvent) => {
      const data = JSON.parse(e.data);

      if (data.event === "subscribed" && data.channel === "book") {
        channelId = data.chanId;
      }

      if (data[0] === channelId) {
        if (data[1].length > 3) {
          const orderBookSnapshot = prepareOrderBookSnapshotMap(data[1]);
          dispatch(saveOrderBookSnapshot(orderBookSnapshot));
        }

        if (data[1].length === 3) {
          const [price, count, amount] = data[1];

          if (count === 0) {
            if (amount === 1) {
              dispatch(deleteBidPrice(price));
            }
            if (amount === -1) {
              dispatch(deleteAskPrice(price));
            }
          }

          if (count > 0) {
            if (amount > 0) {
              dispatch(
                updateBidsByPrice({
                  price,
                  count,
                  amount,
                })
              );
            } else if (amount < 0) {
              dispatch(
                updateAsksByPrice({
                  price,
                  count,
                  amount: Math.abs(amount),
                })
              );
            }
          }
        }
      }
    };

    ws?.addEventListener("message", messageListener);

    sendMessage({
      event: "subscribe",
      channel: "book",
      symbol,
      prec: `P${precision}`,
      freq: `F0`,
      len: "25",
      subId: 123,
    });

    return () => {
      ws?.removeEventListener("message", messageListener);

      if (channelId) {
        sendMessage({
          event: "unsubscribe",
          chanId: channelId,
        });
      }

      dispatch(resetOrderBookData());
    };
  }, [dispatch, precision, sendMessage, symbol, ws]);
};

export default useOrderBook;
