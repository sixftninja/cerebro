// /Users/anand/Desktop/cerebro/frontend/components/UI/checkbox.tsx
import React from 'react';

type Props = {
  checked: boolean;
  onCheckedChange: () => void;
};

export default function Checkbox({ checked, onCheckedChange }: Props) {
  return (
    <div
      onClick={onCheckedChange}
      style={{
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        border: '2px solid #333',
        backgroundColor: checked ? '#333' : 'transparent',
        cursor: 'pointer'
      }}
    ></div>
  );
}