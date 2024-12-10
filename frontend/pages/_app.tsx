// /Users/anand/Desktop/cerebro/frontend/pages/_app.tsx
import '../pages/globals.css';
import { AppProps } from 'next/app';

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}