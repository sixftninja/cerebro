// /Users/anand/Desktop/cerebro/frontend/components/UI/textarea.tsx
import React from 'react';

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function Textarea(props: Props) {
  return <textarea {...props} className={`p-2 rounded border border-gray-300 w-full ${props.className}`} />;
}