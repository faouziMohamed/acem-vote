import Router from 'next/router';
import { FC, useEffect, useRef, useState } from 'react';

import { useUser } from '@/lib/hooks/hooks';
import style from '@/sass/app.module.scss';

import FuturaSpinner from '../spinners/futura';
import type { INavbar } from './app.types';
import { AppLeftside } from './app-leftside';
import { BurgerMenu } from './burger-menu';

export const AppLayout: FC<{ pathname: string }> = ({ children, pathname }) => {
  const [user, { loading }] = useUser();
  const inputRef = useRef<HTMLInputElement>(null);
  const [showLeftPane, setShowLeftPane] = useState<boolean>(false);
  const mediaQueryStr = '(min-width: 700px)';

  const toggleChecked = () => setShowLeftPane(inputRef.current!.checked);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.checked = false;
      toggleChecked();
      const media = matchMedia(mediaQueryStr);
      media.addEventListener('change', () => {
        if (media.matches) {
          setShowLeftPane(false);
          if (inputRef.current) inputRef.current.checked = false;
        }
      });
    }
  }, []);

  // if (loading) return <FuturaSpinner />;
  // if (!loading && !user) {
  //   void Router.push('/login');
  //   return <FuturaSpinner />;
  // }

  // if (user?.isFirstLogin) {
  //   void Router.push('/new-paire');
  //   return <FuturaSpinner />;
  // }

  return (
    <>
      <noscript>You need to activate JavaScript to run this app</noscript>
      <div className='root'>
        {/* <AppLeftside showLeftPane={showLeftPane} /> */}
        <div className={style.main_page}>
          <Navbar inputRef={inputRef} toggleChecked={toggleChecked} />
          <main className={style.main_content_root}>
            <header className={style.main_content_header}>
              <div className={style.breadcrumb}>
                <div className={`${style.base} ${style.breadcrumb__path}`}>
                  Home
                </div>
                {pathname && (
                  <div className={`${style.breadcrumb__path} ${style.active}`}>
                    {pathname}
                  </div>
                )}
              </div>
            </header>
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

function Navbar({ inputRef, toggleChecked }: INavbar) {
  return (
    <div className={style.main_page__navbar}>
      <BurgerMenu inputRef={inputRef} toggleChecked={toggleChecked} />
    </div>
  );
}
