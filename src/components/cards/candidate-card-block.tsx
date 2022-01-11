import Image from 'next/image';
import { FC, useRef, useState } from 'react';

import { ICandidateDetails } from '@/lib/db/models/models.types';
import type { CandidateModalProps, SetShowModal } from '@/lib/pages.types';
import style from '@/sass/app.module.scss';

import { VoteButton } from './vote-button';

interface CandidateCardBlockProps {
  candidate: ICandidateDetails;
  setShowModal: SetShowModal;
}

type CCP = CandidateCardBlockProps;

export const CandidateCardBLock: FC<CCP> = ({ candidate, setShowModal }) => {
  const {
    details: { skills },
    voteDetails: { post },
  } = candidate;
  const [showBtn] = useState(false);
  const modalRef = useRef(null);
  return (
    <div className={style.candidate_card} tabIndex={0} ref={modalRef}>
      <figure className={style.candidate_card__figure}>
        <div className={style.candidate_figure__top_details}>
          <Image
            className={style.candidate_figure__picture}
            src='/images/users/user.png'
            alt={`${candidate.firstname}'s Profile picture`}
            layout='fill'
          />
          <div className={style.candidate_card__more_details}>
            <button
              className={`btn ${style.more_details_btn}`}
              title='Plus de détails'
              data-id={candidate.uid}
              onClick={() => setShowModal(candidate)}
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
            {candidate.firstname} {candidate.lastname}
          </h3>
          <small
            className={`${style.detail_row} ${style.candidate_card_detail}`}
          >
            <span className={style.detail_title}>Post</span>
            <span className={style.detail_value}>{post}</span>
          </small>
          <small className={style.candidate_description__skills}>
            {skills.join(' | ')}
          </small>
        </figcaption>
      </figure>
      {showBtn && <VoteButton dataId={candidate.uid} />}
    </div>
  );
};

interface CandidateCardModalProps {
  setShowModal: CandidateCardBlockProps['setShowModal'];
  modal: CandidateModalProps;
}

export const CandidateModal: FC<CandidateCardModalProps> = (props) => {
  const { setShowModal, modal } = props;
  const { candidate } = modal;
  if (!candidate) {
    setShowModal(false);
    return <> </>;
  }
  const {
    details: { skills, description },
    voteDetails: { post },
  } = candidate;

  return (
    <div
      className={`modal-conainer flex flex-col items-center justify-center fixed 
      top-0 left-0 w-full h-full z-modal bg-primaryOpaque 
      transition-[background-color] duration-[10ms] ease-in-out`}
      tabIndex={-1}
      aria-labelledby='candidate_full_details__name'
      aria-describedby='modal-conainer'
      aria-hidden='true'
      id='modal-conainer'
    >
      <div
        className={`p-4 rounded-lg inline-flex flex-col items-center
         relative gap-4 w-full 2xs:w-[90%] max-w-[35.8125rem] bg-[#e8fcff] text-[#121313] overflow-auto`}
        role='document'
      >
        <button
          className={`p-4 absolute top-[.1rem] right-[.1rem] inline-flex 
          items-center justify-center w-[1.8rem] h-[1.8rem] rounded-full
          text-[1.3rem] bg-[#a9c7ffdb] border-none shadow-md
          hover:bg-[#00a573] hover:text-[#fff] z-10`}
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
            alt={`${candidate.firstname} ${candidate.lastname}'s profile picture`}
            tabIndex={0}
            layout='fill'
          />
        </div>
        <section className={style.candidate_full_details}>
          <header className={style.candidate_full_details__headings}>
            <h3
              className={`${style.candidate_card_detail} ${style.candidate_description__name}`}
            >
              {candidate?.firstname} {candidate?.lastname}
            </h3>
            <p className={style.candidate_card_detail}>
              <span className={style.detail_title}>Post</span>
              <span className={style.detail_value}>{post}</span>
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
