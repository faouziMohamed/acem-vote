import Image from 'next/image';
import { FC, useRef, useState } from 'react';

import type {
  CandidateModalProps,
  ICandidate,
  SetShowModal,
} from '../../pages/pages.types';
import style from '../../sass/app.module.scss';
import { VoteButton } from './vote-button';

interface CandidateCardBlockProps {
  candidate: ICandidate;
  setShowModal: SetShowModal;
}

type CCP = CandidateCardBlockProps;

export const CandidateCardBLock: FC<CCP> = ({ candidate: c, setShowModal }) => {
  const { user } = c;
  const {
    details: { skills },
  } = c;
  const [showBtn] = useState(false);
  const modalRef = useRef(null);
  return (
    <div className={style.candidate_card} tabIndex={0} ref={modalRef}>
      <figure className={style.candidate_card__figure}>
        <div className={style.candidate_figure__top_details}>
          <Image
            className={style.candidate_figure__picture}
            src='/images/users/user.png'
            alt={`${user?.firstname}'s Profile picture`}
            layout='fill'
          />
          <div className={style.candidate_card__more_details}>
            <button
              className={`btn ${style.more_details_btn}`}
              title='Plus de détails'
              data-id={c.id}
              onClick={() => setShowModal(c)}
              type='button'
            >
              Plus de détails
            </button>
          </div>
          <div className={style.info_indicator_wrapper}>
            <div className={style.info_indicator} tabIndex={-1}>
              <i className='fas fa-info-circle' />
            </div>
          </div>
        </div>
        <figcaption className={style.candidate_description}>
          <h3
            className={`${style.detail_row} ${style.candidate_description__name}`}
          >
            {user?.firstname} {user?.lastname}
          </h3>
          <small
            className={`${style.detail_row} ${style.candidate_card_detail}`}
          >
            <span className={style.detail_title}>Post</span>
            <span className={style.detail_value}>{c.candidatePost}</span>
          </small>
          <small className={style.candidate_description__skills}>
            {skills.join(' | ')}
          </small>
        </figcaption>
      </figure>
      {showBtn && <VoteButton dataId={c.id} />}
    </div>
  );
};

interface CandidateCardModalProps {
  setShowModal: CandidateCardBlockProps['setShowModal'];
  modal: CandidateModalProps;
}

export const CandidateModal: FC<CandidateCardModalProps> = (props) => {
  const { setShowModal, modal } = props;
  const { candidate: c } = modal;
  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
  const {
    user,
    details: { skills, description },
    candidatePost,
  } = c!;

  return (
    <div
      className={`hidden ${style.candidate_modal_container}`}
      tabIndex={-1}
      aria-labelledby='candidate_full_details__name'
      aria-describedby={style.candidate_modal_container}
      aria-hidden='true'
      id={style.candidate_modal_container}
    >
      <div className={style.candidate_modal} role='document'>
        <button
          className={style.candidate_modal__close_btn}
          tabIndex={0}
          id='candidate_modal__close_btn'
          aria-label='Close this dialog window'
          data-a11y-dialog-hide=''
          onClick={() => setShowModal(false)}
          type='button'
        >
          <i className='fas fa-times' />
        </button>
        <div className={style.candidate_modal_profile}>
          <Image
            className={style.candidate_modal_profile__picture}
            src='/images/users/user.png'
            alt={`${user.firstname} ${user.lastname}'s profile picture`}
            tabIndex={0}
            layout='fill'
          />
        </div>
        <section className={style.candidate_full_details}>
          <header className={style.candidate_full_details__headings}>
            <h3
              className={`${style.candidate_card_detail} ${style.candidate_description__name}`}
            >
              {user?.firstname} {user?.lastname}
            </h3>
            <p className={style.candidate_card_detail}>
              <span className={style.detail_title}>Post</span>
              <span className={style.detail_value}>{candidatePost}</span>
            </p>
            <small className={style.candidate_description__skills}>
              {skills.join(' | ')}
            </small>
          </header>
          <p
            className={style.candidate_full_details__bio}
            id='candidate-full-details__bio'
          >
            {description}
          </p>
        </section>
      </div>
    </div>
  );
};
