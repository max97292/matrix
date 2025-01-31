import React, { useState } from "react";
import { MatrixProvider } from "./context/MatrixContext";
import Matrix from "./components/Matrix";
import "./styles.css";

const App: React.FC = () => {
  const [M, setM] = useState(5);
  const [N, setN] = useState(5);

  return (
    <MatrixProvider>
      <div>
        <div className="inputs-container">
          <label>
            Rows (M):
            <input
              type="number"
              value={M}
              onChange={(e) => setM(Number(e.target.value))}
              min={0}
              max={100}
              className="x-input"
            />{" "}
          </label>
          <label>
            Columns (N):
            <input
              type="number"
              value={N}
              onChange={(e) => setN(Number(e.target.value))}
              min={0}
              max={100}
              className="x-input"
            />
          </label>
        </div>
        <Matrix M={M} N={N} setM={setM} />
      </div>
    </MatrixProvider>
  );
};

export default App;
