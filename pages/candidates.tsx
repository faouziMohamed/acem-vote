import { AppLayout } from '@/components/app/app-layout';
import CandidatesView from '@/components/cards/CandidatesView';
import style from '@/sass/app.module.scss';

export default function Candidates() {
  // const [user] = useUser();
  // const router = useRouter();

  return (
    <AppLayout pathname='Candidates'>
      <div className={style.main_content}>
        <CandidatesView />
      </div>
    </AppLayout>
  );
}
