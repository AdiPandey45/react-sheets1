import { evaluate } from 'mathjs';
import { Cell, CellRange } from '../types';

export function getCellsInRange(range: CellRange, cells: Record<string, Cell>): Cell[] {
  const [startCol, startRow] = range.start.match(/([A-Z])(\d+)/)?.slice(1) || [];
  const [endCol, endRow] = range.end.match(/([A-Z])(\d+)/)?.slice(1) || [];

  const startColNum = startCol.charCodeAt(0) - 65;
  const endColNum = endCol.charCodeAt(0) - 65;
  const startRowNum = parseInt(startRow) - 1;
  const endRowNum = parseInt(endRow) - 1;

  const result: Cell[] = [];

  for (let row = startRowNum; row <= endRowNum; row++) {
    for (let col = startColNum; col <= endColNum; col++) {
      const cellId = `${String.fromCharCode(65 + col)}${row + 1}`;
      if (cells[cellId]) {
        result.push(cells[cellId]);
      }
    }
  }

  return result;
}

export function evaluateFormula(formula: string, cells: Record<string, Cell>): string {
  try {
    const expression = formula.substring(1); // Remove '='

    // Handle built-in functions
    if (expression.startsWith('SUM(')) {
      return handleSum(expression, cells);
    } else if (expression.startsWith('AVERAGE(')) {
      return handleAverage(expression, cells);
    } else if (expression.startsWith('MAX(')) {
      return handleMax(expression, cells);
    } else if (expression.startsWith('MIN(')) {
      return handleMin(expression, cells);
    } else if (expression.startsWith('COUNT(')) {
      return handleCount(expression, cells);
    } else if (expression.startsWith('TRIM(')) {
      return handleTrim(expression, cells);
    } else if (expression.startsWith('UPPER(')) {
      return handleUpper(expression, cells);
    } else if (expression.startsWith('LOWER(')) {
      return handleLower(expression, cells);
    }

    // Handle cell references and basic math
    const withReferences = expression.replace(/[A-Z]\d+/g, (match) => {
      const cell = cells[match];
      return cell?.value || '0';
    });

    return evaluate(withReferences).toString();
  } catch (error) {
    return '#ERROR!';
  }
}

function handleSum(expression: string, cells: Record<string, Cell>): string {
  const range = parseRange(expression);
  if (!range) return '#ERROR!';

  const values = getCellsInRange(range, cells)
    .map(cell => parseFloat(cell.value))
    .filter(value => !isNaN(value));

  return values.reduce((sum, value) => sum + value, 0).toString();
}

function handleAverage(expression: string, cells: Record<string, Cell>): string {
  const range = parseRange(expression);
  if (!range) return '#ERROR!';

  const values = getCellsInRange(range, cells)
    .map(cell => parseFloat(cell.value))
    .filter(value => !isNaN(value));

  if (values.length === 0) return '#DIV/0!';
  return (values.reduce((sum, value) => sum + value, 0) / values.length).toString();
}

function handleMax(expression: string, cells: Record<string, Cell>): string {
  const range = parseRange(expression);
  if (!range) return '#ERROR!';

  const values = getCellsInRange(range, cells)
    .map(cell => parseFloat(cell.value))
    .filter(value => !isNaN(value));

  if (values.length === 0) return '#ERROR!';
  return Math.max(...values).toString();
}

function handleMin(expression: string, cells: Record<string, Cell>): string {
  const range = parseRange(expression);
  if (!range) return '#ERROR!';

  const values = getCellsInRange(range, cells)
    .map(cell => parseFloat(cell.value))
    .filter(value => !isNaN(value));

  if (values.length === 0) return '#ERROR!';
  return Math.min(...values).toString();
}

function handleCount(expression: string, cells: Record<string, Cell>): string {
  const range = parseRange(expression);
  if (!range) return '#ERROR!';

  const values = getCellsInRange(range, cells)
    .map(cell => parseFloat(cell.value))
    .filter(value => !isNaN(value));

  return values.length.toString();
}

function handleTrim(expression: string, cells: Record<string, Cell>): string {
  const value = parseSingleCellOrValue(expression);
  if (!value) return '#ERROR!';
  return value.trim();
}

function handleUpper(expression: string, cells: Record<string, Cell>): string {
  const value = parseSingleCellOrValue(expression);
  if (!value) return '#ERROR!';
  return value.toUpperCase();
}

function handleLower(expression: string, cells: Record<string, Cell>): string {
  const value = parseSingleCellOrValue(expression);
  if (!value) return '#ERROR!';
  return value.toLowerCase();
}

function parseRange(expression: string): CellRange | null {
  const match = expression.match(/([A-Z]\d+):([A-Z]\d+)/);
  if (!match) return null;
  return {
    start: match[1],
    end: match[2]
  };
}

function parseSingleCellOrValue(expression: string): string | null {
  const match = expression.match(/\((.*?)\)/);
  if (!match) return null;
  return match[1];
}