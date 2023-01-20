import { Guid } from "guid-typescript";

export interface IQuote {
  id: Guid;
  symbol: string,
  price: number;
  availableVolume: number;
  expirationDate: Date;
}