import { forwardRef } from 'react';

import style from '../../sass/spinners/hope-spinner.module.scss';

function HopeSpinner_({ text, ref, spinnerTxtRef, hidden }) {
  return (
    <div className={style.loading} ref={ref}>
      <div
        className={`${style.loading__spinner} ${hidden && style.hidden}`}
      ></div>
      <span
        className={style.loading__text}
        id='loading-txt'
        ref={spinnerTxtRef}
      >
        {text}
      </span>
    </div>
  );
}

const HopeSpinner = forwardRef((props, ref) => HopeSpinner_({ ref, ...props }));

HopeSpinner.displayName = 'HopeSpinner';
export default HopeSpinner;
