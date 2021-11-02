import VoteEvent from '../models/vote-event.model';

export async function createEvent({ eventName, eventDate, eventDuration = 0 }) {
  return VoteEvent.create({
    eventName,
    eventDate,
    eventDuration,
  });
}

export async function getEventById(eventId) {
  return VoteEvent.aggregate([
    { $match: { _id: eventId } },
    {
      $addFields: {
        eventId: '$_id',
        endDate: { $add: ['$eventDate', '$eventDuration'] },
      },
    },
    {
      $project: {
        eventId: 1,
        eventName: 1,
        eventDate: 1,
        eventDuration: 1,
        endDate: 1,
        _id: 0,
      },
    },
  ]);
}

export async function getEvents() {
  return VoteEvent.aggregate([
    {
      $addFields: {
        eventId: '$_id',
        endDate: { $add: ['$eventDate', '$eventDuration'] },
      },
    },
    {
      $project: {
        eventId: 1,
        eventName: 1,
        eventDate: 1,
        eventDuration: 1,
        endDate: 1,
        _id: 0,
      },
    },
  ]);
}

export async function getLastEvent() {
  return VoteEvent.aggregate([
    { $sort: { eventDate: -1 } },
    { $limit: 1 },
    {
      $addFields: {
        eventId: '$_id',
        endDate: { $add: ['$eventDate', '$eventDuration'] },
      },
    },
    {
      $project: {
        eventId: 1,
        eventName: 1,
        eventDate: 1,
        eventDuration: 1,
        endDate: 1,
        _id: 0,
      },
    },
  ]);
}

export const getEventByName = async (eventName) => {
  return VoteEvent.aggregate([
    { $match: { eventName } },
    { $limit: 1 },
    {
      $addFields: {
        eventId: '$_id',
        endDate: {
          $add: ['$eventDate', '$eventDuration'],
        },
      },
    },
    {
      $project: {
        eventId: 1,
        eventName: 1,
        eventDate: 1,
        eventDuration: 1,
        endDate: 1,
        _id: 0,
      },
    },
  ]);
};
