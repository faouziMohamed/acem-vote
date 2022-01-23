import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import { FC } from 'react';

import { ICandidateDetails } from '@/db/models/models.types';

interface VoteButtonsProps {
  candidate: ICandidateDetails;
}

const VoteButtons: FC<VoteButtonsProps> = ({ candidate }) => {
  return (
    <Stack
      spacing={0.5}
      className='w-full p-0 pb-2 flex flex-col items-center justify-center'
    >
      <small className='flex justify-center'>
        Votez-vous {candidate.firstname} ?
      </small>
      <Stack spacing={1} direction='row' className='w-full px-4'>
        <Button className='xbtn-secondary grow'>Non</Button>
        <Button className='xbtn-primary grow' variant='contained'>
          Oui
        </Button>
        <Button className='xbtn-secondary grow'>Nul</Button>
      </Stack>
    </Stack>
  );
};

export default VoteButtons;
