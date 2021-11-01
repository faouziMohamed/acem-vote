import Image from 'next/image';

import style from '../../sass/app.module.scss';

export function AppNavbar() {
  return (
    <div className={style.main_page__navbar}>
      <div className={style.burger_menu}>
        <input
          type='checkbox'
          id='menu-toggler'
          className={style.burger_menu__checkbox}
        />
        <label
          htmlFor='menu-toggler'
          className={style.burger_menu__label}
        ></label>
      </div>

      <ul className={style.top_navbar}>
        x
        <li className={style.top_navbar__item}>
          <button className={`${style.top_navbar__btn} ${style.profil_btn}`}>
            <Image
              alt='User profile picture'
              className={style.user_profil_thumb}
              src='/images/users/user.png'
              title="Faouzi Mohamed's profile picture"
              layout='fill'
            />
            {/* <div
          className={`${style.user_menu_card} ${style.hidden}`}
          aria_label='menu'
        >
          <div className={style.user_profile}>
            <figure className={style.user_figure}>
              <div className={style.user_picture}>
                <Image
                  src='/images/users/user.png'
                  alt='User profile picture'
                  className={style.user_picture_img}
                  width='138'
                  height='138'
                />
              </div>
              <figcaption className={style.user_name}>
                Faouzi Mohamed
              </figcaption>
            </figure>
          </div>
          <nav className={style.user_actions_wrapper}>
            <ul className={style.action_wrapper}>
              <li className={style.action_item}>
                <a
                  href='/myaccount'
                  className={style.action_item_link}
                >
                  <i className='far fa-user-alt'> </i>
                  <span className={style.link_action_text}>
                    Account
                  </span>
                </a>
              </li>
              <li className={style.action_item}>
                <a href='/notifs' className={style.action_item_link}>
                  <i className='fas fa-bell' />
                  <span className={style.link_action_text}>
                    Setting
                  </span>
                </a>
              </li>

              <li className={style.action_item}>
                <a
                  href='/logout'
                  className={`${style.action_item_link} ${style.action_logout}`}
                >
                  <span className={style.link_action_text}>
                    Logout
                  </span>
                </a>
              </li>
            </ul>
          </nav>
        </div> */}
          </button>
        </li>
      </ul>
    </div>
  );
}
