import { AppLayout } from '@/components/app/app-layout';
import { BubbleLoader } from '@/components/spinners/bubble-loader';
import { IUserBasic } from '@/db/models/models.types';
import { useEvents, useUser } from '@/hooks/hooks';
import style from '@/sass/app.module.scss';

import CandidateTabs from '../src/components/tabs/CandidateTabs';

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
        <CandidateTabs cEvent={event} />
      </div>
    </AppLayout>
  );
}
