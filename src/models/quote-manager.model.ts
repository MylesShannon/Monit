import { Guid } from "guid-typescript";
import { Book } from "./book.model";
import { IQuote } from "./quote.model";
import { ITradeResult } from "./trade-result.model";

export interface IQuoteManager {
  book: Book; // A list of Quotes indexed by Symbol
  
  // Add or update the quote (specified by Id) in symbol's book. 
  // If quote is new or no longer in the book, add it. Otherwise update it to match the given price, volume, and symbol.
  addOrUpdateQuote: (quote: IQuote) => void;

  
  // NOTE: Would be good to pass in the `symbol` value here or better yet, be used on a `Symbol` class for a separate object
  
  // Remove quote by Id, if quote is no longer in symbol's book do nothing.
  removeQuote: (id: Guid) => void;

  // Remove all quotes on the specifed symbol's book.
  removeAllQuotes: (symbol: string) => void;

  // Get the best (i.e. lowest) price in the symbol's book that still has available volume.
  // If there is no quote on the symbol's book with available volume, return null.
  // Otherwise return a Quote object with all the fields set.
  // Don't return any quote which is past its expiration time, or has been removed.
  getBestQuoteWithAvailableVolume: (symbol: string) => IQuote;

  // Request that a trade be executed. For the purposes of this interface, assume that the trade is a request to BUY, not sell. Do not trade an expired quotes.
  // To Execute a trade:
  //   * Search available quotes of the specified symbol from best price to worst price.
  //   * Until the requested volume has been filled, use as much available volume as necessary (up to what is available) from each quote, subtracting the used amount from the available amount.
  // For example, we have two quotes:
  //   {Price: 1.0, Volume: 1,000, AvailableVolume: 750}
  //   {Price: 2.0, Volume: 1,000, AvailableVolume: 1,000}
  // After calling once for 500 volume, the quotes are:
  //   {Price: 1.0, Volume: 1,000, AvailableVolume: 250}
  //   {Price: 2.0, Volume: 1,000, AvailableVolume: 1,000}
  // And After calling this a second time for 500 volume, the quotes are:
  //   {Price: 1.0, Volume: 1,000, AvailableVolume: 0}
  //   {Price: 2.0, Volume: 1,000, AvailableVolume: 750}
  executeTrade: (symbol: string, volumeRequested: number) => ITradeResult;
}