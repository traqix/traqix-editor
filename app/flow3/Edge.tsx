import React from 'react';

interface EdgeProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label?: string; // Adicionando rótulo para a borda
}

export const Edge: React.FC<EdgeProps> = ({ x1, y1, x2, y2, label }) => {
  const midX = (x1 + x2) / 2; // Ponto médio para o rótulo
  const midY = (y1 + y2) / 2;

  return (
    <svg style={{ position: 'absolute', top: 0, left: 0 }}>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="black"
        strokeWidth="2"
      />
      {label && (
        <text x={midX} y={midY} textAnchor="middle" fill="black" fontSize="12">
          {label}
        </text>
      )}
    </svg>
  );
};
