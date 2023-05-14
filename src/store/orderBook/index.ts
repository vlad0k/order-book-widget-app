import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import omit from "lodash.omit";

export interface IOrderBookRecord {
  count: number;
  amount: number;
}

export type IOrderBookSnapshot = Record<string, IOrderBookRecord>;

interface OrderBookState {
  symbol: string | null;
  asks: IOrderBookSnapshot;
  bids: IOrderBookSnapshot;
}

const initialState: OrderBookState = {
  symbol: "tBTCUSD",
  asks: {},
  bids: {},
};

const orderBookSlice = createSlice({
  name: "orderBook",
  initialState,
  reducers: {
    updateSymbol(state, action: PayloadAction<string>) {
      state.symbol = action.payload;
    },

    saveOrderBookSnapshot(
      state,
      action: PayloadAction<{
        asks: IOrderBookSnapshot;
        bids: IOrderBookSnapshot;
      }>
    ) {
      state.asks = action.payload.asks;
      state.bids = action.payload.bids;
    },

    resetOrderBookData(state) {
      state.asks = {};
      state.bids = {};
    },

    updateAsksByPrice(
      state,
      action: PayloadAction<{ price: number; count: number; amount: number }>
    ) {
      const { price, ...redordData } = action.payload;
      state.asks[price] = { ...redordData };
    },

    updateBidsByPrice(
      state,
      action: PayloadAction<{ price: number; count: number; amount: number }>
    ) {
      const { price, ...redordData } = action.payload;
      state.bids[price] = { ...redordData };
    },

    deleteAskPrice(state, action: PayloadAction<number>) {
      state.asks = omit(state.asks, action.payload);
    },

    deleteBidPrice(state, action: PayloadAction<number>) {
      state.bids = omit(state.bids, action.payload);
    },
  },
});

export const {
  updateSymbol,
  saveOrderBookSnapshot,
  deleteAskPrice,
  deleteBidPrice,
  resetOrderBookData,
  updateAsksByPrice,
  updateBidsByPrice,
} = orderBookSlice.actions;

export default orderBookSlice.reducer;
