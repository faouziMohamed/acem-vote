import style from '../../sass/app.module.scss';

export function BurgerMenu({ inputRef, toggleChecked }) {
  return (
    <div className={style.burger_menu}>
      <input
        type='checkbox'
        id='menu-toggler'
        className={style.burger_menu__checkbox}
        ref={inputRef}
        onChange={toggleChecked}
      />
      <label
        htmlFor='menu-toggler'
        className={style.burger_menu__label}
      ></label>
    </div>
  );
}
