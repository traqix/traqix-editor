import React, { useState } from 'react';

interface NodeProps {
  node: {
    id: string;
    position: { x: number; y: number };
    inputs: string[];
    outputs: string[];
    type: string;
    label: string;
  };
}

export const Node: React.FC<NodeProps> = ({ node }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(node.label);

  const handleLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(event.target.value);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: node.position.x,
        top: node.position.y,
        width: '120px',
        height: '70px',
        border: '2px solid',
        backgroundColor: node.type === 'input' ? '#66ff66' : node.type === 'output' ? '#ff6666' : '#ffff66',
        textAlign: 'center',
        lineHeight: '70px',
        borderRadius: '5px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
        color: '#000',
        cursor: 'move', // Indica que o nó pode ser movido
      }}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('nodeId', node.id);
      }}
    >
      {isEditing ? (
        <input
          type="text"
          value={label}
          onChange={handleLabelChange}
          onBlur={handleEditToggle}
          style={{ width: '100%', height: '30px', textAlign: 'center' }}
        />
      ) : (
        <>
          <span>{label}</span>
          <button onClick={handleEditToggle} style={{ marginLeft: '5px' }}>Editar</button>
        </>
      )}
    </div>
  );
};
