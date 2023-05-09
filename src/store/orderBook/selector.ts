import { RootState } from "store";

export const selectOrderBookAsks = (state: RootState) => state.orderBook.asks;

export const selectOrderBookBids = (state: RootState) => state.orderBook.bids;

export const selectOrderBookSymbol = (state: RootState) =>
  state.orderBook.symbol;
