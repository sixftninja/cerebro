// /Users/anand/Desktop/cerebro/frontend/components/UI/label.tsx
import React from 'react';

type Props = React.LabelHTMLAttributes<HTMLLabelElement>;

export default function Label(props: Props) {
  return <label {...props} className={`block mb-2 font-medium ${props.className}`}>{props.children}</label>;
}