import Router from 'next/router';

import { useUser } from '../../lib/hooks/hooks';
import style from '../../sass/app.module.scss';
import FuturaSpinner from '../spinners/futura';
import { AppLeftside } from './app-leftside';
import { AppNavbar } from './app-navbar';

export function AppLayout({ children }) {
  const [user, { loading }] = useUser();
  if (loading) return <FuturaSpinner />;
  if (!loading && !user) {
    Router.push('/login');
    return <FuturaSpinner />;
  }
  return (
    <>
      <noscript>You need to activate JavaScript to run this app</noscript>

      <div className={`root`}>
        <AppLeftside />
        <div className={style.main_page}>
          <AppNavbar />

          <main className={style.main_content_root}>
            <header className={style.main_content_header}>
              <div className={style.breadcrumb}>
                <div className={`${style.base} ${style.breadcrumb__path}`}>
                  Home
                </div>
                <div className={`${style.breadcrumb__path} ${style.active}`}>
                  Vote
                </div>
              </div>
              <h2 className={style.greeting_msg}>Hi, welcome back</h2>
            </header>
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
