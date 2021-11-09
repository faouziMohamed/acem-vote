import Router from 'next/router';
import { useEffect, useState } from 'react';

import { AuthLayout } from '../components/auth/auth-layout';
import ActionButton from '../components/buttons/action-button';
import FuturaSpinner from '../components/spinners/futura';
import HopeSpinner from '../components/spinners/hope';
import { fetcherGET, postJSON, useUser } from '../lib/hooks/hooks';
import { generateRandomString } from '../lib/security/aes.utils';
import GPGEncryptor from '../lib/security/gpgEncryptor';
import { generateGPGNewKeys } from '../lib/utils/keys.utils';
import style from '../sass/new-paire.module.scss';

export default function NewPaire() {
  let spinner = null;
  let spinnerTxt = null;
  let actionBtn = null;
  const [showActionBtn, setShowActionBtn] = useState(false);
  const [handler, setHandler] = useState(() => {});
  const [hideSpinner, setHideSpinner] = useState(false);

  const [user, { loading }] = useUser();
  const setSpinnerTxtRef = (el) => {
    spinnerTxt = el;
  };
  const setSpinnerRef = (el) => {
    spinner = el;
  };
  const setActionBtnRef = (el) => {
    actionBtn = el;
  };
  useEffect(() => {
    if (!user || !spinner) return;
    runConfigure({
      spinnerTxt,
      actionBtn,
      setHandler,
      setShowActionBtn,
      setHideSpinner,
      user,
    });
  }, [actionBtn, spinner, spinnerTxt, user]);

  if (loading) return <FuturaSpinner />;
  if (!loading && !user) {
    Router.push('/login');
    return <FuturaSpinner />;
  }

  return (
    <AuthLayout>
      <header
        className={`${style.page_header} ${style.new_pair__content__header}`}
      >
        <h1 className={style.page_header__title}>Bonjour Faouzi Mohamed</h1>
        <HopeSpinner
          text={'Génération des clés...'}
          spinnerTxtRef={setSpinnerTxtRef}
          ref={setSpinnerRef}
          hidden={hideSpinner}
        />
        <div className={`${style.action} ${!showActionBtn && style.hidden}`}>
          <ActionButton
            text={'Continuer'}
            onClick={handler}
            ref={setActionBtnRef}
          />
        </div>
      </header>
    </AuthLayout>
  );
}

async function runConfigure({
  spinnerTxt,
  actionBtn,
  setHandler,
  setShowActionBtn,
  setHideSpinner,
  user,
}) {
  const setSpinnerMsg = (msg) => {
    spinnerTxt.innerText = msg;
  };

  const setButtonMsg = (msg) => {
    actionBtn.innerText = msg;
  };

  if (!user.isFirstLogin) {
    // Router.push('/vote');
    // return <FuturaSpinner />;
    setSpinnerMsg('Compte déjà activé!');
    setHandler(() => () => Router.push('/vote'));
    setShowActionBtn(true);
    setHideSpinner(true);
    setButtonMsg('Aller dans la page des vote');
    return;
  }
  setSpinnerMsg('Configuration de votre compte pour la première fois...');

  setSpinnerMsg('Etablissement des communications avec le serveur...');
  const { pubKey } = await fetcherGET('/api/key/server/public');
  if (!pubKey) {
    setSpinnerMsg('La communication avec le serveur à échouée');
    setShowActionBtn(true);
    setButtonMsg('Réessayer');
    setHideSpinner(true);
    setHandler(() => () => Router.reload());
    return;
  }

  const name = `${user.firstName} ${user.lastName}`;
  const { email } = user;
  const passphrase = generateRandomString(100);
  setSpinnerMsg('Création des clé de cryptage');
  try {
    const encryptor = await generateGPGNewKeys({ name, email, passphrase });
    setSpinnerMsg('Presque terminé');
    const encrypted = await encryptGeneratedKeys(encryptor, pubKey);
    setSpinnerMsg('Envoi des clés vers le serveur');
    const { error } = await postJSON({
      url: '/api/key/add',
      data: { encrypted },
    });
    if (!error) {
      setSpinnerMsg('Votre compte est configuré');
      setShowActionBtn(true);
      setButtonMsg('Continuer');
      setHideSpinner(true);
      setHandler(() => () => Router.push('/vote'));
    } else {
      setSpinnerMsg('Une erreur est survenue.');
      setShowActionBtn(true);
      setHideSpinner(true);
      setButtonMsg('Réessayer');
      setHandler(() => () => Router.reload());
    }
  } catch (err) {
    setSpinnerMsg('La création de vos clés de cryptage à échouée');
    setHideSpinner(true);
    setShowActionBtn(true);
    setHandler(() => () => Router.reload());
    // eslint-disable-next-line no-console
    console.log(err);
  }
}

async function encryptGeneratedKeys(encryptor, serverArmoredPubKey) {
  const unencryptedMessage = JSON.stringify(encryptor.getArmoredKeys());
  const pubKey = await GPGEncryptor.readArmoredPublicKey(serverArmoredPubKey);
  const encrypted = await encryptor.encryptMessage(unencryptedMessage, pubKey);
  return encrypted;
}
