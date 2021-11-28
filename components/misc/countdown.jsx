import { appendZero } from '../../lib/utils/lib.utils';
import style from '../../sass/countdown.module.scss';

export default function CountdownView({
  days = 24,
  hours = 1,
  minutes = 0,
  seconds = 0,
  setShowCountdown = () => {},
  hasCloseButton = true,
  subTitle = '',
}) {
  const data = [
    { label: 'Jours', value: days, className: style.days },
    { label: 'Heures', value: hours, className: style.hours },
    { label: 'Minutes', value: minutes, className: style.minutes },
    { label: 'Secondes', value: seconds, className: style.seconds },
  ];

  return (
    <div className={style.countdown_modal}>
      {hasCloseButton && <CloseButton setShowCountdown={setShowCountdown} />}
      <div className={style.countdown}>
        <section className={style.countdown_context}>
          <h1 className={style.title}>
            Association des Comoriens Etudiant aux Maroc – ACEM
          </h1>
          <p className={style.subTitle}>{subTitle}</p>
        </section>

        <div className={style.clock_content}>
          {data.map(({ label, value, className }) => (
            <div key={label} className={style.time_block}>
              <span className={`${style.time} ${className}`}>
                {appendZero(Number(value))}
              </span>
              <small className={style.smalltext}>{label}</small>
            </div>
          ))}
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
    <div className={style.closeBtn_wrapper}>
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
