import React, { createContext, useContext, useState } from "react";
import { Cell } from "../types/cellTypes";

type MatrixContextType = {
  matrix: Cell[][];
  setMatrix: (matrix: Cell[][]) => void;
};

const MatrixContext = createContext<MatrixContextType | undefined>(undefined);

export const useMatrix = () => {
  const context = useContext(MatrixContext);
  if (!context) {
    throw new Error("useMatrix must be used within a MatrixProvider");
  }
  return context;
};

export const MatrixProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [matrix, setMatrix] = useState<Cell[][]>([]);

  return (
    <MatrixContext.Provider value={{ matrix, setMatrix }}>
      {children}
    </MatrixContext.Provider>
  );
};
