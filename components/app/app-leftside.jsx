import Image from 'next/image';
import Link from 'next/link';

import { useUser } from '../../lib/hooks/hooks';
import style from '../../sass/app.module.scss';
import FuturaSpinner from '../spinners/futura';

export function AppLeftside() {
  const [user, { loading }] = useUser();
  if (loading) return <FuturaSpinner />;

  return (
    <div className={style.left_side_parent}>
      <div className={style.left_side}>
        <header className={style.left_side__header}>
          <Link href='/'>
            <a className={style.left_side__site_logo_link}>
              <Image
                src='/images/e-vote-ws.svg'
                alt='Website logo'
                className={style.left_side__site_logo}
                layout='fill'
              />
            </a>
          </Link>
          <div className={style.left_side__username_wrap}>
            <h1 className={style.left_side__title}>
              <Link href='/#'>
                <a className={style.left_side__user_profile_link}>
                  <div className={style.left_side__img_profile_wrapper}>
                    <Image
                      src={user.avatar}
                      alt='User profile picture'
                      className={style.left_side__userprofile_pic}
                      layout='fill'
                    />
                  </div>
                  <span className={style.left_side__user_fullname}>
                    {user.firstname} {user.lastname}
                  </span>
                </a>
              </Link>
            </h1>
          </div>

          <nav className={style.site_nav}>
            <ul className={style.site_nav__list}>
              <li className={style.site_nav__item}>
                <Link href='/vote'>
                  <a className={`${style.site_nav__link}`}>
                    <i
                      className={`${style.left_nav_icon} fas fa-person-booth`}
                    />
                    <span className={style.nav_text}>Vote</span>
                  </a>
                </Link>
              </li>
              <li className={style.site_nav__item}>
                <Link href='/candidates'>
                  <a className={`${style.site_nav__link}`}>
                    <i className={`${style.left_nav_icon} fas fa-id-card`} />
                    <span className={style.nav_text}>Candidates</span>
                  </a>
                </Link>
              </li>
              <li className={style.site_nav__item}>
                <Link href='/results'>
                  <a className={`${style.site_nav__link}`}>
                    <i className={`${style.left_nav_icon} fas fa-poll`} />
                    <span className={style.nav_text}>Results</span>
                  </a>
                </Link>
              </li>

              {/* logout */}
              <li className={style.site_nav__item}>
                <Link href='/logout'>
                  <a className={`${style.site_nav__link}`}>
                    <i
                      className={`${style.left_nav_icon} fas fa-sign-out-alt`}
                    />
                    <span className={style.nav_text}>Logout</span>
                  </a>
                </Link>
              </li>
            </ul>
          </nav>
        </header>
      </div>
    </div>
  );
}
