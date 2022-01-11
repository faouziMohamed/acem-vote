import { CardActionArea } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import { FC, useState } from 'react';

import type { ICandidateDetails } from '@/db/models/models.types';

import ScrollDialog from '../dialogs/ScrollDialog';

const ImgMediaCard: FC<{ candidate: ICandidateDetails }> = ({ candidate }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <ScrollDialog candidate={candidate} isOpen={isOpen === true} />

      <Card className='h-[24rem] w-full 2xs:w-[20rem] '>
        <CardActionArea
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          className='h-full relative flex flex-col justify-between gap-1 pt-1'
        >
          <Image
            className='w-full self-center'
            alt={`${candidate.firstname}'s picture`}
            height={140}
            width={140}
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
          <CardActions>
            <Button size='small'>Plus de détails</Button>
          </CardActions>
        </CardActionArea>
      </Card>
    </>
  );
};

export default ImgMediaCard;
