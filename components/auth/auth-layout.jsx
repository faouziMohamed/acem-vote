import Image from 'next/image';
import Link from 'next/link';

import style from '../../sass/auth.module.scss';
import FuturaSpinner from '../spinners/futura';

export function AuthLayout({ children, pageTitle, isLoading }) {
  return (
    <div className={`root ${style.root}`}>
      <div className={style.left_side}>
        <div className={style.site_logo}>
          <Link href='/'>
            <a className={style.site_logo__link}>
              <Image
                src='/images/e-vote-ws.svg'
                alt='Website logo'
                className={style.site_logo__img}
                layout='fill'
              />
            </a>
          </Link>
        </div>
      </div>
      <div
        className={`${style.right_side} ${style.new_pair} ${
          isLoading && 'blur'
        }`}
      >
        {isLoading && <FuturaSpinner semiTransparent />}
        <section
          className={`${style.right_side__content} ${style.new_pair__content}`}
        >
          <header className={style.page_header}>
            <h1 className={style.page_header__title}>{pageTitle}</h1>
          </header>
          <div className={style.auth_form_wrapper}>{children}</div>
        </section>
      </div>
    </div>
  );
}
