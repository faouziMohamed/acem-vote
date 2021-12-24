/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return */
import Router from 'next/router';
import useSWR, { KeyedMutator } from 'swr';

import FuturaSpinner from '../../components/spinners/futura';
import { IBasicRegionalEvent, IUserBasic } from '../db/models/models.types';
import AppError from '../errors/app-error';

export const fetcherGET = (url: string) => fetch(url).then((r) => r.json());

type UseUserType = [
  IUserBasic | undefined,
  {
    loading: boolean;
    mutate: KeyedMutator<{ user: IUserBasic }>;
    error: AppError | undefined;
  },
];

export function useUser(username = ''): UseUserType {
  /* eslint-disable @typescript-eslint/no-unsafe-assignment */
  const { data, mutate, error } = useSWR<{ user: IUserBasic }, AppError>(
    `/api/user/${username || ''}`,
    fetcherGET,
  );
  // if data is not defined, the query has not completed
  const loading = !data;
  const user = data?.user;
  return [user, { mutate, loading, error }];
}

export const useFetch = (url: string) => {
  const { data, error, mutate } = useSWR(url, fetcherGET);
  return [data, { loading: !data, error, mutate }];
};

export const useCandidates = (cid = '') => {
  return useFetch(`/api/candidates/${cid}`);
};

type BRE = IBasicRegionalEvent;
type RegionalEventReturn = [
  BRE,
  { loading: boolean; error: any; mutate: KeyedMutator<BRE> },
];

export const useEvents = (eid = '') => {
  const event = useFetch(`/api/event/${eid}`) as RegionalEventReturn;
  // console.log('event', event);
  return event;
};

export function useAuthVerification() {
  const [user, { loading }] = useUser();
  if (loading) return <FuturaSpinner />;
  if (user) {
    Router.push('/home').catch(() => {});
    return <FuturaSpinner />;
  }
  return false;
}

interface PostJsonTypes {
  url: string;
  data?: any;
  stringify?: boolean;
}

export async function postJSON({
  url,
  data = null,
  stringify = true,
}: PostJsonTypes) {
  const dataString = stringify ? JSON.stringify(data) : data;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: dataString,
  });
  if (res.ok) return res.json();
  const { hint, error: cause } = await res.json();
  return {
    error: "Une erreur est survenu pendant l'envoie des données",
    hint,
    cause,
  };
}

/* eslint-enable @typescript-eslint/no-unsafe-assignment */
