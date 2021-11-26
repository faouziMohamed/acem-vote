/* eslint-disable no-console */
// Forked from : https://github.com/sammwyy/no-self-xss
/* Devtools-detect */
// https://github.com/sindresorhus/devtools-detect
import xssMsg from '../data/no-self-xss.json';

export default function noSelfXssWarning({ onLoad = true } = {}) {
  const intervalTimer = devtoolsDetect();
  const { printWarn } = getMessage();
  const showWarn = (event) => {
    if (event.detail.isOpen) {
      printWarn();
    }
  };
  window.addEventListener('devtoolschange', showWarn);
  if (onLoad) printWarn();

  const cleanUp = () => {
    window.removeEventListener('devtoolschange', cleanUp);
    if (intervalTimer) clearInterval(intervalTimer);
  };

  return { cleanUp, printWarn };
}

function devtoolsDetect() {
  if (window.devtools) return null;
  const devtools = { isOpen: false, orientation: undefined };
  const threshold = 160;
  const emitEvent = (isOpen, orientation) => {
    window.dispatchEvent(
      new CustomEvent('devtoolschange', { detail: { isOpen, orientation } }),
    );
  };

  const main = ({ emitEvents = true } = {}) => {
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;
    const orientation = widthThreshold ? 'vertical' : 'horizontal';

    if (
      !(heightThreshold && widthThreshold) &&
      ((window.Firebug &&
        window.Firebug.chrome &&
        window.Firebug.chrome.isInitialized) ||
        widthThreshold ||
        heightThreshold)
    ) {
      if (
        (!devtools.isOpen || devtools.orientation !== orientation) &&
        emitEvents
      ) {
        emitEvent(true, orientation);
      }

      devtools.isOpen = true;
      devtools.orientation = orientation;
    } else {
      if (devtools.isOpen && emitEvents) emitEvent(false, undefined);
      devtools.isOpen = false;
      devtools.orientation = undefined;
    }
  };

  main({ emitEvents: false });
  const intervallRef = setInterval(main, 500);
  window.devtools = devtools;
  return intervallRef;
}

/* No-self-xss */

function getMessage() {
  const nsxss = { defaultLanguage: 'fr' };
  nsxss.translations = xssMsg || {};
  nsxss.getBrowserLanguage = () => {
    let lang = navigator?.language || navigator?.userLanguage || 'en';
    if (lang.includes('-')) {
      [, lang] = lang.split('-');
    }
    return lang.toLowerCase();
  };
  nsxss.getTranslation = () => {
    const lang = nsxss.getBrowserLanguage();

    const translation =
      nsxss.translations[lang] || nsxss.translations[nsxss.defaultLanguage];
    if (!nsxss.translations[lang]) {
      console.log(
        `Unknown language ${lang}, displaying message in default language ${nsxss.defaultLanguage}`,
      );
    }
    return translation;
  };

  nsxss.printWarn = () => {
    const { title, warning, message, subtitle, warn, info } =
      nsxss.getTranslation();
    console.log(`%c${warning}`, 'font-size:8em;color:red;');
    console.log(
      `%c${title}`,
      'color:#7289da;font-family:system-ui;font-size:4rem;-webkit-text-stroke: 1px black;font-weight:bold',
    );
    console.log(`%c${message}\n\n${subtitle}`, 'font-size:1.5em');

    console.log(
      `%c${warn}`,
      'color:#FF0000;font-family:arial;font-size:18px;font-weight:bold;padding-top: 10px;',
    );
    console.log(
      `%c${info}`,
      'font-family:arial;font-size:16px;padding-top: 10px;',
    );
  };
  return nsxss;
}
