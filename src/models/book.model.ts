import { IQuote } from "./quote.model";

export interface Book {
  [key: string]: Array<IQuote>
}