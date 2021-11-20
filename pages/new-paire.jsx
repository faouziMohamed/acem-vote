import Router from 'next/router';
import { memo, useEffect, useRef, useState } from 'react';

import { AuthLayout } from '../components/auth/auth-layout';
import ActionButton from '../components/buttons/action-button';
import FuturaSpinner from '../components/spinners/futura';
import HopeSpinner from '../components/spinners/hope';
import AppError from '../lib/errors/app-error';
import { postJSON, useUser } from '../lib/hooks/hooks';
import style from '../sass/new-paire.module.scss';

export default function NewPaire() {
  const [user, { loading }] = useUser();

  if (loading) return <FuturaSpinner />;
  if (!loading && !user) {
    Router.push('/login');
    return <FuturaSpinner />;
  }

  const KeyProcessing = memo(
    () => <Processing user={user} />,
    () => true,
  );
  KeyProcessing.displayName = 'KeyProcessing';
  return (
    <AuthLayout>
      <header
        className={`${style.page_header} ${style.new_pair__content__header}`}
      >
        <h1 className={style.page_header__title}>
          {new Date().getHours() > 9 ? 'Bonsoir' : 'Bonjour'} {user.firstname}{' '}
          {user.lastname}
        </h1>
        <KeyProcessing />
      </header>
    </AuthLayout>
  );
}

function Processing({ user }) {
  const spinnerTxtRef = useRef(null);
  const actionBtnRef = useRef(null);
  const [showActionBtn, setShowActionBtn] = useState(false);
  const [handler, setHandler] = useState(() => {});
  const [hideSpinner, setHideSpinner] = useState(false);

  useEffect(() => {
    let didCancel = false;
    const setSpinnerMsg = (msg) => {
      spinnerTxtRef.current.innerText = msg;
    };

    const setButtonMsg = (msg) => {
      actionBtnRef.current.innerText = msg;
    };

    const showSuccessMessage = () => {
      setSpinnerMsg('Votre compte est configuré!');
      setHandler(() => () => Router.push('/vote'));
      setShowActionBtn(true);
      setHideSpinner(true);
      setButtonMsg('Aller dans la page des votes');
    };
    if (!user.isFirstLogin) {
      return showSuccessMessage();
    }

    async function runConfigure() {
      try {
        const { error, hint, cause } = await postJSON({
          url: `/api/key/add?oid=${user.orgId}`,
        });
        if (error) throw new AppError({ message: cause, hint });

        showSuccessMessage();
      } catch (err) {
        setSpinnerMsg(err.hint || err.message);
        setShowActionBtn(true);
        setHideSpinner(true);
        setButtonMsg('Réessayer');
        setHandler(() => () => Router.reload());
      }
    }
    if (!didCancel) {
      runConfigure();
    }

    return () => {
      didCancel = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinnerTxtRef.current]);

  return (
    <>
      <HopeSpinner
        text={'Configuration de votre compte...'}
        spinnerTxtRef={spinnerTxtRef}
        hidden={hideSpinner}
      />
      <div className={`${style.action} ${!showActionBtn && style.hidden}`}>
        <ActionButton text={'Continuer'} onClick={handler} ref={actionBtnRef} />
      </div>
    </>
  );
}
