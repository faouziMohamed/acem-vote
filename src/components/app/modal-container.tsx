import { FC } from 'react';

import style from '@/sass/app.module.scss';

export const ModalContainer: FC = ({ children }) => {
  return (
    <div
      className={`hidden ${style.candidate_modal_container}`}
      tabIndex={-1}
      aria-labelledby='candidate_full_details__name'
      aria-describedby={style.candidate_modal_container}
      aria-hidden='true'
      id={style.candidate_modal_container}
    >
      {children}
    </div>
  );
};
