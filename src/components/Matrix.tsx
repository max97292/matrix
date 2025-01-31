import React, { useState, useEffect } from "react";
import { useMatrix } from "../context/MatrixContext";
import "../styles.css";
import {
  calculatePercentile50,
  generateRandomCellValue,
} from "../utils/matrixUtils";
import { Cell } from "../types/cellTypes";

const Matrix: React.FC<{
  M: number;
  N: number;
  setM: (value: React.SetStateAction<number>) => void;
}> = ({ M, N, setM }) => {
  const { matrix, setMatrix } = useMatrix();
  const [xValue, setXValue] = useState<number>(5);
  const [highlightedCells, setHighlightedCells] = useState<Set<number>>(
    new Set()
  );

  const [hoveredSumRowIndex, setHoveredSumRowIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    const generateMatrix = () => {
      const newMatrix: Cell[][] = [];
      let idCounter = 1;

      for (let i = 0; i < M; i++) {
        const row: Cell[] = [];
        for (let j = 0; j < N; j++) {
          row.push({
            id: idCounter++,
            amount: generateRandomCellValue(),
          });
        }
        newMatrix.push(row);
      }

      setMatrix(newMatrix);
    };

    generateMatrix();
  }, [M, N, setMatrix]);

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    const newMatrix = [...matrix];
    newMatrix[rowIndex][colIndex].amount += 1;
    setMatrix(newMatrix);
  };

  const getRowSums = (matrix: Cell[][]) => {
    return matrix.map((row) => row.reduce((sum, cell) => sum + cell.amount, 0));
  };

  const getPercentile50Row = (matrix: Cell[][]) => {
    const percentile50Row: number[] = [];

    for (let col = 0; col < N; col++) {
      const columnData = matrix.map((row) => row[col] && row[col].amount);
      percentile50Row.push(calculatePercentile50(columnData));
    }

    return percentile50Row;
  };

  const findNearestCells = (rowIndex: number, colIndex: number, x: number) => {
    const hoveredCellAmount = matrix[rowIndex][colIndex].amount;
    const allCells = matrix.flat();

    const nearestCells = allCells
      .map((cell) => ({
        cell,
        distance: Math.abs(cell.amount - hoveredCellAmount),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, x)
      .map(({ cell }) => cell.id);

    return nearestCells;
  };

  const rowSums = getRowSums(matrix);
  const percentile50Row = getPercentile50Row(matrix);

  const handleMouseEnterCell = (rowIndex: number, colIndex: number) => {
    const nearestCells = findNearestCells(rowIndex, colIndex, xValue);
    setHighlightedCells(new Set(nearestCells));
    setHoveredSumRowIndex(null);
  };

  const handleMouseEnterSumCell = (rowIndex: number) => {
    setHoveredSumRowIndex(rowIndex);
  };

  const handleMouseLeaveCell = () => {
    setHighlightedCells(new Set());
  };

  const handleMouseLeaveSumCell = () => {
    setHoveredSumRowIndex(null);
  };

  const handleXValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (!isNaN(value) && value > 0) {
      setXValue(value);
    }
  };

  const handleRemoveRow = (rowIndex: number) => {
    const newMatrix = [...matrix];
    newMatrix.splice(rowIndex, 1);
    setMatrix(newMatrix);
    setM(newMatrix.length);
  };

  const handleAddRow = () => {
    const newRow: Cell[] = [];
    let idCounter = matrix.flat().length + 1;

    for (let i = 0; i < N; i++) {
      newRow.push({
        id: idCounter++,
        amount: generateRandomCellValue(),
      });
    }

    const newMatrix = [...matrix, newRow];
    setMatrix(newMatrix);
    setM(newMatrix.length);
  };

  const getRowHeatmapPercentage = (row: Cell[]) => {
    const maxCellValue = Math.max(...row.map((cell) => cell.amount));
    return row.map((cell) => (cell.amount / maxCellValue) * 100);
  };

  return (
    <div className="matrix-container">
      <label className="x-input-label">
        Enter X (nearest cells):
        <input
          type="number"
          value={xValue}
          onChange={handleXValueChange}
          min={1}
          className="x-input"
        />
      </label>{" "}
      <button onClick={handleAddRow} className="add-row-btn">
        Add Row
      </button>
      <table className="matrix-table">
        <thead>
          <tr>
            <th>Row / Column</th>
            {Array.from({ length: N }, (_, idx) => (
              <th key={idx}>Cell Value N = {idx + 1}</th>
            ))}
            <th>Row Sum</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, rowIndex) => {
            const rowHeatmapPercentages = getRowHeatmapPercentage(row);

            return (
              <tr key={rowIndex}>
                <td className="matrix-cell">Cell Value M = {rowIndex + 1}</td>
                {row.map((cell, colIndex) => (
                  <td
                    key={cell.id}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    onMouseEnter={() =>
                      handleMouseEnterCell(rowIndex, colIndex)
                    }
                    onMouseLeave={handleMouseLeaveCell}
                    style={{
                      backgroundColor:
                        hoveredSumRowIndex === rowIndex
                          ? `rgba(255, 99, 71, ${
                              rowHeatmapPercentages[colIndex] / 100
                            })`
                          : "",
                    }}
                    className={`matrix-cell ${
                      highlightedCells.has(cell.id) ? "highlighted" : ""
                    }`}
                  >
                    {hoveredSumRowIndex === rowIndex
                      ? `${((cell.amount / rowSums[rowIndex]) * 100).toFixed(
                          2
                        )}%`
                      : cell.amount}
                  </td>
                ))}
                <td
                  onMouseEnter={() => handleMouseEnterSumCell(rowIndex)}
                  onMouseLeave={handleMouseLeaveSumCell}
                  className={`matrix-cell sum-cell ${
                    hoveredSumRowIndex === rowIndex ? "sum-hovered" : ""
                  }`}
                >
                  {rowSums[rowIndex]}
                </td>
                <td>
                  <button
                    onClick={() => handleRemoveRow(rowIndex)}
                    className="remove-row-btn"
                  >
                    Remove Row
                  </button>
                </td>
              </tr>
            );
          })}
          <tr>
            <td>Percentile 50</td>
            {percentile50Row.map((percentile, idx) => (
              <td key={idx}>{percentile}</td>
            ))}
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Matrix;
