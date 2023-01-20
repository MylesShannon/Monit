import { Guid } from "guid-typescript";
import assert from "node:assert";
import { describe, it } from "node:test";
import { IQuote } from "../src/models/quote.model";
import { QuoteManager } from '../src/services/quote-manager.service';

describe('executeTrade method', () => {
  it('executes two trades', () => {
    const quoteManager = new QuoteManager();
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 1);
    const quote1: IQuote = {
      id: Guid.create(),
      symbol: 'ABC',
      price: 1.0,
      availableVolume: 750,
      expirationDate
    };
    quoteManager.addOrUpdateQuote(quote1);
    const quote2: IQuote = {
      id: Guid.create(),
      symbol: 'ABC',
      price: 2.0,
      availableVolume: 1000,
      expirationDate
    };
    quoteManager.addOrUpdateQuote(quote2);

    const trade1 = quoteManager.executeTrade('ABC', 500);
    assert.deepEqual(trade1, {
      id: trade1.id,
      symbol: 'ABC',
      volumeWeightedAveragePrice: 3,
      volumeRequested: 500,
      volumeExecuted: 500
    });
    assert.deepEqual(quoteManager.book, { ['ABC']: [
      {
        ...quote1,
        availableVolume: 250
      },
      {
        ...quote2,
        availableVolume: 1000
      }
    ]});
    const trade2 = quoteManager.executeTrade('ABC', 500);
    assert.deepEqual(trade2, {
      id: trade2.id,
      symbol: 'ABC',
      volumeWeightedAveragePrice: 3,
      volumeRequested: 500,
      volumeExecuted: 500
    });
    assert.deepEqual(quoteManager.book, { ['ABC']: [
      {
        ...quote1,
        availableVolume: 0
      },
      {
        ...quote2,
        availableVolume: 750
      }
    ]});
  });

  it('executes two trades w/ swapped price order', () => {
    const quoteManager = new QuoteManager();
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 1);
    const quote1: IQuote = {
      id: Guid.create(),
      symbol: 'ABC',
      price: 2.0,
      availableVolume: 750,
      expirationDate
    };
    quoteManager.addOrUpdateQuote(quote1);
    const quote2: IQuote = {
      id: Guid.create(),
      symbol: 'ABC',
      price: 1.0,
      availableVolume: 1000,
      expirationDate
    };
    quoteManager.addOrUpdateQuote(quote2);

    const trade1 = quoteManager.executeTrade('ABC', 500);
    assert.deepEqual(trade1, {
      id: trade1.id,
      symbol: 'ABC',
      volumeWeightedAveragePrice: 3,
      volumeRequested: 500,
      volumeExecuted: 500
    });
    assert.deepEqual(quoteManager.book, { ['ABC']: [
      {
        ...quote1,
        availableVolume: 750
      },
      {
        ...quote2,
        availableVolume: 500
      }
    ]});
    const trade2 = quoteManager.executeTrade('ABC', 500);
    assert.deepEqual(trade2, {
      id: trade2.id,
      symbol: 'ABC',
      volumeWeightedAveragePrice: 3,
      volumeRequested: 500,
      volumeExecuted: 500
    });
    assert.deepEqual(quoteManager.book, { ['ABC']: [
      {
        ...quote1,
        availableVolume: 750
      },
      {
        ...quote2,
        availableVolume: 0
      }
    ]});
  });

  it('executes two trades leaving the second untouched', () => {
    const quoteManager = new QuoteManager();
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 1);
    const quote1: IQuote = {
      id: Guid.create(),
      symbol: 'ABC',
      price: 1.0,
      availableVolume: 500,
      expirationDate
    };
    quoteManager.addOrUpdateQuote(quote1);
    const quote2: IQuote = {
      id: Guid.create(),
      symbol: 'ABC',
      price: 2.0,
      availableVolume: 1000,
      expirationDate
    };
    quoteManager.addOrUpdateQuote(quote2);

    const trade1 = quoteManager.executeTrade('ABC', 250);
    assert.deepEqual(trade1, {
      id: trade1.id,
      symbol: 'ABC',
      volumeWeightedAveragePrice: 3,
      volumeRequested: 250,
      volumeExecuted: 250
    });
    assert.deepEqual(quoteManager.book, { ['ABC']: [
      {
        ...quote1,
        availableVolume: 250
      },
      {
        ...quote2,
        availableVolume: 1000
      }
    ]});
    const trade2 = quoteManager.executeTrade('ABC', 250);
    assert.deepEqual(trade2, {
      id: trade2.id,
      symbol: 'ABC',
      volumeWeightedAveragePrice: 3,
      volumeRequested: 250,
      volumeExecuted: 250
    });
    assert.deepEqual(quoteManager.book, { ['ABC']: [
      {
        ...quote1,
        availableVolume: 0
      },
      {
        ...quote2,
        availableVolume: 1000
      }
    ]});
  });

  it('executes two trades w/ different volumes', () => {
    const quoteManager = new QuoteManager();
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 1);
    const quote1: IQuote = {
      id: Guid.create(),
      symbol: 'ABC',
      price: 2.0,
      availableVolume: 750,
      expirationDate
    };
    quoteManager.addOrUpdateQuote(quote1);
    const quote2: IQuote = {
      id: Guid.create(),
      symbol: 'ABC',
      price: 1.0,
      availableVolume: 250,
      expirationDate
    };
    quoteManager.addOrUpdateQuote(quote2);

    const trade1 = quoteManager.executeTrade('ABC', 500);
    assert.deepEqual(trade1, {
      id: trade1.id,
      symbol: 'ABC',
      volumeWeightedAveragePrice: 3,
      volumeRequested: 500,
      volumeExecuted: 500
    });
    assert.deepEqual(quoteManager.book, { ['ABC']: [
      {
        ...quote1,
        availableVolume: 500
      },
      {
        ...quote2,
        availableVolume: 0
      }
    ]});
    const trade2 = quoteManager.executeTrade('ABC', 500);
    assert.deepEqual(trade2, {
      id: trade2.id,
      symbol: 'ABC',
      volumeWeightedAveragePrice: 3,
      volumeRequested: 500,
      volumeExecuted: 500
    });
    assert.deepEqual(quoteManager.book, { ['ABC']: [
      {
        ...quote1,
        availableVolume: 0
      },
      {
        ...quote2,
        availableVolume: 0
      }
    ]});
  });

  it('executes a trade w/o enough volume', () => {
    const quoteManager = new QuoteManager();
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 1);
    const quote: IQuote = {
      id: Guid.create(),
      symbol: 'ABC',
      price: 2.0,
      availableVolume: 500,
      expirationDate
    };
    quoteManager.addOrUpdateQuote(quote);

    const trade1 = quoteManager.executeTrade('ABC', 750);
    assert.deepEqual(trade1, {
      id: trade1.id,
      symbol: 'ABC',
      volumeWeightedAveragePrice: 2,
      volumeRequested: 750,
      volumeExecuted: 500
    });
    assert.deepEqual(quoteManager.book, { ['ABC']: [
      {
        ...quote,
        availableVolume: 0
      }
    ]});
  });

  it('executes a trade w/o volume', () => {
    const quoteManager = new QuoteManager();
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 1);
    const quote: IQuote = {
      id: Guid.create(),
      symbol: 'ABC',
      price: 2.0,
      availableVolume: 500,
      expirationDate
    };
    quoteManager.addOrUpdateQuote(quote);

    const trade1 = quoteManager.executeTrade('ABC', 0);
    assert.deepEqual(trade1, {
      id: trade1.id,
      symbol: 'ABC',
      volumeWeightedAveragePrice: 0,
      volumeRequested: 0,
      volumeExecuted: 0
    });
    assert.deepEqual(quoteManager.book, { ['ABC']: [
      {
        ...quote,
        availableVolume: 500
      }
    ]});
  });

  it('fails because the Symbol does not exist', () => {
    const quoteManager = new QuoteManager();
    assert.throws(() => {
      quoteManager.executeTrade('ABC', 500);
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
      quoteManager.executeTrade('ABC', 500);
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
      quoteManager.executeTrade('ABC', 500);
    }, new Error('Book Symbol has no unexpired Quotes'));
  });
});