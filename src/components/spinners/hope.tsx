import type { ForwardRefRenderFunction as FRC, Ref } from 'react';
import React, { forwardRef } from 'react';

import style from '@/sass/spinners/hope-spinner.module.scss';

interface HopeSpinnerProps {
  text: string;
  spinnerTxtRef?: Ref<HTMLSpanElement> | undefined;
  hidden?: boolean;
}

const HopeSpinnerF: FRC<HTMLDivElement, HopeSpinnerProps> = (props, ref) => {
  const { text, spinnerTxtRef = null, hidden = false } = props;
  const shouldBeHidden = hidden ? style.hidden : '';
  return (
    <div className={style.loading} ref={ref}>
      <div className={`${style.loading__spinner} ${shouldBeHidden}`} />
      <span
        className={style.loading__text}
        id='loading-txt'
        ref={spinnerTxtRef}
      >
        {text}
      </span>
    </div>
  );
};

const HopeSpinner = forwardRef(HopeSpinnerF);

HopeSpinner.displayName = 'HopeSpinner';
export default HopeSpinner;
