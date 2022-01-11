import Router from 'next/router';
import type { Dispatch, SetStateAction, SyntheticEvent } from 'react';
import { useEffect, useRef, useState } from 'react';

import AuthLayout from '@/components/auth/auth-layout';
import { useAuthVerification } from '@/hooks/hooks';
import style from '@/sass/auth.module.scss';

export default function Login() {
  const [errorMessage, setErrorMsg] = useState('');
  const [success, setSuccess] = useState('');
  const pageTitle = 'Connectez-vous avec votre N° ID pour voter';
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    Router.prefetch('/candidates?etype=ken');
  }, []);
  if (useAuthVerification()) return false;
  return (
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
      <LoginForm
        errorMessage={errorMessage}
        setErrorMsg={setErrorMsg}
        setSuccessMsg={setSuccess}
        setIsLoading={setIsLoading}
      />
    </AuthLayout>
  );
}

interface ILoginFormProps {
  errorMessage: string;
  setErrorMsg: Dispatch<SetStateAction<string>>;
  setSuccessMsg: Dispatch<SetStateAction<string>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

type FormLoginEvent = SyntheticEvent<HTMLFormElement>;

function LoginForm(props: ILoginFormProps) {
  const formRef = useRef(null);
  const { errorMessage, setErrorMsg, setSuccessMsg, setIsLoading } = props;
  const args = { errorMessage, setErrorMsg, setSuccessMsg, setIsLoading };
  const onSubmit = (e: FormLoginEvent) => handleFormSubmit(e, args);
  return (
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
          minLength={3}
          pattern='^[a-zA-Z][a-zA-Z0-9_]{3,}$'
          required
        />
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
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
        type='submit'
      >
        Se connecter
      </button>
    </form>
  );
}

async function handleFormSubmit(e: FormLoginEvent, args: ILoginFormProps) {
  e.preventDefault();
  const { errorMessage, setErrorMsg, setIsLoading } = args;
  setIsLoading(true);
  if (errorMessage) setErrorMsg('');

  try {
    const target = e.target as typeof e.target & { userid: { value: string } };
    const userid = target.userid.value;
    await logInUser({ userid: userid.trim().toLowerCase() });
    setIsLoading(false);
  } catch (error) {
    setErrorMsg((error as Error).message);
    setIsLoading(false);
  }
}

export async function logInUser(body: { userid: string }) {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if ([200, 201].includes(response.status))
    await Router.push('/candidates?etype=ken');
  else {
    const { error } = (await response.json()) as { error: string };
    throw new Error(error);
  }
}
