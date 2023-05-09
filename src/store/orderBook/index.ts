import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface IOrderBookRecord {
  count: number;
  amount: number;
  total: number;
  price: number;
}

interface OrderBookState {
  symbol: string | null;
  asks: IOrderBookRecord[];
  bids: IOrderBookRecord[];
}

const initialState: OrderBookState = {
  symbol: "tBTCUSD",
  asks: [],
  bids: [],
};

const orderBookSlice = createSlice({
  name: "orderBook",
  initialState,
  reducers: {
    updateAsksData(state, action: PayloadAction<IOrderBookRecord[]>) {
      state.asks = action.payload;
    },
    updateBidsData(state, action: PayloadAction<IOrderBookRecord[]>) {
      state.bids = action.payload;
    },
    updateSymbol(state, action: PayloadAction<string>) {
      state.symbol = action.payload;
    },
  },
});

export const { updateSymbol, updateAsksData, updateBidsData } =
  orderBookSlice.actions;

export default orderBookSlice.reducer;
