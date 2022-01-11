import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import { Button } from '@mui/material';
import { FC, useState } from 'react';

import { ListCard } from '@/components/cards/ListCard';
import { BubbleLoader } from '@/components/spinners/bubble-loader';
import { useCandidates } from '@/hooks/hooks';

import ImgMediaCard from './BlockCard';

const CandidatesView: FC = () => {
  const [response] = useCandidates();
  const [listView, setListView] = useState(false);

  if (!response) {
    return <BubbleLoader />;
  }
  const {
    data: { candidates },
  } = response;
  const btnStyle = `bg-[#f3f3f3] border border-[#a3a3a3] 
          hover:bg-[#dfdddd] rounded text-[#44858f] min-w-min`;
  return (
    <div className='grid grid-cols-1 p-4 min-w-[17.5rem] gap-2' tabIndex={0}>
      <div className='flex gap-2 px-2 py-2 w-fit bg-secondary rounded justify-self-end'>
        <Button
          className={btnStyle}
          onClick={() => setListView(false)}
          disabled={listView === false}
        >
          <GridViewRoundedIcon />
        </Button>

        <Button
          className={btnStyle}
          onClick={() => setListView(true)}
          disabled={listView === true}
        >
          <FormatListBulletedRoundedIcon />
        </Button>
      </div>
      <div className='flex flex-wrap justify-center items-center gap-2 relative w-full h-fit'>
        {listView
          ? candidates.map((c) => <ListCard candidate={c} key={c.uid} />)
          : candidates.map((c) => <ImgMediaCard candidate={c} key={c.uid} />)}
      </div>
    </div>
  );
};

export default CandidatesView;
