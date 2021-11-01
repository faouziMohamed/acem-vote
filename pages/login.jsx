import Router from 'next/router';
import { useEffect, useRef, useState } from 'react';

import { AuthLayout } from '../components/auth/auth-layout';
import { useAuthVerification } from '../lib/hooks/hooks';
import style from '../sass/auth.module.scss';

export default function Login() {
  const [errorMessage, setErrorMsg] = useState('');
  const [success, setSuccess] = useState('');
  const pageTitle = 'Connectez-vous avec votre N° ID pour voter';
  const [isLoading, setIsLoading] = useState(false);
  const formProps = {
    errorMessage,
    success,
    setErrorMsg,
    setSuccess,
    setIsLoading,
  };
  useEffect(() => Router.prefetch('/vote'), []);
  if (useAuthVerification()) return false;
  return (
    <>
      <AuthLayout pageTitle={pageTitle} isLoading={isLoading}>
        {errorMessage && (
          <div className={style.auth_error_msg}>
            <p>{errorMessage}</p>
          </div>
        )}
        {success && (
          <div className={style.auth_success_msg}>
            <p>{success}</p>
          </div>
        )}
        <LoginForm {...formProps} />
      </AuthLayout>
    </>
  );
}

function LoginForm(props) {
  const formRef = useRef(null);
  const { errorMessage, setErrorMsg, setSuccessMsg, setIsLoading } = props;
  const args = { errorMessage, setErrorMsg, setSuccessMsg, setIsLoading };
  const onSubmit = (e) => handleFormSubmit(e, args);
  return (
    <>
      <form
        action='/login'
        method='POST'
        className={style.auth_form}
        id='auth-form'
        ref={formRef}
        onSubmit={onSubmit}
      >
        <div className={style.form_floating}>
          <input
            data-name="ID de la carte d'adhesion"
            type='text'
            className={`${style.form_floating__input} ${style.form_control}`}
            id='userid'
            name='userid'
            placeholder=' '
            minLength='3'
            pattern='^[a-zA-Z][a-zA-Z0-9_]{3,}$'
            required
          />
          <label htmlFor='userid' className={style.form_floating__label}>
            ID de la carte d&apos;adhesion
          </label>
        </div>

        <p className={`${style.auth__text} ${style.auth__forgot_password}`}>
          <a href='/reset-password' className={style.auth__link}>
            Id de connexion oublié ?
          </a>
        </p>
        <button
          className={`btn btn-submit btn-primary ${style.signin_btn}`}
          id='btn-submit'
        >
          Se connecter
        </button>
      </form>
    </>
  );
}

async function handleFormSubmit(e, args) {
  e.preventDefault();
  const { errorMessage, setErrorMsg, setIsLoading } = args;
  setIsLoading(true);
  if (errorMessage) setErrorMsg('');

  try {
    await logInUser({ userid: e.target.userid.value.trim().toLowerCase() });
    setIsLoading(false);
  } catch (error) {
    setErrorMsg(error.message);
    setIsLoading(false);
  }
}

export async function logInUser(body) {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if ([200, 201].includes(response.status)) Router.push('/vote');
  else {
    const { error } = await response.json();
    throw new Error(error);
  }
}
