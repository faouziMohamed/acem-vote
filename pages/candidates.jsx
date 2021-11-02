import { useEffect, useRef, useState } from 'react';

import { AppLayout } from '../components/app/app-layout';
import {
  CandidateCardBLock,
  CandidateModal,
} from '../components/cards/candidate-card-block';
import { CandidateCardList } from '../components/cards/candidate-card-list';
import { BubbleLoader } from '../components/spinners/bubble-loader';
import { useCandidates, useUser } from '../lib/hooks/hooks';
import style from '../sass/app.module.scss';

export default function Candidates() {
  const [user] = useUser();
  const [modal, setModal] = useState({ show: false, candidate: {} });
  const componentsProps = {
    modal,
    setShowModal: (candidate) => setModal({ show: !!candidate, candidate }),
  };
  return (
    <AppLayout pathname={'Candidates'}>
      <div className={`${style.main_content}`}>
        {modal.show && <CandidateModal {...componentsProps} />}
        <Cards user={user} i {...componentsProps} />
      </div>
    </AppLayout>
  );
}
function Cards({ setShowModal }) {
  const [listView, setListView] = useState(false);

  const btnListRef = useRef(null);
  const btnGridRef = useRef(null);
  const [data, { loading: candidatesLoading }] = useCandidates();
  const candidates = data?.candidates || [];
  useEffect(() => {
    if (candidatesLoading) {
      return <BubbleLoader />;
    }
    return () => null;
  }, [candidatesLoading]);

  useEffect(() => {
    if (listView) {
      btnListRef.current.disabled = true;
      btnGridRef.current.disabled = false;
    } else {
      btnListRef.current.disabled = false;
      btnGridRef.current.disabled = true;
    }
  }, [listView]);

  return (
    <div className={`${style.candidate_cards_wrapper}`} tabIndex='0'>
      <div className={style.view_mode}>
        <button
          className={style.view_mode_btn}
          ref={btnGridRef}
          onClick={() => setListView(false)}
        >
          <i className='fas fa-th-large' />
        </button>
        <button
          className={style.view_mode_btn}
          ref={btnListRef}
          onClick={() => setListView(true)}
        >
          <i className='fas fa-list-ul' />
        </button>
      </div>
      {listView
        ? candidates.map((c) => <CandidateCardList candidate={c} key={c.id} />)
        : candidates.map((c) => (
            <CandidateCardBLock
              candidate={c}
              key={c.id}
              setShowModal={setShowModal}
            />
          ))}
    </div>
  );
}
