// /Users/anand/Desktop/cerebro/frontend/components/UI/button.tsx
import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button(props: Props) {
  return (
    <button {...props} className={`px-4 py-2 rounded ${props.className}`}>
      {props.children}
    </button>
  );
}