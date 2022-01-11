import { useEffect, useRef } from 'react';

import style from '@/sass/spinners/futura-spinner.module.scss';

export default function FuturaSpinner({
  semiTransparent = false,
  transparent = false,
}) {
  let className = `${style.spinner_preloader}`;
  className += semiTransparent ? ` ${style.spinner_semi_transparent}` : '';
  className += transparent ? ` ${style.spinner_transparent}` : '';
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => ref.current?.focus(), []);
  return (
    <div className={className} ref={ref} tabIndex={Number(0)}>
      <div className={style.load_spinner} />
    </div>
  );
}
