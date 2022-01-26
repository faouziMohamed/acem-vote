import Image from 'next/image';
import {
  createContext,
  FormEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import Countdown from 'react-countdown';

import { AppLayout } from '@/components/app/app-layout';
import CandidateCard from '@/components/cards/BlockCard';
import CountdownView from '@/components/misc/countdown';
import { BubbleLoader } from '@/components/spinners/bubble-loader';
import type { IUserBasic } from '@/db/models/models.types';
import AppError from '@/errors/app-error';
import { fetcherGET, useCandidates, useEvents, useUser } from '@/hooks/hooks';
import style from '@/sass/app.module.scss';
import { decryptMessage, generateAESKey } from '@/security/aes.utils';
import GPGEncryptor from '@/security/pgpEncryptor';
import { postJSON } from '@/utils/lib.utils';

const hasVoted: IUserBasic['votedCategories'] = [];
const voteContext = createContext([]);

export default function Vote() {
  const [event] = useEvents();
  const [, { loading: userLoading }] = useUser();

  if (userLoading || !event) {
    return <BubbleLoader />;
  }

  const { payload } = event;
  const candidates: IUserBasic[] = [];
  Object.values(payload).forEach((p) =>
    p.candidates.forEach((c) => candidates.push(c)),
  );

  return (
    <AppLayout pathname='Votes'>
      <div className={style.main_content}>
        <div className='list-grid'>
          {candidates?.map((c) => (
            <CandidateCard candidate={c} key={c.uid} isVoteCard />
          ))}
        </div>
      </div>
      {/* <CountDownEvent /> */}
    </AppLayout>
  );
}

const onSubmit = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  // if (!selected) return;

  // const { pubKey: serverPubKey } = await fetcherGET('/api/key/server/public');
  // const aesKey = generateAESKey(100);
  // const aesKeyEncrypted = await GPGEncryptor.encryptMessageStatic({
  //   message: aesKey,
  //   armoredEncryptionKey: serverPubKey,
  // });

  // const { keysEncrypted } = await postJSON({
  //   url: `/api/keys/user/`,
  //   data: { aesKeyEncrypted },
  // });

  // const decrypted = decryptMessage(keysEncrypted, aesKey);
  // const { publicKey, privateKey, passphrase } = JSON.parse(decrypted);
  // const encryptor = await GPGEncryptor.fromArmoredKeys({
  //   publicArmoredKey: publicKey,
  //   privateArmoredKey: privateKey,
  //   passphrase,
  // });

  // const { id: voteID } = await getNewVoteID({ encryptor });
  // const msg = {
  //   candidateId: candidate.id,
  //   vote: selected,
  //   context: candidate.candidatePost,
  //   voterId: currUser.id,
  //   cOrgId: candidate.orgId,
  //   voteID,
  // };

  // const voteEncrypted = await createEncryptedMsg({
  //   encryptor,
  //   message: msg,
  //   armoredPubkey: serverPubKey,
  // });

  // const { error } = await postJSON({
  //   url: '/api/vote/submit',
  //   data: { voteEncrypted },
  // });

  // if (!error) {
  //   setVoted([...voted, candidate.candidatePost]);
  // }
};

// export function CountDownEvent() {
//   const Renderer = ({ days, hours, minutes, seconds }) => (
//     <CountdownView
//       days={days}
//       hours={hours}
//       minutes={minutes}
//       seconds={seconds}
//       hasCloseButton={false}
//     />
//   );
//   const [event] = useEvents();
//   const { startDate: start } = event;
//   useEffect(() => {
//     const contentRoot = document.querySelector(`.${style.main_content_root}`);
//     contentRoot?.classList.add(style.prevent_scroll);
//     return () => contentRoot?.classList.remove(style.prevent_scroll);
//   }, []);
//   return (
//     <div className='modal-container'>
//       <Countdown date={start} renderer={Renderer} />
//       <style>
//         {`
//             .modal-container {
//               position: absolute;
//               top: 0;
//               left: 0;
//               width: 100%;
//               height: 100%;
//               background-color: rgba(0, 0, 0, 0.5);
//               z-index: 9999;
//               display: flex;
//               justify-content: center;
//               align-items: center;
//             }
//           `}
//       </style>
//     </div>
//   );
// }

// async function getNewVoteID({ encryptor }) {
//   const userPubKey = encryptor.getPublicArmoredKey();

//   const { voteIdEncrypted, error } = await postJSON({
//     url: `/api/vote/id`,
//     data: { armoredPublicKey: userPubKey },
//   });
//   if (error) {
//     throw new AppError({ message: 'Erreur sur la récupération du vote Id' });
//   }
//   const { data } = await encryptor.decryptMessage(voteIdEncrypted);
//   return JSON.parse(data);
// }

// async function createEncryptedMsg({
//   message,
//   encryptor,
//   armoredPubkey = '',
//   stringify = true,
// }) {
//   const msgStringified = stringify ? JSON.stringify(message) : message;
//   const publicKey = await GPGEncryptor.readArmoredPublicKey(armoredPubkey);
//   return encryptor.encryptMessage(msgStringified, publicKey);
// }
