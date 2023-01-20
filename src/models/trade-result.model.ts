import { Guid } from "guid-typescript";

export interface ITradeResult {
  id: Guid;
  symbol: string;
  volumeWeightedAveragePrice: number;
  volumeRequested: number;
  volumeExecuted: number;
}