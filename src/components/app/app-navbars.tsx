import style from '@/sass/app.module.scss';

export function AppNavbar() {
  return (
    <div className={style.main_page__navbar}>
      <div className={style.burger_menu}>
        <input
          type='checkbox'
          id='menu-toggler'
          className={style.burger_menu__checkbox}
        />
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label htmlFor='menu-toggler' className={style.burger_menu__label} />
      </div>
    </div>
  );
}
