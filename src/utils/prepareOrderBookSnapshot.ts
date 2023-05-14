import { IOrderBookRecord, IOrderBookSnapshot } from "store/orderBook";

export const prepareOrderBookSnapshotMap = (
  data: [number, number, number][]
): {
  asks: IOrderBookSnapshot;
  bids: IOrderBookSnapshot;
} => {
  const { askEntries, bidEntries } = data?.reduce(
    (acc, [price, count, amount]: number[]) => {
      const entries = amount > 0 ? acc.bidEntries : acc.askEntries;

      entries.push([
        price,
        {
          count,
          amount: Math.abs(amount),
        },
      ]);

      return acc;
    },
    { askEntries: [], bidEntries: [] } as {
      askEntries: [number, IOrderBookRecord][];
      bidEntries: [number, IOrderBookRecord][];
    }
  );

  return {
    asks: Object.fromEntries(askEntries),
    bids: Object.fromEntries(bidEntries),
  };
};
