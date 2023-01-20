import { Guid } from "guid-typescript";
import assert from "node:assert";
import {describe, it } from "node:test";
import { IQuote } from "../src/models/quote.model";
import { QuoteManager } from '../src/services/quote-manager.service';

describe('removeAllQuotes method', () => {
  it('removes all quotes', () => {
    const quoteManager = new QuoteManager();
    quoteManager.removeAllQuotes('ABC');
    const quote1: IQuote = {
      id: Guid.create(),
      symbol: 'ABC',
      price: 1.0,
      availableVolume: 100,
      expirationDate: new Date()
    };
    quoteManager.addOrUpdateQuote(quote1);
    const quote2: IQuote = {
      id: Guid.create(),
      symbol: 'ABC',
      price: 2.0,
      availableVolume: 200,
      expirationDate: new Date()
    };
    quoteManager.addOrUpdateQuote(quote2);
    assert.deepEqual(quoteManager.book, { ['ABC']: [quote1, quote2] });
    quoteManager.removeAllQuotes('ABC');
    assert.deepEqual(quoteManager.book, { ['ABC']: [] });
  });
});