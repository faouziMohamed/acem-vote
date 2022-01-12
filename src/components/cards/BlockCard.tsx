import { CardActionArea } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import { FC, useState } from 'react';

import type { ICandidateDetails } from '@/db/models/models.types';
import { isStartAVowel } from '@/utils/lib.utils';

import CandidateDialog from '../dialogs/ScrollDialog';

const CandidateCard: FC<{ candidate: ICandidateDetails }> = ({ candidate }) => {
  const [open, setOpen] = useState(false);
  const article = isStartAVowel(candidate.firstname) ? "d'" : `de `;
  return (
    <>
      <CandidateDialog candidate={candidate} open={open} setOpen={setOpen} />
      <Card className='h-[24rem] w-full 2xs:w-[20rem] flex flex-col items-center'>
        <CardActionArea
          onClick={() => setOpen(true)}
          className='relative grow flex flex-col justify-between pt-2'
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
          <CardContent className='text-center'>
            <Typography gutterBottom variant='h5' component='div'>
              {candidate.firstname} {candidate.lastname}
            </Typography>
            <Typography
              variant='body2'
              color='textSecondary'
              component='div'
              className='text-[.78rem] line-clamp-1'
            >
              {candidate.details.skills.join(', ')}
            </Typography>
            <span className='text-gray-400'>•</span>
            <Typography
              variant='body2'
              color='text.secondary'
              className='line-clamp-3 p-0 m-0'
            >
              {candidate.details.description}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions className='p-0 pb-1 flex'>
          <Button
            onClick={() => setOpen(true)}
            size='medium'
            className='w-full font-bold grow hover:bg-primary hover:text-white'
            title={`Cliquez pour voir plus de détails sur ${candidate.firstname}`}
          >
            Plus de détails
          </Button>
        </CardActions>
      </Card>
    </>
  );
};

export default CandidateCard;
