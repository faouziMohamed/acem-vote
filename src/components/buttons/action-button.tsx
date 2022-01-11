import type { ForwardRefRenderFunction as FRC, Ref } from 'react';
import { forwardRef } from 'react';

import style from '@/sass/new-paire.module.scss';

interface ActionBtnProps {
  text: string;
  ref?: Ref<HTMLButtonElement> | undefined;
  onClick?: () => void;
}

const ActionButtonF: FRC<HTMLButtonElement, ActionBtnProps> = (props) => {
  const { text, onClick = () => {}, ref } = props;
  const cls = `${style.action_btn_error} ${style.action_btn} btn primary-btn`;
  return (
    <button className={cls} onClick={onClick} ref={ref} type='button'>
      {text}
    </button>
  );
};

const ActionButton = forwardRef(ActionButtonF);

ActionButton.displayName = 'ActionButton';

export default ActionButton;
