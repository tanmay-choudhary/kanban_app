// pages/_app.tsx
import React from 'react';
import { Provider } from 'react-redux';
import { AppProps } from 'next/app';
import store from '@/redux/store';
import '@/styles/globals.css'; // Import global styles here

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => (
  <Provider store={store}>
    <Component {...pageProps} />
  </Provider>
);

export default MyApp;
