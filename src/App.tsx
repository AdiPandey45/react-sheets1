import React, { useRef, useEffect } from 'react';
import { Grid } from 'lucide-react';
import { useSpreadsheetStore } from './store';
import { Toolbar } from './components/Toolbar';
import { evaluateFormula } from './utils/formulas';
import { Cell, CellFormat } from './types';

const DEFAULT_FORMAT: CellFormat = {
  bold: false,
  italic: false,
  fontSize: 14,
  color: '#000000',
  backgroundColor: '#ffffff'
};

function App() {
  const {
    cells,
    selectedCell,
    formulaInput,
    columnWidths,
    rowHeights
  } = useSpreadsheetStore();
  
  const inputRef = useRef<HTMLInputElement>(null);
  const ROWS = 50;
  const COLS = 26;

  useEffect(() => {
    if (selectedCell && inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedCell]);

  const getCellId = (row: number, col: number) => {
    return `${String.fromCharCode(65 + col)}${row + 1}`;
  };

  const handleCellClick = (cellId: string) => {
    useSpreadsheetStore.setState({
      selectedCell: cellId,
      formulaInput: cells[cellId]?.formula || ''
    });
  };

  const handleFormulaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    useSpreadsheetStore.setState({ formulaInput: e.target.value });
  };

  const handleFormulaSubmit = () => {
    if (!selectedCell) return;

    let value = formulaInput;
    if (formulaInput.startsWith('=')) {
      value = evaluateFormula(formulaInput, cells);
    }

    const newCell: Cell = {
      value,
      formula: formulaInput,
      format: cells[selectedCell]?.format || DEFAULT_FORMAT
    };

    useSpreadsheetStore.setState({
      cells: { ...cells, [selectedCell]: newCell }
    });
  };

  const handleFormatChange = (format: Partial<CellFormat>) => {
    if (!selectedCell) return;

    const currentCell = cells[selectedCell];
    const newCell: Cell = {
      ...currentCell,
      format: {
        ...currentCell?.format || DEFAULT_FORMAT,
        ...format
      }
    };

    useSpreadsheetStore.setState({
      cells: { ...cells, [selectedCell]: newCell }
    });
  };

  const getCellStyle = (cell?: Cell) => {
    if (!cell?.format) return {};
    const { bold, italic, fontSize, color, backgroundColor } = cell.format;
    return {
      fontWeight: bold ? 'bold' : 'normal',
      fontStyle: italic ? 'italic' : 'normal',
      fontSize: `${fontSize}px`,
      color,
      backgroundColor
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Grid className="w-6 h-6" />
          <h1 className="text-xl font-semibold">React Sheets</h1>
        </div>

        <div className="bg-white border rounded shadow-sm">
          <Toolbar onFormatChange={handleFormatChange} />

          <div className="p-2 border-b">
            <input
              ref={inputRef}
              type="text"
              value={formulaInput}
              onChange={handleFormulaChange}
              onBlur={handleFormulaSubmit}
              onKeyDown={e => e.key === 'Enter' && handleFormulaSubmit()}
              className="w-full px-4 py-2 border rounded"
              placeholder="Enter value or formula (start with =)"
            />
          </div>

          <div className="overflow-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="w-10 bg-gray-100 border"></th>
                  {Array.from({ length: COLS }).map((_, col) => (
                    <th
                      key={col}
                      className="bg-gray-100 border px-2 py-1"
                      style={{ width: columnWidths[col] || 100 }}
                    >
                      {String.fromCharCode(65 + col)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: ROWS }).map((_, row) => (
                  <tr key={row} style={{ height: rowHeights[row] || 25 }}>
                    <td className="bg-gray-100 border text-center">{row + 1}</td>
                    {Array.from({ length: COLS }).map((_, col) => {
                      const cellId = getCellId(row, col);
                      const cell = cells[cellId];
                      return (
                        <td
                          key={cellId}
                          className={`border px-2 py-1 cursor-pointer ${
                            selectedCell === cellId ? 'outline outline-2 outline-blue-500' : ''
                          }`}
                          onClick={() => handleCellClick(cellId)}
                          style={getCellStyle(cell)}
                        >
                          {cell?.value || ''}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;