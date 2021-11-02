import Image from 'next/image';
import { useState } from 'react';

import style from '../../sass/app.module.scss';
import { VoteButton } from './vote-button';

export function CandidateCardList({ candidate: c }) {
  const { user } = c;
  const {
    details: { skills, description },
    candidatePost,
  } = c;
  const [showBtn] = useState(false);
  return (
    <div className={style.candidate_row}>
      <div className={style.candidate_row__overlay} data-id={c.id} tabIndex='0'>
        <div className={style.info_indicator_wrapper}>
          <div className={style.info_indicator} tabIndex='-1'>
            <i className='fas fa-info-circle'></i>
          </div>
        </div>
      </div>
      <div className={style.candidate_picture}>
        <Image
          className={style.candidate_picture__img}
          src='/images/users/user.png'
          alt={`${user.firstname}'s picture`}
          layout='fill'
        />
      </div>
      <div className={style.candidate_details}>
        <h3 className={style.candidate_name}>
          <span className={style.names}>
            {user.firstname} {user.lastname}
          </span>
          {showBtn && <VoteButton dataId={c.id} />}
        </h3>

        <p className={style.detail_row}>
          <span className={style.detail_title}>Formation</span>
          <span className={style.detail_value}>{skills.join(' | ')}</span>
        </p>
        <p className={style.detail_row}>
          <span className={style.detail_title}>Post</span>
          <span className={style.detail_value}>{candidatePost}</span>
        </p>
        <p className={style.detail_row}>
          <span className={style.detail_title}>Description</span>
          <span className={style.detail_value}>{description}</span>
        </p>
      </div>
    </div>
  );
}
