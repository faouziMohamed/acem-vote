/* eslint-disable @typescript-eslint/no-unsafe-return */
import Router from 'next/router';
import useSWR, { KeyedMutator, SWRResponse } from 'swr';

import FuturaSpinner from '../../components/spinners/futura';
import { IUserBasic } from '../db/models/models.types';

type IUserSWRFetch = SWRResponse<{ user: IUserBasic }, Error>;
export const fetcherGET = (url: string) => fetch(url).then((r) => r.json());

type UseUserType = [
  IUserBasic | undefined,
  { loading: boolean; mutate: KeyedMutator<{ user: IUserBasic }> },
];

export function useUser(username = ''): UseUserType {
  /* eslint-disable @typescript-eslint/no-unsafe-assignment */
  const { data, mutate }: IUserSWRFetch = useSWR(
    `/api/user/${username || ''}`,
    fetcherGET,
  );
  // if data is not defined, the query has not completed
  const loading = !data;
  const user = data?.user;
  return [user, { mutate, loading }];
}

export const useFetch = (url: string) => {
  const { data, error, mutate } = useSWR(url, fetcherGET);
  return [data, { loading: !data, error, mutate }];
};

export const useCandidates = (cid = '') => {
  return useFetch(`/api/candidates/${cid}`);
};

export const useEvents = (eid = '') => {
  return useFetch(`/api/event/${eid}`);
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
  data: never;
  stringify?: boolean;
}

export async function postJSON({ url, data, stringify = true }: PostJsonTypes) {
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
