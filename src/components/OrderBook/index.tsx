import React, { useContext, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  selectOrderBookAsks,
  selectOrderBookBids,
  selectOrderBookSymbol,
} from "store/orderBook/selector";

import useOrderBook from "hooks/useOrderBook";
import useDispatch from "hooks/useDispatch";
import { updateSymbol } from "store/orderBook";
import { PublicWsContext } from "context/PublicWsContext";
import Table, { ITableConfig } from "components/ui/Table";
import { generateOrderBookTableRowsWithTotal } from "utils/generateOrderBookTableRowsWithTotal";
import roundToPrecition from "utils/roundToPrecition";

import classes from "./styles.module.css";
import TextButton from "components/ui/TextButton";
import OnlineIndicator from "components/OnlineIndicator";

const tableConfigBase: ITableConfig[] = [
  {
    field: "count",
    title: "COUNT",
  },
  {
    field: "amount",
    title: "AMOUNT",
    renderCell: (v) => roundToPrecition(+v, 0.0001),
  },
  {
    field: "total",
    title: "TOTAL",
    renderCell: (v) => roundToPrecition(+v, 0.0001),
  },
];

const asksTableConfig: ITableConfig[] = [
  ...tableConfigBase,
  {
    field: "price",
    title: "PRICE",
    renderCell: (v) => v.toLocaleString(),
    cellStyle: { textAlign: "right" },
  },
];

const bidsTableConfig: ITableConfig[] = [
  {
    field: "price",
    title: "PRICE",
    renderCell: (v) => v.toLocaleString(),
    cellStyle: { textAlign: "left" },
  },
  ...tableConfigBase.reverse(),
];

const OrderBook = () => {
  const [precision, setPrecision] = useState(0);

  const symbol = useSelector(selectOrderBookSymbol);

  const dispatch = useDispatch();

  const asks = useSelector(selectOrderBookAsks);
  const bids = useSelector(selectOrderBookBids);

  const askRows = useMemo(
    () => generateOrderBookTableRowsWithTotal(asks),
    [asks]
  );

  const bidsRows = useMemo(
    () => generateOrderBookTableRowsWithTotal(bids),
    [bids]
  );

  const { reconnectWs, isOnline } = useContext(PublicWsContext);

  useOrderBook(precision);

  const increasePresicion = () => {
    setPrecision((prev) => (prev < 4 ? prev + 1 : prev));
  };

  const decreasePresicion = () => {
    setPrecision((prev) => (prev > 0 ? prev - 1 : prev));
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.topActions}>
        <select
          value={symbol || ""}
          onChange={(e) => dispatch(updateSymbol(e.target.value || ""))}
        >
          <option value="tBTCUSD">BTCUSD</option>
          <option value="tETHUSD">ETHUSD</option>
        </select>

        <div>
          <TextButton onClick={increasePresicion} disabled={precision === 4}>
            {"<-"} .0
          </TextButton>

          <TextButton onClick={decreasePresicion} disabled={precision === 0}>
            .00 {"->"}
          </TextButton>
        </div>
      </div>

      <div className={classes.tablesContainer}>
        <div className={classes.tableWrapper}>
          <Table config={asksTableConfig} data={askRows} />
        </div>

        <div className={classes.tableWrapper}>
          <Table config={bidsTableConfig} data={bidsRows} />
        </div>
      </div>

      <div>
        <OnlineIndicator isOnline={isOnline} onReconnect={reconnectWs} />
      </div>
    </div>
  );
};

export default OrderBook;
