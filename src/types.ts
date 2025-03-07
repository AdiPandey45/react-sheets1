export interface Cell {
  value: string;
  formula: string;
  format: CellFormat;
}

export interface CellFormat {
  bold: boolean;
  italic: boolean;
  fontSize: number;
  color: string;
  backgroundColor: string;
}

export interface CellRange {
  start: string;
  end: string;
}

export interface SpreadsheetState {
  cells: Record<string, Cell>;
  selectedCell: string | null;
  selectedRange: CellRange | null;
  formulaInput: string;
  columnWidths: Record<string, number>;
  rowHeights: Record<number, number>;
}

export type FormulaFunction = (range: CellRange, cells: Record<string, Cell>) => string | number;