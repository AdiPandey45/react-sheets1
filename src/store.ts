import { create } from 'zustand';
import { SpreadsheetState } from './types';

const DEFAULT_COLUMN_WIDTH = 100;
const DEFAULT_ROW_HEIGHT = 25;

const initialState: SpreadsheetState = {
  cells: {},
  selectedCell: null,
  selectedRange: null,
  formulaInput: '',
  columnWidths: {},
  rowHeights: {},
};

export const useSpreadsheetStore = create<SpreadsheetState>()(() => initialState);