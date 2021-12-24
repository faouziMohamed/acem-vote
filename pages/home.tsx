import type { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Router from 'next/router';
import { useState } from 'react';
import Countdown from 'react-countdown';

import AutoTypingText from '../components/effects/auto-typing-text';
import CountdownView from '../components/misc/countdown';
import { BubbleLoader } from '../components/spinners/bubble-loader';
import FuturaSpinner from '../components/spinners/futura';
import { useEvents, useUser } from '../lib/hooks/hooks';
import style from '../sass/home.module.scss';

interface ICountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const Home: NextPage = () => {
  const [user, { loading }] = useUser();
  const [showCountdown, setShowCountdown] = useState(true);
  const [event] = useEvents();
  // console.log('event', event);
  if (loading || !event) return <BubbleLoader />;
  if (user) {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    Router.push('/vote');
    return <FuturaSpinner />;
  }

  const Renderer = ({ days, hours, minutes, seconds }: ICountdownTime) => (
    <CountdownView
      days={days}
      hours={hours}
      minutes={minutes}
      seconds={seconds}
      setShowCountdown={setShowCountdown}
      subTitle={event.eventName}
      hasCloseButton
    />
  );

  return (
    <div className={style.home_parent}>
      <div className={style.page_overlay} />
      {showCountdown && (
        <div className='modal-container'>
          <Countdown
            date={new Date(event.startDate)}
            onComplete={() => Router.push('/vote')}
            renderer={Renderer}
          />
          <style>
            {`
            .modal-container {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-color: rgba(0, 0, 0, 0.5);
              z-index: 9999;
              display: flex;
              justify-content: center;
              align-items: center;
            }
          `}
          </style>
        </div>
      )}

      <div className={`${style.root} root`}>
        <HomeNavbar />
        <main className={style.main_content}>
          <AppDescription />
          <Features />
        </main>
      </div>
    </div>
  );
};

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
  const [event] = useEvents();

  const Rendrer = ({ days, hours, minutes, seconds }: ICountdownTime) => (
    <div>
      <small>
        {days} jours {hours} heures {minutes} minutes {seconds} secondes
      </small>
    </div>
  );
  return (
    <section className={style.main_content__col_2}>
      <div className={style.content_description}>
        <p>Votez maintenant en ligne les futurs dirigeants de l&apos;ACEM </p>
        <ul className={style.description_list}>
          {features.map((feature, index) => (
            // eslint-disable-next-line react/no-array-index-key
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
            Commencer maintenant{' '}
            <Countdown
              date={new Date(event.startDate)}
              // eslint-disable-next-line react/jsx-props-no-spreading
              renderer={(props) => <Rendrer {...props} />}
            />
          </a>
        </Link>
      </div>
    </section>
  );
}

export default Home;
