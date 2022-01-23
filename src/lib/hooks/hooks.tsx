/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return */
import Router from 'next/router';
/* eslint-enable @typescript-eslint/no-unsafe-assignment */
import { useCallback, useEffect, useRef } from 'react';
import useSWR, { KeyedMutator } from 'swr';

import FuturaSpinner from '@/components/spinners/futura';
import type {
  IBasicRegionalEvent,
  IUserBasic,
  VoteCategories,
} from '@/db/models/models.types';
import AppError from '@/errors/app-error';

import { ICandidateAPIResponse } from '../pages.types';

export const fetcherGET = (url: string) => fetch(url).then((r) => r.json());

type FetchReturn<U> = [
  U | undefined,
  {
    loading: boolean;
    mutate: KeyedMutator<U>;
    error: AppError | undefined;
  },
];

export const useFetch = <U,>(url: string): FetchReturn<U> => {
  const { data, error, mutate } = useSWR<U, AppError>(url, fetcherGET);
  return [data, { loading: data === undefined, error, mutate }];
};

export function useUser<U = IUserBasic>(username = '') {
  return useFetch<U>(`/api/user/${username}`);
}

export const useCandidates = (region = '') => {
  return useFetch<ICandidateAPIResponse>(`/api/candidates/${region}`);
};

export const useEvents = (eid = '', queries = '') => {
  type IEventResponse = IBasicRegionalEvent & { posts: VoteCategories[] };
  const event = useFetch<IEventResponse>(
    `/api/event/${eid}${queries && `?${queries}`}`,
  );
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

/**
 * A hook that make sure that the component is mounted before executing the callback
 */
export function useMountedState(): () => boolean {
  const mountedRef = useRef<boolean>(false);
  const get = useCallback(() => mountedRef.current, []);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  return get;
}
