import style from '@/sass/app.module.scss';

import type { INavbar } from './app.types';

export function BurgerMenu({ inputRef, toggleChecked }: INavbar) {
  return (
    <div className={style.burger_menu}>
      <input
        type='checkbox'
        id='menu-toggler'
        className={style.burger_menu__checkbox}
        ref={inputRef}
        onChange={toggleChecked}
      />
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label htmlFor='menu-toggler' className={style.burger_menu__label} />
    </div>
  );
}
