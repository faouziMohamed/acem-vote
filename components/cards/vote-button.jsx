import style from '../../sass/app.module.scss';

export function VoteButton({
  onClick = () => {},
  title = 'Cliquez pour voter',
  dataId = '',
  context = '',
  disabled = false,
  children,
}) {
  return (
    <button
      className={`btn btn-primary ${style.vote_btn}`}
      title={title}
      data-id={dataId}
      onClick={onClick}
      data-context={context}
      disabled={disabled}
    >
      {children || 'Votez maintenant'}
    </button>
  );
}
