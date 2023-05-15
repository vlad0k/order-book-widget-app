import { IOrderBookSnapshot } from "store/orderBook";

export const generateOrderBookTableRowsWithTotal = (
  snapshot: IOrderBookSnapshot
) => {
  let currentTotal = 0;

  return Object.entries(snapshot).map(([price, { count, amount }]) => {
    currentTotal += amount;

    return {
      count,
      amount,
      total: currentTotal,
      price,
    };
  });
};
