import { Box, Button } from '@mui/material';
import { Dispatch, FC, SetStateAction } from 'react';

import { ICandidateDetails } from '@/db/models/models.types';

interface MoreDetailsProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  candidate: ICandidateDetails;
}

const MoreDetailsButton: FC<MoreDetailsProps> = ({ setOpen, candidate }) => {
  return (
    <Box className='px-3 w-full'>
      <Button
        onClick={() => setOpen(true)}
        size='medium'
        className='w-full font-bold grow bg-primary hover:bg-secondary text-white'
        title={`Cliquez pour voir plus de détails sur ${candidate.firstname}`}
      >
        Plus de détails
      </Button>
    </Box>
  );
};

export default MoreDetailsButton;
