import { Book } from "../models/book.model";
import { IQuoteManager } from "../models/quote-manager.model";
import { IQuote } from "../models/quote.model";
import { ITradeResult } from "../models/trade-result.model";
import { Guid } from "guid-typescript";

export class QuoteManager implements IQuoteManager {
  private _book: Book = {};

  get book(): Book {
    return this._book;
  }
  
  addOrUpdateQuote(quote: IQuote): void {
    if (!quote.symbol) {
      throw new Error('Missing Symbol');
    }
    if (!quote.id) {
      throw new Error('Missing ID');
    }

    if (this._book[quote.symbol]?.length > 0) {
      const index = this._book[quote.symbol].findIndex(q => q.id.equals(quote.id));
      if (index > -1) {
        this._book[quote.symbol]  = this._book[quote.symbol].map((q, i) => {
          if (index !== i) {
            return q;
          }
          return { ...q, ...quote };
        });
      } else {
        this._book[quote.symbol] = [...this._book[quote.symbol], quote];
      }
    } else {
      this._book[quote.symbol] = [quote];
    }
  }

  removeQuote(id: Guid): void {
    if (!Guid.isGuid(id)) {
      throw new Error('Missing ID');
    }

    for (const symbol in this._book) {
      const index = this._book[symbol].findIndex(quote => quote.id.equals(id));
      if (index > -1) {
        this._book[symbol] = [...this._book[symbol].slice(0, index), ...this._book[symbol].slice(index + 1)];
      }
    }
  }
  
  removeAllQuotes(symbol: string): void {
    if (!symbol) {
      throw new Error('Missing Symbol');
    }
    if (this._book[symbol]) {
      this._book[symbol] = [];
    }
  }

  getBestQuoteWithAvailableVolume(symbol: string): IQuote {
    if (!symbol) {
      throw new Error('Missing Symbol');
    }
    if (!this._book[symbol]) {
      throw new Error('Book Symbol does not exist');
    }
    if (this._book[symbol]?.length === 0) {
      throw new Error('Book Symbol has no Quotes');
    }
    const quotes = this._book[symbol].filter(quote => quote.expirationDate > new Date());
    if (quotes?.length === 0) {
      throw new Error('Book Symbol has no unexpired Quotes');
    }
    const availableVolumePrices = quotes.filter(quote => quote.availableVolume > 0);
    if (availableVolumePrices?.length === 0) {
      // Book Symbol Quote has no available Volume
      return null;
    }

    return quotes.sort((a, b) => a.price - b.price)[0];
  }

  executeTrade(symbol: string, volumeRequested: number): ITradeResult {
    if (!symbol) {
      throw new Error('Missing Symbol');
    }
    if (!volumeRequested && volumeRequested !== 0) {
      throw new Error('Missing Volume Requested');
    }
    if (!this._book[symbol]) {
      throw new Error('Book Symbol does not exist');
    }
    if (this._book[symbol]?.length === 0) {
      throw new Error('Book Symbol has no Quotes');
    }
    const quotes = this._book[symbol].filter(quote => quote.expirationDate > new Date());
    if (quotes?.length === 0) {
      throw new Error('Book Symbol has no unexpired Quotes');
    }
    
    let volumeExecuted = 0;
    let volumeLeft = volumeRequested;
    let totalPrice = 0;
    [...quotes].sort((a, b) => a.price - b.price).forEach(quote => {
      if (quote && volumeLeft > 0) {
        if (quote.availableVolume - volumeLeft <= 0) {
          volumeLeft = volumeLeft - quote.availableVolume;
          volumeExecuted += quote.availableVolume;
          quote.availableVolume = 0;
        } else {
          quote.availableVolume = quote.availableVolume - volumeLeft;
          volumeExecuted += volumeLeft;
          volumeLeft = 0;
        }
      }
      totalPrice += quote.price;
    });
    const volumeWeightedAveragePrice = volumeRequested > 0 ? (totalPrice * volumeRequested) / volumeRequested : 0;
    const result: ITradeResult = {
      id: Guid.create(),
      symbol,
      volumeWeightedAveragePrice,
      volumeRequested,
      volumeExecuted
    };
    return result;
  }
}