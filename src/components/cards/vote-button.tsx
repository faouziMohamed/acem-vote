import { FC } from 'react';

import style from '@/sass/app.module.scss';

interface VoteButtonProps {
  onClick?: () => void;
  title?: string;
  dataId?: string;
  context?: string;
  disabled?: boolean;
}

export const VoteButton: FC<VoteButtonProps> = (props) => {
  const { onClick, title, dataId, context, disabled, children } = props;
  return (
    <button
      className={`btn btn-primary ${style.vote_btn}`}
      title={title}
      data-id={dataId}
      onClick={onClick}
      data-context={context}
      disabled={disabled}
      type='button'
    >
      {children || 'Votez maintenant'}
    </button>
  );
};
