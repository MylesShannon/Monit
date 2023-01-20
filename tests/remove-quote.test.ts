import { Guid } from "guid-typescript";
import assert from "node:assert";
import { describe, it } from "node:test";
import { IQuote } from "../src/models/quote.model";
import { QuoteManager } from '../src/services/quote-manager.service';

describe('removeQuote method', () => {
  it('removes a quote', () => {
    const quoteManager = new QuoteManager();
    const id = Guid.create();
    const quote: IQuote = {
      id,
      symbol: 'ABC',
      price: 1.0,
      availableVolume: 100,
      expirationDate: new Date()
    };
    quoteManager.addOrUpdateQuote(quote);
    assert.deepEqual(quoteManager.book, { ['ABC']: [quote] });
    quoteManager.removeQuote(id);
    assert.deepEqual(quoteManager.book, { ['ABC']: [] });
  });
});