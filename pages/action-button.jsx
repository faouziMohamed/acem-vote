import style from '../sass/new-paire.module.scss';

export function ActionButton({ text, onClick = () => {} }) {
  const cls = `${style.action_btn_error} ${style.action_btn} btn primary-btn`;
  return (
    <button className={cls} onClick={onClick}>
      {text}
    </button>
  );
}
