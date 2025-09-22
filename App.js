import React, { useEffect, useState } from "react";
import "./styles.css";

const ROWS = 15;   // number of rows
const COLS = 25;   // number of columns

function App() {
  const [activeCol, setActiveCol] = useState(-1); // -1 means idle/black screen
  const [direction, setDirection] = useState(1);  // 1 → right, -1 → left
  const [colorShift, setColorShift] = useState(0);

  useEffect(() => {
    // Start the scanner after 1 second
    const startTimeout = setTimeout(() => {
      setActiveCol(0);
    }, 1000);

    // Scanner movement interval
    const interval = setInterval(() => {
      setActiveCol((prev) => {
        if (prev === -1) return prev; // idle, still black

        if (prev === COLS - 1 && direction === 1) {
          setDirection(-1);
          return prev - 1;
        } else if (prev === 0 && direction === -1) {
          setDirection(1);
          return prev + 1;
        }
        return prev + direction;
      });
    }, 100);

    // Color shifting interval (optional rainbow effect)
    const colorInterval = setInterval(() => {
      setColorShift((prev) => (prev + 40) % 360);
    }, 2000);

    return () => {
      clearTimeout(startTimeout);
      clearInterval(interval);
      clearInterval(colorInterval);
    };
  }, [direction]);

  return (
    <div className="game-container">
      <h1 className="title">Scanner Wave Grid</h1>
      <div
        className="grid"
        style={{ gridTemplateColumns: `repeat(${COLS}, 25px)` }}
      >
        {Array.from({ length: ROWS * COLS }).map((_, index) => {
          const row = Math.floor(index / COLS);
          const col = index % COLS;

          if (activeCol === -1) {
            // Before animation starts → everything black
            return (
              <div
                key={index}
                className="cell"
                style={{ backgroundColor: "black" }}
              ></div>
            );
          }

          // Distance from scanner column
          const dist = Math.abs(activeCol - col);

          // Cells closer to the scanner are brighter
          const intensity = Math.max(0, 1 - dist / 6);

          // Dynamic rainbow color
          const hue = (colorShift + col * 5) % 360;
          const color = `hsl(${hue}, 100%, ${20 + intensity * 50}%)`;

          // If too far → keep black
          const bg = dist < 6 ? color : "black";

          return (
            <div
              key={index}
              className="cell"
              style={{ backgroundColor: bg }}
            ></div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
