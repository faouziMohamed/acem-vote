import { PipelineStage } from 'mongoose';

export const basicEventQuery: PipelineStage[] = [
  {
    $lookup: {
      from: 'users',
      localField: 'candidates',
      foreignField: '_id',
      as: 'candidates',
    },
  },
  {
    $lookup: {
      from: 'offices',
      localField: 'eventLocation',
      foreignField: '_id',
      as: 'eventLocation',
    },
  },
  {
    $addFields: {
      eventId: '$_id',
      endDate: { $add: ['$startDate', '$eventDuration'] },
      eventScope: {
        $cond: {
          if: { $eq: ['$eventScope', 'regionalEvent'] },
          then: 'Régionale',
          else: 'Exécutif',
        },
      },
    },
  },
  { $unwind: '$eventLocation' },
  { $addFields: { event: '$$ROOT' } },
  { $project: { candidates: 1, event: 1 } },
  { $project: { event: { candidates: 0 } } },
  { $unwind: '$candidates' },
  { $addFields: { 'candidates.uid': { $toString: '$candidates._id' } } },
  { $project: { candidates: { _id: 0, __v: 0 } } },
  {
    $group: {
      _id: '$candidates.voteDetails.post',
      event: { $first: '$event' },
      candidates: { $push: '$candidates' },
    },
  },
  {
    $project: {
      event: {
        'eventLocation._id': 0,
        'eventLocation.eventScope': 0,
        'eventLocation.__v': 0,
        __v: 0,
      },
    },
  },
  {
    $group: {
      _id: { post: '$_id', candidates: '$candidates' },
      event: { $first: '$event' },
    },
  },
  { $group: { _id: '$event', payload: { $push: '$_id' } } },
  {
    $project: {
      eid: { $toString: '$_id._id' },
      event: '$_id',
      categories: {
        $map: { input: '$payload', as: 'post', in: '$$post.post' },
      },
      payload: 1,
      _id: 0,
    },
  },
  { $project: { 'event._id': 0 } },
];

export const getBasicEventQuery: () => PipelineStage[] = () => basicEventQuery;
