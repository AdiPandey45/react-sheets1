import React from 'react';
import { Bold, Italic, Type, Palette } from 'lucide-react';
import { useSpreadsheetStore } from '../store';
import { Cell } from '../types';

interface ToolbarProps {
  onFormatChange: (format: Partial<Cell['format']>) => void;
}

export function Toolbar({ onFormatChange }: ToolbarProps) {
  const selectedCell = useSpreadsheetStore(state => state.selectedCell);
  const cells = useSpreadsheetStore(state => state.cells);

  const currentFormat = selectedCell ? cells[selectedCell]?.format : null;

  return (
    <div className="flex items-center gap-2 p-2 border-b bg-white">
      <button
        className={`p-1 rounded hover:bg-gray-100 ${currentFormat?.bold ? 'bg-gray-200' : ''}`}
        onClick={() => onFormatChange({ bold: !currentFormat?.bold })}
      >
        <Bold size={18} />
      </button>
      <button
        className={`p-1 rounded hover:bg-gray-100 ${currentFormat?.italic ? 'bg-gray-200' : ''}`}
        onClick={() => onFormatChange({ italic: !currentFormat?.italic })}
      >
        <Italic size={18} />
      </button>
      <div className="h-4 w-px bg-gray-300 mx-2" />
      <select
        className="px-2 py-1 border rounded"
        value={currentFormat?.fontSize || 14}
        onChange={(e) => onFormatChange({ fontSize: parseInt(e.target.value) })}
      >
        {[8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72].map(size => (
          <option key={size} value={size}>{size}</option>
        ))}
      </select>
      <div className="h-4 w-px bg-gray-300 mx-2" />
      <input
        type="color"
        value={currentFormat?.color || '#000000'}
        onChange={(e) => onFormatChange({ color: e.target.value })}
        className="w-6 h-6 p-0 border rounded"
      />
      <input
        type="color"
        value={currentFormat?.backgroundColor || '#ffffff'}
        onChange={(e) => onFormatChange({ backgroundColor: e.target.value })}
        className="w-6 h-6 p-0 border rounded"
      />
    </div>
  );
}