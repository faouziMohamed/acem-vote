import type { UserId } from '@/security/security.types';

declare global {
  interface Window {
    devtools: DevTools;
  }
  interface Event {
    detail: DevTools;
  }
}

export type Orientation = 'vertical' | 'horizontal';
export interface DevTools {
  isOpen: boolean;
  orientation: Orientation | undefined;
}

export interface IGetKeysParams extends UserId {
  filter?: IKeyFilter;
}

export interface IKeyFilter {
  _id?: number;
  publicArmoredKey?: number;
  privateArmoredKey?: number;
  revocationCertificate?: number;
  passphrase?: number;
}
