import Router from 'next/router';
import useSWR from 'swr';

import FuturaSpinner from '../../components/spinners/futura';

export const fetcherGET = (url) => fetch(url).then((r) => r.json());

export function useUser(username = '') {
  const { data, mutate } = useSWR(`/api/user/${username || ''}`, fetcherGET);
  // if data is not defined, the query has not completed
  const loading = !data;
  const user = data?.user;
  return [user, { mutate, loading }];
}

export const useFetch = (url) => {
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
    Router.push('/home');
    return <FuturaSpinner />;
  }
  return false;
}

export async function postJSON({ url, data, stringify = true }) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: stringify ? JSON.stringify(data) : data,
  });
  if (res.ok) return res.json();
  return { error: "Une erreur est survenu pendant l'envoie des données" };
}
