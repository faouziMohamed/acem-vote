import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useRef } from 'react';

import { ICandidateDetails } from '@/lib/db/models/models.types';

import { SemiGrayLine } from '../utils/Lines';
import Transition from './Transition';

interface ScrollDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  candidate: ICandidateDetails;
}

export default function CandidateDialog({
  open = false,
  setOpen,
  candidate,
}: ScrollDialogProps) {
  const handleClose = () => setOpen(false);
  const descriptionElementRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);
  return (
    <div className='dialog'>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='scroll-dialog-title'
        aria-describedby='scroll-dialog-description'
        TransitionComponent={Transition}
      >
        <DialogContent className='p-0'>
          <DialogContentCard candidate={candidate} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function DialogContentCard({ candidate }: { candidate: ICandidateDetails }) {
  return (
    <Card className='w-full h-full flex flex-col justify-between gap-1 pt-4'>
      <Box className='self-center flex items-center justify-center w-36 h-36 xs:w-[15rem] xs:h-[15rem] relative '>
        <Image
          className='rounded-full w-full h-full'
          alt={`${candidate.firstname}'s picture`}
          height={140}
          width={140}
          layout='fill'
          objectFit='cover'
          src={candidate.avatar}
        />
      </Box>
      <CardContent className='text-center flex flex-col items-center'>
        <Typography
          gutterBottom
          variant='h5'
          component='div'
          className='font-extrabold'
        >
          {candidate.firstname} {candidate.lastname}
        </Typography>
        <SemiGrayLine />
        <Typography
          variant='body2'
          color='textSecondary'
          component='div'
          className='text-[.8rem] text-cyan-800 font-bold'
        >
          {candidate.details.skills.join(', ')}
        </Typography>
        <SemiGrayLine />
        <Typography
          variant='body2'
          color='text.secondary'
          className='text-slate-900 text-justify'
        >
          {candidate.details.description}
        </Typography>
      </CardContent>
    </Card>
  );
}
