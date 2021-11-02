import Countdown from 'react-countdown';

import { AppLayout } from '../components/app/app-layout';
import { BubbleLoader } from '../components/spinners/bubble-loader';
import { useEvents } from '../lib/hooks/hooks';
import CountdownView from './countdown';

export default function Vote() {
  const [, { loading: eventLoading }] = useEvents();

  if (eventLoading) {
    return <BubbleLoader />;
  }

  return (
    <AppLayout pathname={'Votes'}>
      <CountDOwnEvent />
    </AppLayout>
  );
}
function CountDOwnEvent() {
  const Renderer = (props) => (
    <CountdownView {...props} hasCloseButton={false} />
  );
  const [event] = useEvents();
  const { eventDate: start } = event;

  return (
    <div className='modal-container'>
      <Countdown date={start} renderer={Renderer} />
      <style>
        {`
            .modal-container {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-color: rgba(0, 0, 0, 0.5);
              z-index: 9999;
              display: flex;
              justify-content: center;
              align-items: center;
            }
          `}
      </style>
    </div>
  );
}
