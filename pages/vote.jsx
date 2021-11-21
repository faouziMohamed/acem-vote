import Image from 'next/image';
import { useRef, useState } from 'react';
import Countdown from 'react-countdown';

import { AppLayout } from '../components/app/app-layout';
import { VoteButton } from '../components/cards/vote-button';
import CountdownView from '../components/misc/countdown';
import { BubbleLoader } from '../components/spinners/bubble-loader';
import AppError from '../lib/errors/app-error';
import {
  fetcherGET,
  postJSON,
  useCandidates,
  useEvents,
  useUser,
} from '../lib/hooks/hooks';
import { decryptMessage, generateAESKey } from '../lib/security/aes.utils';
import GPGEncryptor from '../lib/security/gpgEncryptor';
import style from '../sass/app.module.scss';

export default function Vote() {
  const [, { loading: eventLoading }] = useEvents();
  const [currUser, { loading }] = useUser();
  const [candidate, { loading: candidateLoading }] = useCandidates();
  if (loading || eventLoading || candidateLoading) {
    return <BubbleLoader />;
  }
  const { candidates = [] } = candidate;
  return (
    <AppLayout pathname={'Votes'}>
      <div className={style.mainWrapper}>
        {candidates?.map(
          (c) =>
            !currUser.hasVoted.includes(c.candidatePost) && (
              <CandidateVote candidate={c} key={c.id} />
            ),
        )}
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
  const [showCandidate, setShowCandidate] = useState(true);
  const formProps = { candidate: c, setShowCandidate };
  if (!showCandidate) return null;
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

function RadioForm({ candidate: c, setShowCandidate }) {
  const [currUser] = useUser();

  const [selected, setSelected] = useState(false);
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
      setShowCandidate(false);
    }
  };

  return (
    <form className={style.c_form} onSubmit={onSubmit} ref={formRef}>
      <div className={style.c_labels}>
        {radios.map((radio) => (
          <div
            key={radio.value}
            className={`${style.c_vlabel} ${style.checkbox_switcher}`}
          >
            <label className={style.label_switch}>
              <div className={`${style.input_container} ${style.switch}`}>
                <input
                  tabIndex='0'
                  type='radio'
                  name='vote'
                  value={radio.value}
                  checked={selected === radio.value}
                  onChange={(e) => setSelected(e.target.value)}
                  className={`${style.c_radio} ${style.hidden} ${style.checkbox_slider}`}
                  data-uid={user.id}
                />
                <span className={style.slider} />
              </div>
              <span className={style.label_switch_txt}> {radio.label} </span>
            </label>
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
