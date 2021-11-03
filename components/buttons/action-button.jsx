import { forwardRef } from 'react';

import style from '../../sass/new-paire.module.scss';

function ActionButton_({ text, onClick = () => {}, ref }) {
  const cls = `${style.action_btn_error} ${style.action_btn} btn primary-btn`;
  return (
    <button className={cls} onClick={onClick} ref={ref}>
      {text}
    </button>
  );
}

const ActionButton = forwardRef((props, ref) =>
  ActionButton_({ ref, ...props }),
);

ActionButton.displayName = 'ActionButton';

export default ActionButton;
