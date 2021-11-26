import '../sass/global.scss';

import { useEffect } from 'react';

// import { xssWarningMessage } from '../lib/utils/lib.utils';
import noSelfXssWarning from '../lib/utils/no-self-xss';

export function reportWebVitals(metric) {
  // eslint-disable-next-line no-console
  if (process.env.NODE_ENV !== 'production') console.log(metric);
}

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.clear();
    const { cleanUp, printWarn } = noSelfXssWarning({ onLoad: false });
    printWarn();
    return cleanUp();
  }, []);
  return <Component {...pageProps} />;
}

export default MyApp;
