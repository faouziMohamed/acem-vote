import { CardActionArea } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import { FC, useState } from 'react';

import type { ICandidateDetails } from '@/db/models/models.types';
import { isStartAVowel } from '@/utils/lib.utils';

import CandidateDialog from '../dialogs/ScrollDialog';
import { SemiGrayLine } from '../utils/Lines';
import MoreDetailsButton from './MoreDetailsButton';
import VoteButtons from './VoteButtons';

interface CardProps {
  candidate: ICandidateDetails;
  isVoteCard?: boolean;
}

const CandidateCard: FC<CardProps> = ({ candidate, isVoteCard = false }) => {
  const [open, setOpen] = useState(false);
  const article = isStartAVowel(candidate.firstname) ? "d'" : `de `;
  return (
    <>
      <CandidateDialog candidate={candidate} open={open} setOpen={setOpen} />
      <Card className='h-[25rem] w-full 2xs:w-[20rem] flex flex-col gap-0 items-center pb-0 border border-transparent hover:border hover:border-gray-200'>
        <CardActionArea
          onClick={() => setOpen(true)}
          className='relative grow flex flex-col  pt-2'
          title={`Ouvrir la description ${article}${candidate.firstname}`}
        >
          <Image
            className='w-full self-center'
            alt={`Avatar ${article}${candidate.firstname}`}
            height={140}
            width={140}
            objectFit='cover'
            src={candidate.avatar}
          />
          <CardContent className='flex flex-col items-center text-center'>
            <Typography gutterBottom variant='h5' component='div'>
              {candidate.firstname} {candidate.lastname}
            </Typography>
            <SemiGrayLine />
            <Typography
              variant='caption'
              component='div'
              className='text-[.70rem] line-clamp-1 text-slate-900 font-bold '
            >
              {candidate.details.skills.join(' | ')}
            </Typography>
            <SemiGrayLine className='border-blue-900 border-b-2' />
            <Typography
              variant='body2'
              color='text.secondary'
              className='line-clamp-3 '
            >
              {candidate.details.description}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions className='w-full grow p-0'>
          {isVoteCard ? (
            <VoteButtons candidate={candidate} />
          ) : (
            <MoreDetailsButton setOpen={setOpen} candidate={candidate} />
          )}
        </CardActions>
      </Card>
    </>
  );
};

export default CandidateCard;
