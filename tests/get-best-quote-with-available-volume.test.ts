import assert from "assert";
import { Guid } from "guid-typescript";
import { describe, it } from "node:test";
import { IQuote } from "../src/models/quote.model";
import { QuoteManager } from '../src/services/quote-manager.service';

describe('getBestQuoteWithAvailableVolume method', () => {
  it('gets the best quote', () => {
    const quoteManager = new QuoteManager();

    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 1);
    const quote1: IQuote = {
      id: Guid.create(),
      symbol: 'ABC',
      price: 1.0,
      availableVolume: 100,
      expirationDate
    };
    quoteManager.addOrUpdateQuote(quote1);
    const quote2: IQuote = {
      id: Guid.create(),
      symbol: 'ABC',
      price: 2.0,
      availableVolume: 200,
      expirationDate
    };
    quoteManager.addOrUpdateQuote(quote2);

    const best = quoteManager.getBestQuoteWithAvailableVolume('ABC');
    assert.deepEqual(best, quote1);
  });

  it('fails because the Symbol does not exist', () => {
    const quoteManager = new QuoteManager();
    assert.throws(() => {
      quoteManager.getBestQuoteWithAvailableVolume('ABC');
    }, new Error('Book Symbol does not exist'));
  });

  it('fails because the Symbol has no Quotes', () => {
    const quoteManager = new QuoteManager();
    const quote: IQuote = {
      id: Guid.create(),
      symbol: 'ABC',
      price: 1.0,
      availableVolume: 100,
      expirationDate: new Date()
    };
    quoteManager.addOrUpdateQuote(quote);
    quoteManager.removeAllQuotes('ABC');
    assert.throws(() => {
      quoteManager.getBestQuoteWithAvailableVolume('ABC');
    }, new Error('Book Symbol has no Quotes'));
  });

  it('fails because the Symbol has no unexpired Quotes', () => {
    const quoteManager = new QuoteManager();
    const quote: IQuote = {
      id: Guid.create(),
      symbol: 'ABC',
      price: 1.0,
      availableVolume: 100,
      expirationDate: new Date()
    };
    quoteManager.addOrUpdateQuote(quote);
    assert.throws(() => {
      quoteManager.getBestQuoteWithAvailableVolume('ABC');
    }, new Error('Book Symbol has no unexpired Quotes'));
  });

  it('returns `null` because the Symbol has no Volume', () => {
    const quoteManager = new QuoteManager();
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 1);
    const quote: IQuote = {
      id: Guid.create(),
      symbol: 'ABC',
      price: 1.0,
      availableVolume: 0,
      expirationDate
    };
    quoteManager.addOrUpdateQuote(quote);
    assert.equal(quoteManager.getBestQuoteWithAvailableVolume('ABC'), null);
  });
});