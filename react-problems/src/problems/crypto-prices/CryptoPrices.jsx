import { useEffect, useState } from "react";

const CRYPTO_PRICES_API_BASE_URL = "/api/fe/cryptocurrencies";

export default function CryptoPrices() {
  const [currentPage, setCurrentPage] = useState(0);
  const [coins, setCoins] = useState([]);
  const [isNextPage, setIsNextPage] = useState(false);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await fetch(
          `${CRYPTO_PRICES_API_BASE_URL}?page=${currentPage}`
        );
        const data = await response.json();
        setCoins(data.coins);
        setIsNextPage(data.hasNext);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCoins();
  }, [currentPage]);

  return (
    <>
      <table>
        <caption>Crypto Prices</caption>
        <thead>
          <tr>
            <th scope="col">Coin</th>
            <th scope="col">Price</th>
            <th scope="col">Market Cap</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin) => {
            return (
              <tr key={coin.name}>
                <th scope="row">{coin.name}</th>
                <td>{coin.price}</td>
                <td>{coin.marketCap}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button
        disabled={currentPage === 0}
        onClick={() => {
          if (currentPage > 0) {
            setCurrentPage((prev) => prev - 1);
          }
        }}
      >
        Back
      </button>
      <button
        disabled={!isNextPage}
        onClick={() => {
          if (isNextPage) {
            setCurrentPage((prev) => prev + 1);
          }
        }}
      >
        Next
      </button>
    </>
  );
}
