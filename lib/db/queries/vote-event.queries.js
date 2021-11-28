import { Schema } from 'mongoose';

import User from '../models/user.model';
import { RegionalEvent } from '../models/vote-event.model';

export async function createRegionalVoteEvent({
  eventName,
  startDate,
  eventDuration,
  eventLocation = Schema.Types.ObjectId,
  candidates = [User],
}) {
  return RegionalEvent.create({
    eventName,
    startDate,
    eventDuration,
    eventLocation,
    candidates,
  });
}

const retrieveAndPopulateventQuery = [
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
          then: 'Regionale',
          else: 'Exécutif',
        },
      },
    },
  },
  { $unwind: '$eventLocation' },
  { $unwind: '$candidates' },
  { $addFields: { 'candidates.uid': '$candidates._id' } },
  {
    $project: {
      _id: 0,
      __v: 0,
      'eventLocation._id': 0,
      'eventLocation.eventScope': 0,
      'eventLocation.__v': 0,
      'candidates._id': 0,
      'candidates.__v': 0,
    },
  },
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

export async function getEventById(eventId) {
  const [voteEvent] = await RegionalEvent.aggregate([
    { $match: { _id: eventId } },
    ...retrieveAndPopulateventQuery,
  ]);
  return voteEvent;
}

export async function getEvents() {
  return RegionalEvent.aggregate([...retrieveAndPopulateventQuery]);
}

export async function getLastEvent() {
  const [voteEvent] = await RegionalEvent.aggregate([
    { $sort: { startDate: -1 } },
    ...retrieveAndPopulateventQuery,
  ]);
  return voteEvent;
}

export const getEventByName = async (eventName) => {
  const [voteEvent] = RegionalEvent.aggregate([
    { $match: { eventName } },
    ...retrieveAndPopulateventQuery,
  ]);
  return voteEvent;
};
