import style from '@/sass/app.module.scss';

export function BubbleLoader() {
  return (
    <div className={style.loading_container}>
      <ul className={style.bubble_container}>
        <li className={style.bubble_item} />
        <li className={style.bubble_item} />
        <li className={style.bubble_item} />
        <li className={style.bubble_item} />
      </ul>
    </div>
  );
}
