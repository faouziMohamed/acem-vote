/* eslint-disable no-console */
// Forked from : https://github.com/sammwyy/no-self-xss
/* Devtools-detect */
// https://github.com/sindresorhus/devtools-detect

import xssMsg from '@/data/no-self-xss.json';

import type { DevTools, Orientation } from './utils.types';

export default function noSelfXssWarning({ onLoad = true } = {}) {
  const intervalTimer = devtoolsDetect();
  const { printWarn } = getMessage();
  const showWarn = (event: Event) => {
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

function devtoolsDetect(): NodeJS.Timer | null {
  if (window.devtools) return null;
  const devtools: DevTools = { isOpen: false, orientation: undefined };
  const threshold = 160;
  const emitEvent = (isOpen: boolean, orientation: Orientation | undefined) => {
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
      (widthThreshold || heightThreshold)
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

function getMessage() {
  interface Message {
    title: string;
    warning: string;
    message: string;
    subtitle: string;
    warn: string;
    info: string;
  }

  interface MessageMap {
    [key: string]: Message;
  }

  const defaultLanguage = 'fr';
  const translations: MessageMap = xssMsg || {};
  const getBrowserLanguage = () => {
    let lang = navigator?.language || 'en';
    if (lang.includes('-')) {
      [, lang] = lang.split('-');
    }
    return lang.toLowerCase();
  };
  const getTranslation = (): Message => {
    const lang = getBrowserLanguage();
    const translated: Message =
      translations[lang] || translations[defaultLanguage];
    if (!translated) {
      console.log(
        `Unknown language ${lang}, displaying message in default language ${defaultLanguage}`,
      );
    }
    return translated;
  };

  const printWarn = (): void => {
    const { title, warning, message, subtitle, warn, info } = getTranslation();
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
  return {
    defaultLanguage,
    translations,
    getBrowserLanguage,
    getTranslation,
    printWarn,
  };
}
