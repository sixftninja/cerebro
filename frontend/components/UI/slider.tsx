// /Users/anand/Desktop/cerebro/frontend/components/UI/slider.tsx
import React from 'react';

type Props = {
  value: number[];
  min: number;
  max: number;
  step: number;
  onValueChange: (value: number[]) => void;
};

export default function Slider({ value, min, max, step, onValueChange }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange([parseInt(e.target.value, 10)]);
  };
  return (
    <input type="range" min={min} max={max} step={step} value={value[0]} onChange={handleChange} />
  );
}