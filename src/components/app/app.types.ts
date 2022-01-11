import { RefObject } from 'react';

export interface INavbar {
  inputRef: RefObject<HTMLInputElement>;
  toggleChecked: () => void;
}
