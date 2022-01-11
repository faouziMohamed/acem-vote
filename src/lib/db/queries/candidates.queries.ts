import type { PipelineStage } from 'mongoose';

import type { ICandidateData } from '@/db/models/models.types';
import { RegionalEvent } from '@/db/models/vote-event.model';

type CandidateAggregation = (
  scope: string,
  cityName: string,
) => PipelineStage[];

export const candidateAgg: CandidateAggregation = (scope, cityName = '') => {
  let queryScope = {};
  if (scope === 'Regional') {
    queryScope = {
      'eventLocation.cityName': cityName,
      'eventLocation.eventScope': scope,
    };
  } else if (scope === 'Executive') {
    queryScope = {
      'eventLocation.eventScope': scope,
    };
  }
  return [
    {
      $lookup: {
        from: 'offices',
        localField: 'eventLocation',
        foreignField: '_id',
        as: 'eventLocation',
      },
    },
    {
      $match: queryScope,
    },
    {
      $lookup: {
        from: 'users',
        localField: 'candidates',
        foreignField: '_id',
        as: 'candidates',
      },
    },
    { $unwind: '$candidates' },
    {
      $match: {
        'candidates.isMembershipActive': false,
      },
    },
    {
      $addFields: {
        eventId: { $toString: '$_id' },
        endDate: { $add: ['$startDate', '$eventDuration'] },
      },
    },
    { $unwind: '$eventLocation' },
    {
      $addFields: { 'candidates.uid': { $toString: '$candidates._id' } },
    },
    {
      $project: {
        'eventLocation.cityName': 1,
        eventName: 1,
        startDate: 1,
        endDate: 1,
        eventDuration: 1,
        candidates: {
          uid: 1,
          orgId: 1,
          firstname: 1,
          lastname: 1,
          avatar: 1,
          details: 1,
          voteDetails: 1,
        },
      },
    },
    { $project: { _id: 0, candidates: { details: { city: 0 } } } },
    {
      $group: {
        _id: '$_id',
        candidates: { $push: '$candidates' },
        root: { $first: '$$ROOT' },
      },
    },
    { $addFields: { 'root.candidates': '$candidates' } },
    { $replaceRoot: { newRoot: '$root' } },
  ];
};

export const getCandidatesAggregate = async (
  scope: string,
  cityName: string,
) => {
  const [allCandidates] = await RegionalEvent.aggregate<ICandidateData>(
    candidateAgg(scope, cityName),
  );
  const count = allCandidates.candidates.length;
  return { data: allCandidates, count };
};
