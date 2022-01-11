import style from '@/sass/countdown.module.scss';
import { appendZero } from '@/utils/lib.utils';

interface CountdownViewProps {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  setShowCountdown?: (countdown: boolean) => void;
  hasCloseButton?: boolean;
  subTitle?: string;
}

export default function CountdownView({
  days = 24,
  hours = 1,
  minutes = 0,
  seconds = 0,
  hasCloseButton = true,
  subTitle,
  setShowCountdown = () => {},
}: CountdownViewProps) {
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

function CloseButton({
  setShowCountdown,
}: {
  setShowCountdown: (v: boolean) => void;
}) {
  return (
    <div className={style.closeBtn_wrapper}>
      <button
        className={style.closeBtn}
        onClick={() => setShowCountdown(false)}
        type='button'
      >
        <span className={style.closeBtn_icon}>
          <i className='fas fa-times' />
        </span>
      </button>
    </div>
  );
}
