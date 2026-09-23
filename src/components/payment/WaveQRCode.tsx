import React from 'react';

interface WaveQRCodeProps {
  data: string;
  size?: number;
}

/**
 * Clean SVG QR Code Renderer for Wave Senegal payments
 */
export const WaveQRCode: React.FC<WaveQRCodeProps> = ({ data, size = 160 }) => {
  // Deterministic pseudo-grid based on data string hash
  const gridSize = 21;
  const hash = Array.from(data).reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // Pre-calculate finder patterns
  const isFinder = (r: number, c: number) => {
    // Top-left finder
    if (r < 7 && c < 7) {
      if (r === 0 || r === 6 || c === 0 || c === 6) return true;
      if (r >= 2 && r <= 4 && c >= 2 && c <= 4) return true;
      return false;
    }
    // Top-right finder
    if (r < 7 && c >= gridSize - 7) {
      const cc = c - (gridSize - 7);
      if (r === 0 || r === 6 || cc === 0 || cc === 6) return true;
      if (r >= 2 && r <= 4 && cc >= 2 && cc <= 4) return true;
      return false;
    }
    // Bottom-left finder
    if (r >= gridSize - 7 && c < 7) {
      const rr = r - (gridSize - 7);
      if (rr === 0 || rr === 6 || c === 0 || c === 6) return true;
      if (rr >= 2 && rr <= 4 && c >= 2 && c <= 4) return true;
      return false;
    }
    return false;
  };

  const isFinderWhite = (r: number, c: number) => {
    if (r < 7 && c < 7) {
      if (r === 1 || r === 5 || c === 1 || c === 5) return true;
    }
    if (r < 7 && c >= gridSize - 7) {
      const cc = c - (gridSize - 7);
      if (r === 1 || r === 5 || cc === 1 || cc === 5) return true;
    }
    if (r >= gridSize - 7 && c < 7) {
      const rr = r - (gridSize - 7);
      if (rr === 1 || rr === 5 || c === 1 || c === 5) return true;
    }
    return false;
  };

  const cells: boolean[] = [];
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (isFinderWhite(r, c)) {
        cells.push(false);
      } else if (isFinder(r, c)) {
        cells.push(true);
      } else {
        // Pseudo data pattern
        const bit = ((r * 13 + c * 7 + hash) % 3 === 0) || ((r + c + (hash % 5)) % 2 === 0);
        cells.push(bit);
      }
    }
  }

  const cellSize = size / gridSize;

  return (
    <div className="relative p-2.5 bg-white rounded-2xl shadow-sm border border-neutral-200 inline-block">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rounded-lg">
        <rect width={size} height={size} fill="#FFFFFF" />
        {cells.map((active, idx) => {
          if (!active) return null;
          const r = Math.floor(idx / gridSize);
          const c = idx % gridSize;
          return (
            <rect
              key={idx}
              x={c * cellSize}
              y={r * cellSize}
              width={cellSize + 0.3}
              height={cellSize + 0.3}
              fill="#111827"
              rx={cellSize * 0.15}
            />
          );
        })}
      </svg>
      {/* Wave Icon in Center */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-8 h-8 rounded-full bg-[#1da1f2] border-2 border-white shadow-md flex items-center justify-center text-white font-black text-xs">
          W
        </div>
      </div>
    </div>
  );
};
