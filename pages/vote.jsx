import Image from 'next/image';
import { useState } from 'react';
import Countdown from 'react-countdown';

import { AppLayout } from '../components/app/app-layout';
import { VoteButton } from '../components/cards/vote-button';
import { BubbleLoader } from '../components/spinners/bubble-loader';
import { useCandidates, useEvents } from '../lib/hooks/hooks';
import style from '../sass/app.module.scss';
import CountdownView from './countdown';

export default function Vote() {
  const [, { loading: eventLoading }] = useEvents();
  const [candidate, { loading: candidateLoading }] = useCandidates();
  if (eventLoading || candidateLoading) {
    return <BubbleLoader />;
  }
  const { candidates = [] } = candidate;
  return (
    <AppLayout pathname={'Votes'}>
      <div className={style.mainWrapper}>
        {candidates?.map((c) => (
          <CandidateVote candidate={c} key={c.id} />
        ))}
      </div>
      {/* <CountDownEvent /> */}
    </AppLayout>
  );
}
function CandidateVote({ candidate: c }) {
  const { user } = c;
  const {
    details: { skills },
  } = c;

  const formProps = { candidate: c };
  return (
    <div className={style.c_wrapper}>
      <div className={style.candidateVote}>
        <figure className={style.figure_candidate}>
          <div className={style.c_picture}>
            <Image
              className={style.c_picture_img}
              src='/images/users/user.png'
              alt={`${user?.firstname}'s Profile picture`}
              layout='fill'
            />
          </div>
          <figcaption className={style.c_description}>
            <h3 className={`${style.c_name}`}>
              {user?.firstname} {user?.lastname}
            </h3>
            <small className={`${style.c_post}`}>
              <span className={style.detail_title}>Post</span>
              <span className={style.detail_value}>{c.candidatePost}</span>
            </small>
            <small className={style.c_skills}>{skills.join(' | ')}</small>
          </figcaption>
        </figure>
      </div>
      <RadioForm {...formProps} />
    </div>
  );
}

function RadioForm({ candidate: c }) {
  const [selected, setSelected] = useState(false);

  const { user } = c;
  if (!user.hasVoted) user.hasVoted = [];

  const radios = [
    { label: 'Oui', value: 'yes' },
    { label: 'Non', value: 'no' },
    { label: 'Nul', value: 'abstain' },
  ];

  const onSubmit = (e) => {
    e.preventDefault();
    if (!selected) return;
    const msg = {
      candidate: c.id,
      vote: selected,
      context: c.candidatePost,
      voter: user.id,
    };
  };

  return (
    <form className={style.c_form} onSubmit={onSubmit}>
      <div className={style.c_labels}>
        {radios.map((radio) => (
          <label key={radio.value} className={style.c_vlabel}>
            <input
              type='radio'
              name='vote'
              value={radio.value}
              checked={selected === radio.value}
              onChange={(e) => setSelected(e.target.value)}
              className={style.c_radio}
              data-uid={user.id}
            />
            {radio.label}
          </label>
        ))}
      </div>
      {!user.hasVoted.includes(c.candidatePost) && (
        <div>
          <VoteButton
            dataId={c.id}
            context={c.candidatePost}
            title={'Soumettre le vote'}
            disabled={!selected}
          />
        </div>
      )}
    </form>
  );
}

export function CountDownEvent() {
  const Renderer = (props) => (
    <CountdownView {...props} hasCloseButton={false} />
  );
  const [event] = useEvents();
  const { eventDate: start } = event;

  return (
    <div className='modal-container'>
      <Countdown date={start} renderer={Renderer} />
      <style>
        {`
            .modal-container {
              position: absolute;
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
  );
}
