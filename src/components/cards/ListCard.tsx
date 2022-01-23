import Image from 'next/image';
import type { FC } from 'react';

import { ICandidateDetails } from '@/db/models/models.types';
import style from '@/sass/app.module.scss';

interface ListCardProps {
  candidate: ICandidateDetails;
}

export const ListCard: FC<ListCardProps> = ({ candidate }) => {
  const {
    details: { skills, description },
    voteDetails: { post },
  } = candidate;
  return (
    <div className={style.candidate_row}>
      <div
        className={style.candidate_row__overlay}
        data-id={candidate.uid}
        tabIndex={0}
      >
        <div className={style.info_indicator_wrapper}>
          <div className={style.info_indicator} tabIndex={-1}>
            <i className='fas fa-info-circle' />
          </div>
        </div>
      </div>
      <div className={style.candidate_picture}>
        <Image
          className={style.candidate_picture__img}
          src={candidate.avatar}
          alt={`${candidate.firstname}'s picture`}
          layout='fill'
        />
      </div>
      <div className={style.candidate_details}>
        <h3 className={style.candidate_name}>
          <span className={style.names}>
            {candidate.firstname} {candidate.lastname}
          </span>
        </h3>

        <p className={style.detail_row}>
          <span className={style.detail_title}>Formation</span>
          <span className={style.detail_value}>{skills.join(' | ')}</span>
        </p>
        <p className={style.detail_row}>
          <span className={style.detail_title}>Post</span>
          <span className={style.detail_value}>{post}</span>
        </p>
        <p className={style.detail_row}>
          <span className={style.detail_title}>Description</span>
          <span className={style.detail_value}>{description}</span>
        </p>
      </div>
    </div>
  );
};
