import '../sass/global.scss';

/* eslint-disable no-console, react/jsx-props-no-spreading */
import type { AppProps } from 'next/app';
import { useEffect } from 'react';

// import { xssWarningMessage } from '../lib/utils/lib.utils';
import noSelfXssWarning from '../lib/utils/no-self-xss';

export function reportWebVitals(metric: unknown) {
  if (process.env.NODE_ENV !== 'production') console.log(metric);
}

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    console.clear();
    const { cleanUp, printWarn } = noSelfXssWarning({ onLoad: false });
    printWarn();
    return cleanUp();
  }, []);
  return <Component {...pageProps} />;
}

export default MyApp;
