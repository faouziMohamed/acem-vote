import Router from 'next/router';
import useSWR from 'swr';

import FuturaSpinner from '../../components/spinners/futura';

export const fetcher = (url) => fetch(url).then((r) => r.json());

export function useUser(username = '') {
  const { data, mutate } = useSWR(`/api/user/${username || ''}`, fetcher);
  // if data is not defined, the query has not completed
  const loading = !data;
  const user = data?.user;
  return [user, { mutate, loading }];
}

export const useFetch = (url) => {
  const { data, error, mutate } = useSWR(url, fetcher);
  return [data, { loading: !data, error, mutate }];
};

export const useCandidates = (cid = '') => {
  const { data, error, mutate } = useSWR(
    `/api/candidate/${cid || ''}`,
    fetcher,
  );
  return [data, { loading: !data, error, mutate }];
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
