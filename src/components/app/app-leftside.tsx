import Image from 'next/image';
import Link from 'next/link';
import Router from 'next/router';
import { useEffect, useRef } from 'react';

import { useUser } from '@/hooks/hooks';
import style from '@/sass/app.module.scss';
import { disconnectUser } from '@/utils/lib.utils';

import FuturaSpinner from '../spinners/futura';

export function AppLeftside({ showLeftPane }: { showLeftPane: boolean }) {
  const [user, { loading }] = useUser();
  const paneRef = useLeftPane(showLeftPane);
  // if (loading) return <FuturaSpinner />;
  // if (!loading && !user) {
  //   void Router.push('/login');
  //   return <FuturaSpinner />;
  // }

  return (
    <div className={style.left_side_parent} ref={paneRef}>
      <div className={style.left_side}>
        <header className={style.left_side__header}>
          <Link href='/'>
            <a className={style.home_link}>
              <Image
                src='/images/e-vote-ws.svg'
                alt='Website logo'
                className={style.left_side__site_logo}
                layout='fill'
              />
            </a>
          </Link>
          <div className={style.username_wrap}>
            <h1 className={style.left_side__title}>
              <Link href='/'>
                <a className={style.profile_link}>
                  <div className={style.user_picture}>
                    <Image
                      src={user!.avatar as string}
                      alt='User profile picture'
                      className={style.user_picture__img}
                      layout='fill'
                    />
                  </div>
                  <span>
                    {user?.firstname} {user?.lastname}
                  </span>
                </a>
              </Link>
            </h1>
          </div>
          <NavTabs />
        </header>
      </div>
    </div>
  );
}

function NavTabs() {
  const tabs = [
    {
      name: 'Votes',
      icon: 'fas fa-vote-yea',
      activeTab: Router.asPath === '/vote',
      path: '/vote',
    },
    {
      name: 'Candidats',
      icon: 'fas fa-users',
      activeTab: Router.asPath === '/candidates',
      path: '/candidates',
    },
    {
      name: 'Resultats',
      icon: 'fas fa-poll',
      activeTab: Router.asPath === '/results',
      path: '/results',
    },
  ];
  return (
    <nav className={style.site_nav}>
      <ul className={style.site_nav__list}>
        {tabs.map(({ activeTab, ...tab }) => (
          <li key={tab.name}>
            <Link href={tab.path}>
              <a
                className={`${style.navlink} ${
                  activeTab ? style.active_tab : ''
                }`}
              >
                <i className={tab.icon} />
                <span className={style.nav_text}>{tab.name}</span>
              </a>
            </Link>
          </li>
        ))}

        <li>
          <button
            onClick={() => disconnectUser()}
            className={`${style.navlink}`}
            type='button'
          >
            <i className='fas fa-sign-out-alt' />
            <span className={style.nav_text}>Logout</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}

function useLeftPane(showLeftPane: boolean) {
  const paneRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (showLeftPane) {
      paneRef.current?.classList.add(style.left_pane_oppened);
    } else {
      paneRef.current?.classList.remove(style.left_pane_oppened);
    }
  }, [showLeftPane]);
  return paneRef;
}
