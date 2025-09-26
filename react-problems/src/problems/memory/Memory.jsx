import { useEffect, useState } from "react";

const TILE_COLORS = ["red", "green", "blue", "yellow"];

export default function Memory() {
  const [tiles, setTiles] = useState(shuffle([...TILE_COLORS, ...TILE_COLORS]));
  const [selectedTiles, setSelectedTiles] = useState([]);
  const [matchedTiles, setMatchedTiles] = useState([]);

  useEffect(() => {
    if (selectedTiles.length < 2) return;

    if (tiles[selectedTiles[0]] === tiles[selectedTiles[1]]) {
      setMatchedTiles([...matchedTiles, ...selectedTiles]);
      setSelectedTiles([]);
    } else {
      const timeoutId = setTimeout(() => setSelectedTiles([]), 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [selectedTiles]);

  const handleTileClick = (tileIndex) => {
    if (
      selectedTiles.length >= 2 ||
      selectedTiles.includes(tileIndex) ||
      matchedTiles.includes(tileIndex)
    ) {
      return;
    }
    setSelectedTiles([...selectedTiles, tileIndex]);
  };

  const handleRestart = () => {
    setMatchedTiles([]);
    setSelectedTiles([]);
    setTiles(shuffle([...TILE_COLORS, ...TILE_COLORS]));
  };

  const playerWinStatus = matchedTiles.length === tiles.length;

  return (
    <>
      <h1>{playerWinStatus ? "You Win!" : "Memory"}</h1>
      <div className="board">
        {tiles.map((tileColor, tileIndex) => {
          const isPairMatched =
            selectedTiles.includes(tileIndex) ||
            matchedTiles.includes(tileIndex);
          const className = isPairMatched ? `tile ${tileColor}` : "tile";
          return (
            <div
              key={tileIndex}
              className={className}
              onClick={() => handleTileClick(tileIndex)}
            ></div>
          );
        })}
      </div>
      {playerWinStatus && (
        <button onClick={() => handleRestart()}>Restart</button>
      )}
    </>
  );
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));

    // Swap the elements at i and randomIndex
    [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
  }
  return array;
}
