import React, { useState } from "react";
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

const OrderBook = () => {
  const symbol = useSelector(selectOrderBookSymbol);

  const dispatch = useDispatch();

  const asksData = useSelector(selectOrderBookAsks);
  const bidsData = useSelector(selectOrderBookBids);

  const { updatePrecision, precision } = useOrderBook();

  const increasePresicion = () => {
    updatePrecision((prev) => (prev < 4 ? prev + 1 : prev));
  };

  const decreasePresicion = () => {
    updatePrecision((prev) => (prev > 0 ? prev - 1 : prev));
  };

  return (
    <Box>
      <Button onClick={decreasePresicion} disabled={precision === 0}>
        {"<-"} .0{" "}
      </Button>
      <Button onClick={increasePresicion} disabled={precision === 4}>
        .00 {"->"}
      </Button>

      <Select
        value={symbol}
        onChange={(e) => dispatch(updateSymbol(e.target.value || ""))}
      >
        <MenuItem value="tBTCUSD">BTCUSD</MenuItem>
        <MenuItem value="tETHUSD">ETHUSD</MenuItem>
      </Select>

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
            <TableBody>
              {asksData.map(({ count, price, total, amount }) => (
                <TableRow key={`${count} ${price} ${total} ${amount}`}>
                  <TableCell>{count}</TableCell>
                  <TableCell>{amount}</TableCell>
                  <TableCell>{total}</TableCell>
                  <TableCell>{price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

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
            <TableBody>
              {bidsData.map(({ count, price, total, amount }) => (
                <TableRow key={`${count} ${price} ${total} ${amount}`}>
                  <TableCell>{count}</TableCell>
                  <TableCell>{amount}</TableCell>
                  <TableCell>{total}</TableCell>
                  <TableCell>{price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Box>
  );
};

export default OrderBook;
