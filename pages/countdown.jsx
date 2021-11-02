import { appendZero } from '../lib/utils/lib.utils';
import style from '../sass/countdown.module.scss';

export default function CountdownView({
  days = 24,
  hours = 1,
  minutes = 0,
  seconds = 0,
  setShowCountdown = () => {},
  hasCloseButton = true,
}) {
  return (
    <div className={style.countdown_modal}>
      {hasCloseButton && <CloseButton setShowCountdown={setShowCountdown} />}
      <div className={style.countdown}>
        <section className={style.countdown_context}>
          <h1 className={style.title}>
            Association des Comoriens Etudiant aux Maroc – ACEM
          </h1>
          <p className={style.subTitle}>Votes du Bureau executif 2021/2022</p>
        </section>
        <div className={style.clock_content}>
          <div className={style.time_block}>
            <span className={`${style.time} ${style.days}`}>
              {appendZero(Number(days))}
            </span>
            <small className={style.smalltext}>Jours</small>
          </div>
          <div className={style.time_block}>
            <span className={`${style.time} ${style.hours}`}>
              {appendZero(Number(hours))}
            </span>
            <small className={style.smalltext}>Heures</small>
          </div>
          <div className={style.time_block}>
            <span className={`${style.time} ${style.minutes}`}>
              {appendZero(Number(minutes))}
            </span>
            <small className={style.smalltext}>Minutes</small>
          </div>
          <div className={style.time_block}>
            <span className={`${style.time} ${style.seconds}`}>
              {appendZero(Number(seconds))}
            </span>
            <small className={style.smalltext}>Secondes</small>
          </div>
        </div>
        <small className={style.countdown_description}>
          Temps restant avant le début des votes
        </small>
      </div>
    </div>
  );
}
function CloseButton({ setShowCountdown }) {
  return (
    <div div className={style.closeBtn_wrapper}>
      <button
        className={style.closeBtn}
        onClick={() => setShowCountdown(false)}
      >
        <span className={style.closeBtn_icon}>
          <i className='fas fa-times' />
        </span>
      </button>
    </div>
  );
}
