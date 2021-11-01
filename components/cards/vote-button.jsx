import style from '../../sass/app.module.scss';

export function VoteButton({
  onClick = () => {},
  title = '',
  dataId = '',
  children,
}) {
  return (
    <button
      className={`btn btn-primary ${style.vote_btn}`}
      title={title}
      data-id={dataId}
      onClick={onClick}
    >
      {children || 'Votez maintenant'}
    </button>
  );
}
