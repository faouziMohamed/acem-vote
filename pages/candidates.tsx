import { AppLayout } from '@/components/app/app-layout';
import CandidatesView from '@/components/cards/CandidatesView';
import { useCandidates, useEvents } from '@/lib/hooks/hooks';
import style from '@/sass/app.module.scss';

export default function Candidates() {
  // const [user] = useUser();
  // const router = useRouter();
  const [candidates] = useCandidates();
  const [event] = useEvents();

  if (!event || !candidates) return <div>Loading...</div>;
  return (
    <AppLayout pathname='Candidates'>
      <div className={style.main_content}>
        <CandidatesView />
      </div>
    </AppLayout>
  );
}
