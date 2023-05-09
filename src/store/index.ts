import { configureStore } from "@reduxjs/toolkit";
import orderBook from "./orderBook";

const store = configureStore({
  reducer: { orderBook },
});

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;

export default store;
