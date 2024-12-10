// /Users/anand/Desktop/cerebro/frontend/components/UI/input.tsx
import React from 'react';

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input(props: Props) {
  return <input {...props} className={`px-2 py-1 rounded border border-gray-300 w-full ${props.className}`} />;
}