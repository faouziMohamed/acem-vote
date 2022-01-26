/* eslint-disable react/jsx-props-no-spreading */
import { Box, Tab, Tabs, Theme, Typography } from '@mui/material';
import { useTheme } from '@mui/styles';
import { ReactNode, SyntheticEvent, useState } from 'react';
import SwipeableViews from 'react-swipeable-views';

import CandidateCard from '@/components/cards/BlockCard';
import { IBasicRegionalEvent } from '@/db/models/models.types';

export default function CandidateTabs({
  cEvent,
}: {
  cEvent: IBasicRegionalEvent;
}) {
  const [value, setValue] = useState(0);
  const theme = useTheme<Theme>();
  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };

  const { categories = [] } = cEvent;

  return (
    <Box className='w-full flex flex-col'>
      <Tabs
        onChange={handleChange}
        value={value}
        aria-label='Différentes catégories de vote'
        variant='scrollable'
        allowScrollButtonsMobile
        selectionFollowsFocus
      >
        {categories
          .sort((a, b) => (a > b ? 1 : -1))
          .map((catName, i) => (
            <Tab
              key={catName}
              label={catName}
              value={i}
              className='font-bold'
              {...a11yProps(i)}
            />
          ))}
      </Tabs>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        {categories.map((catName, i) => (
          <TabPanel key={catName} value={i} index={i} dir={theme.direction}>
            <div className='list-grid'>
              {(() => {
                const [{ candidates = [] }] = cEvent.payload.filter(
                  ({ post }) => post === categories[value],
                );
                return candidates.map((c) => (
                  <CandidateCard candidate={c} key={c.uid} isVoteCard />
                ));
              })()}
            </div>
          </TabPanel>
        ))}
      </SwipeableViews>
    </Box>
  );
}
function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}
interface TabPanelProps {
  children?: ReactNode;
  dir?: string;
  index: number;
  value: number;
  className?: string;
}
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
