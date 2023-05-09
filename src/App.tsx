import React from "react";

import { Provider } from "react-redux";

import OrderBook from "components/OrderBook";
import { PublicWsContextProvider } from "context/PublicWsContext";

import store from "store";

import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <PublicWsContextProvider>
        <OrderBook />
      </PublicWsContextProvider>
    </Provider>
  );
}

export default App;
