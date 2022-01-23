/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import '@/sass/global.scss';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { CacheProvider, EmotionCache } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
//
/* eslint-disable no-console, react/jsx-props-no-spreading */
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect } from 'react';

import theme from '@/themes/theme';
import createEmotionCache from '@/utils/createEmotionCache';
import noSelfXssWarning from '@/utils/no-self-xss';

// export function reportWebVitals(metric: unknown) {
//   if (process.env.NODE_ENV !== 'production') console.log(metric);
// }

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  useEffect(() => {
    console.clear();
    const { cleanUp, printWarn } = noSelfXssWarning({ onLoad: false });
    printWarn();
    return cleanUp();
  }, []);
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>ACEM - Evote</title>
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  );
}
