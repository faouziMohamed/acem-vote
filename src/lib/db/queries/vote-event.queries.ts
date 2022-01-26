import type {
  IBasicRegionalEvent,
  IdType,
  IRegionalEventSchema,
} from '../models/models.types';
import { RegionalEvent } from '../models/vote-event.model';
import { basicEventQuery, getBasicEventQuery } from './aggregations-queries';

export async function createRegionalVoteEvent({
  eventName,
  startDate,
  eventDuration,
  eventLocation,
  candidates,
}: IRegionalEventSchema) {
  return RegionalEvent.create({
    eventName,
    startDate,
    eventDuration,
    eventLocation,
    candidates,
  });
}

export async function getEventById(eventId: IdType) {
  const aggregation = getBasicEventQuery();
  const [voteEvent] = await RegionalEvent.aggregate<IBasicRegionalEvent>([
    { $match: { _id: eventId } },
    ...aggregation,
  ]);
  return voteEvent;
}

export async function getEvents() {
  return RegionalEvent.aggregate<IBasicRegionalEvent>([...basicEventQuery]);
}

export async function getLastEvent() {
  const [voteEvent] = await RegionalEvent.aggregate<IBasicRegionalEvent>([
    { $sort: { startDate: -1 } },
    ...basicEventQuery,
  ]);
  return voteEvent;
}

export const getEventByName = async (eventName: string) => {
  const [voteEvent] = await RegionalEvent.aggregate<IBasicRegionalEvent>([
    { $match: { eventName } },
    ...basicEventQuery,
  ]);
  return voteEvent;
};
