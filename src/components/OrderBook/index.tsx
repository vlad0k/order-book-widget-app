import React, { useContext, useMemo, useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
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

const OrderBook = () => {
  const [precision, setPrecision] = useState(0);

  const symbol = useSelector(selectOrderBookSymbol);

  const dispatch = useDispatch();

  const asks = useSelector(selectOrderBookAsks);
  const bids = useSelector(selectOrderBookBids);

  const askRows = useMemo(() => {
    let currentTotal = 0;

    return Object.entries(asks)
      .reverse()
      .map(([price, { count, amount }]) => {
        currentTotal += amount;

        return (
          <TableRow key={price}>
            <TableCell>{count}</TableCell>
            <TableCell>{amount}</TableCell>
            <TableCell>{currentTotal}</TableCell>
            <TableCell>{price}</TableCell>
          </TableRow>
        );
      });
  }, [asks]);

  const bidsRows = useMemo(() => {
    let currentTotal = 0;

    return Object.entries(bids).map(([price, { count, amount }]) => {
      currentTotal += amount;

      return (
        <TableRow key={price}>
          <TableCell>{count}</TableCell>
          <TableCell>{amount}</TableCell>
          <TableCell>{currentTotal}</TableCell>
          <TableCell>{price}</TableCell>
        </TableRow>
      );
    });
  }, [bids]);

  const { reconnectWs, isOnline } = useContext(PublicWsContext);

  useOrderBook(precision);

  const increasePresicion = () => {
    setPrecision((prev) => (prev < 4 ? prev + 1 : prev));
  };

  const decreasePresicion = () => {
    setPrecision((prev) => (prev > 0 ? prev - 1 : prev));
  };

  return (
    <Box>
      <Button onClick={increasePresicion} disabled={precision === 4}>
        {"<-"} .0
      </Button>

      <Button onClick={decreasePresicion} disabled={precision === 0}>
        .00 {"->"}
      </Button>

      <Select
        value={symbol}
        onChange={(e) => dispatch(updateSymbol(e.target.value || ""))}
      >
        <MenuItem value="tBTCUSD">BTCUSD</MenuItem>
        <MenuItem value="tETHUSD">ETHUSD</MenuItem>
      </Select>

      <Typography color={isOnline ? "green" : "error"} display="inline" ml={2}>
        {isOnline ? "Online" : "Disconnected"}
      </Typography>

      {!isOnline && <Button onClick={reconnectWs}>Reconnect</Button>}

      <Box display="flex" gap={1} p={1}>
        <Paper sx={{ flex: 1 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Count</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{askRows}</TableBody>
          </Table>
        </Paper>

        <Paper sx={{ flex: 1 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Price</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{bidsRows}</TableBody>
          </Table>
        </Paper>
      </Box>
    </Box>
  );
};

export default OrderBook;
