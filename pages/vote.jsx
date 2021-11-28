import Image from 'next/image';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import Countdown from 'react-countdown';

import { AppLayout } from '../components/app/app-layout';
import { VoteButton } from '../components/cards/vote-button';
import CountdownView from '../components/misc/countdown';
import { BubbleLoader } from '../components/spinners/bubble-loader';
import AppError from '../lib/errors/app-error';
import { fetcherGET, postJSON, useEvents, useUser } from '../lib/hooks/hooks';
import { decryptMessage, generateAESKey } from '../lib/security/aes.utils';
import GPGEncryptor from '../lib/security/gpgEncryptor';
import style from '../sass/app.module.scss';

const hasVoted = [];
const voteContext = createContext([]);

export default function Vote() {
  const [event, { loading: eventLoading }] = useEvents();
  const [user, { loading }] = useUser();
  const [candidates, setCandidates] = useState([]);
  const [voted, setVoted] = useState(hasVoted);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const getCandidates = async () => {
      const { candidates: c = [] } = await fetcherGET('/api/candidates');
      setCandidates(c);
      // setVoted(cd.map((c) => c.candidatePost));
    };
    setIsLoading(true);
    getCandidates();
    setIsLoading(false);
    setVoted(user?.hasVoted || []);
    return () => setIsLoading(false);
  }, [isLoading, user?.hasVoted]);
  if (loading || eventLoading || isLoading) {
    return <BubbleLoader />;
  }

  // console.log('Parent voted', user.hasVoted);
  console.log(event);
  return (
    <AppLayout pathname={'Votes'}>
      <div className={style.mainWrapper}>
        <voteContext.Provider value={[voted, setVoted]}>
          {candidates?.map(
            (c) =>
              !voted.includes(c?.candidatePost) && (
                <CandidateVote candidate={c} key={c.id} />
              ),
          )}
        </voteContext.Provider>
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
      <RadioForm candidate={c} />
    </div>
  );
}

function RadioForm({ candidate: c }) {
  const [currUser] = useUser();

  const [selected, setSelected] = useState(false);
  const [voted, setVoted] = useContext(voteContext);

  const formRef = useRef(null);
  const { user } = c;

  const radios = [
    { label: 'Oui', value: 'yes' },
    { label: 'Non', value: 'no' },
    { label: 'Nul', value: 'abstain' },
  ];

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!selected) return;

    const { pubKey: serverPubKey } = await fetcherGET('/api/key/server/public');
    const aesKey = generateAESKey(100);
    const aesKeyEncrypted = await GPGEncryptor.encryptMessageStatic({
      message: aesKey,
      armoredEncryptionKey: serverPubKey,
    });

    const { keysEncrypted } = await postJSON({
      url: `/api/keys/user/`,
      data: { aesKeyEncrypted },
    });

    const decrypted = decryptMessage(keysEncrypted, aesKey);
    const { publicKey, privateKey, passphrase } = JSON.parse(decrypted);
    const encryptor = await GPGEncryptor.fromArmoredKeys({
      publicArmoredKey: publicKey,
      privateArmoredKey: privateKey,
      passphrase,
    });

    const { id: voteID } = await getNewVoteID({ encryptor });
    const msg = {
      candidateId: c.id,
      vote: selected,
      context: c.candidatePost,
      voterId: currUser.id,
      cOrgId: c.orgId,
      voteID,
    };

    const voteEncrypted = await createEncryptedMsg({
      encryptor,
      message: msg,
      armoredPubkey: serverPubKey,
    });

    const { error } = await postJSON({
      url: '/api/vote/submit',
      data: { voteEncrypted },
    });

    if (!error) {
      setVoted([...voted, c.candidatePost]);
    }
  };

  return (
    <form className={style.c_form} onSubmit={onSubmit} ref={formRef}>
      <div className={style.c_labels}>
        {radios.map((radio) => (
          <div key={radio.value} className={`${style.c_vlabel}`}>
            <div className={style.checkbox_check}>
              <label className={style.label_checker} tabIndex={0}>
                <div>
                  <input
                    tabIndex='-1'
                    type='radio'
                    name='vote'
                    value={radio.value}
                    checked={selected === radio.value}
                    onChange={(e) => setSelected(e.target.value)}
                    className={`${style.c_radio} ${style.hidden} ${style.checkbox_checker}`}
                    data-uid={user.id}
                  />
                  <span className={style.checker} />
                </div>
                <span className={style.label_txt}>{radio.label}</span>
              </label>
            </div>
          </div>
        ))}
      </div>
      {!currUser.hasVoted.includes(c.candidatePost) && (
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
  const Renderer = ({ days, hours, minutes, seconds }) => (
    <CountdownView
      days={days}
      hours={hours}
      minutes={minutes}
      seconds={seconds}
      hasCloseButton={false}
    />
  );
  const [event] = useEvents();
  const { startDate: start } = event;
  useEffect(() => {
    const contentRoot = document.querySelector(`.${style.main_content_root}`);
    contentRoot?.classList.add(style.prevent_scroll);
    return () => contentRoot?.classList.remove(style.prevent_scroll);
  }, []);
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

async function getNewVoteID({ encryptor }) {
  const userPubKey = encryptor.getPublicArmoredKey();

  const { voteIdEncrypted, error } = await postJSON({
    url: `/api/vote/id`,
    data: { armoredPublicKey: userPubKey },
  });
  if (error) {
    throw new AppError({ message: 'Erreur sur la récupération du vote Id' });
  }
  const { data } = await encryptor.decryptMessage(voteIdEncrypted);
  return JSON.parse(data);
}

async function createEncryptedMsg({
  message,
  encryptor,
  armoredPubkey = '',
  stringify = true,
}) {
  const msgStringified = stringify ? JSON.stringify(message) : message;
  const publicKey = await GPGEncryptor.readArmoredPublicKey(armoredPubkey);
  return encryptor.encryptMessage(msgStringified, publicKey);
}
