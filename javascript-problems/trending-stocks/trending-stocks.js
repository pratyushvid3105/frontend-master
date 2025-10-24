const SYMBOLS_API_BASE_URL =
  "https://api.frontendexpert.io/api/fe/stock-symbols";
const MARKET_CAPS_API_BASE_URL =
  "https://api.frontendexpert.io/api/fe/stock-market-caps";
const PRICES_API_BASE_URL = "https://api.frontendexpert.io/api/fe/stock-prices";

async function trendingStocks(n) {
  if (n === 0) return [];

  const [symbols, marketCaps] = await Promise.all([
    fetch(SYMBOLS_API_BASE_URL).then((res) => res.json()),
    fetch(MARKET_CAPS_API_BASE_URL).then((res) => res.json()),
  ]);

  const capBySymbol = new Map(
    marketCaps.map((mCap) => [mCap.symbol, mCap["market-cap"]])
  );

  const merged = symbols.map((sym) => ({
    symbol: sym.symbol,
    name: sym.name,
    "market-cap": capBySymbol.get(sym.symbol) ?? 0,
  }));

  merged.sort((a, b) => b["market-cap"] - a["market-cap"]);

  const topN = merged.slice(0, n);
  const symbolsParams = JSON.stringify(topN.map((sym) => sym.symbol));

  const prices = await fetch(
    `${PRICES_API_BASE_URL}?symbols=${symbolsParams}`
  ).then((res) => res.json());

  const priceBySymbol = new Map(prices.map((p) => [p.symbol, p]));

  const result = topN.map((el, ind) => {
    const price = priceBySymbol.get(el.symbol);
    return {
      "52-week-high": price["52-week-high"],
      "52-week-low": price["52-week-low"],
      "market-cap": el["market-cap"],
      name: el.name,
      price: price["price"],
      symbol: el.symbol,
    };
  });

  return result;
}
