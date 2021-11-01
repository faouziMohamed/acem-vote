import Image from 'next/image';
import Link from 'next/link';
import Router from 'next/router';

import AutoTypingText from '../components/effects/auto-typing-text';
import { BubbleLoader } from '../components/spinners/bubble-loader';
import FuturaSpinner from '../components/spinners/futura';
// import FuturaSpinner from '../components/spinners/futura';
import { useUser } from '../lib/hooks/hooks';
import style from '../sass/home.module.scss';

export default function Home() {
  const [user, { loading }] = useUser();
  if (loading) return <BubbleLoader />;
  if (user) {
    Router.push('/vote');
    return <FuturaSpinner />;
  }
  return (
    <div className={style.home_parent}>
      <div className={style.page_overlay}></div>
      <div className={`${style.root} root`}>
        <HomeNavbar />
        <main className={style.main_content}>
          <AppDescription />
          <Features />
        </main>
      </div>
    </div>
  );
}

function HomeNavbar() {
  return (
    <nav className={style.navbar}>
      <Link href='/'>
        <a className={style.navbar__logo}>
          <Image
            src='/images/e-vote-ws.svg'
            alt='Evote app Logo'
            className={style.navbar__logo__img}
            layout='fill'
          />
        </a>
      </Link>
      <div className={style.navbar__links}>
        <Link href='/login'>
          <a
            className={`btn btn-primary ${style.navbar__links__item} ${style.btn_link} ${style.signup_btn}`}
          >
            Aller voter
          </a>
        </Link>
        <Link href='/candidates'>
          <a
            className={`btn btn-secondary ${style.navbar__links__item} ${style.btn_link} ${style.signin_btn}`}
          >
            Voir les candidats
          </a>
        </Link>
      </div>
    </nav>
  );
}

function AppDescription() {
  return (
    <section className={style.main_content__col_1}>
      <section className={style.col_1_content}>
        <h1 className={style.main_content__col_1__title}>ACEM | Evote</h1>
        <p className={style.main_content__col_1__text}>
          Association des Comoriens Etudiant aux Maroc – ACEM
        </p>
        <p className={style.main_content__col_1__text}>
          Votes du bureau Exécutif 2021/2022
        </p>
        <p className={`${style.main_content__col_1__text} ${style.last_block}`}>
          Vote en ligne{' '}
          <AutoTypingText listOfWords={['Crypté.', 'Sécurisé.']} />
        </p>
      </section>
    </section>
  );
}

function Features() {
  const features = [
    '100% en ligne',
    'Processus de vote automatisé',
    'Resultats visuels avec des graphiques',
    'Gestion des candidats et élections',
    'Chiffrement bout-à-bout (Possibilité de triche très bas)',
  ];
  return (
    <section className={style.main_content__col_2}>
      <div className={style.content_description}>
        <p>Votez maintenant en ligne les futurs dirigeants de l&apos;ACEM </p>
        <ul className={style.description_list}>
          {features.map((feature, index) => (
            <li className={style.description_item} key={index}>
              {feature}
            </li>
          ))}
          <li className={`${style.has_love} ${style.description_item}`}>
            ACEM - Evote
          </li>
        </ul>
        <Link href='/login'>
          <a
            className={`btn btn-primary ${style.btn_link} ${style.getting_started_btn}`}
          >
            Commencer maintenant
          </a>
        </Link>
      </div>
    </section>
  );
}
