/* eslint-disable no-var */
/* eslint-disable vars-on-top */
import type { Document, Types } from 'mongoose';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export enum VoteCategories {
  // Bureau regional
  SG = 'Sécretaire Générale',
  CONTROLLEUR = 'Controlleur',
  CHARGEE_CULTURELLE = 'Chargée culturelle',
  CHARGEE_SPORTIF = 'Chargée sportif',
  TRESORIER = 'Trésorier',
  // Bureau executif
  PRESIDENT = 'Président',
  VICE_PRESIDENT = 'Vice-Président',
  COM_AUX_COMPTES = 'Commisaire aux comptes',
  DEFAULT = 'Default',
}

export interface IUserBasic extends Express.User {
  avatar: string;
  completedEvents?: string[];
  details: {
    email?: string;
    phone?: string;
    skills: string[];
    city?: { cityName?: string; cityId?: string };
    description: string;
  };
  events?: string[];
  firstLoginDate?: Date;
  firstname: string;
  isCandidate?: boolean;
  isFirstLogin?: boolean;
  isLocked?: boolean;
  isMembershipActive?: boolean;
  lastname: string;
  missedEvents?: string[];
  orgId: string;
  role?: UserRole;
  uid: string;
  votedCategories?: {
    eventID: string;
    catNames: VoteCategories[];
    voteCompleted: boolean;
  }[];
  voteDetails: {
    post: VoteCategories;
    votes: { yes: number; no: number; abstain: number };
    isWinner: boolean;
    depositionDate: Date;
  };
}

type ToOmit =
  | 'details'
  | 'events'
  | 'completedEvents'
  | 'missedEvents'
  | 'votedCategories';

type UserBasic = Omit<IUserBasic, ToOmit> & {
  details: Omit<IUserBasic['details'], 'city'> & { city?: Types.ObjectId };
  events?: Types.ObjectId[];
  completedEvents?: Types.ObjectId[];
  missedEvents?: Types.ObjectId[];
  votedCategories?: {
    eventId: Types.ObjectId;
    catNames: VoteCategories[];
    voteCompleted: boolean;
  }[];
};

export interface IUserSchema extends UserBasic, Document {}

export interface ICandidateDetails {
  orgId: IUserBasic['orgId'];
  firstname: IUserBasic['firstname'];
  lastname: IUserBasic['lastname'];
  avatar: IUserBasic['avatar'];
  details: Omit<IUserBasic['details'], 'email' | 'phone' | 'city'>;
  voteDetails: IUserBasic['voteDetails'];
  uid: IUserBasic['uid'];
}

export interface ICandidateData {
  eventLocation: {
    cityName: string;
    eventScope: string;
  };
  eventName: string;
  startDate: Date | string;
  eventDuration: number;
  candidates: ICandidateDetails[];
  endDate: Date | string;
}

export interface IBasicRegionalEvent {
  eid: string;
  categories: VoteCategories[];
  event: {
    eventLocation: { cityName: string };
    eventName: string;
    startDate: Date | string;
    eventDuration: number;
    eventStatus: IEventStatus;
    eventImage: string;
    eventDescription: string;
    candidates: IUserBasic[];
    eventScope: string;
    createdAt: Date | string;
    updatedAt: Date | string;
    eventId: IdType;
    endDate: Date | string;
  };
  payload: { post: VoteCategories; candidates: IUserBasic[] }[];
}

export interface IKeysSchema extends Document {
  email: string;
  name: string;
  publicArmoredKey: string;
  privateArmoredKey: string;
  revocationCertificate?: string;
  passphrase?: string;
  knownEntities?: { name: string; publicKey: string }[];
}

export interface IVoteIDSchema extends Document {
  userID: IUserSchema['_id'] | Types.ObjectId;
}

export enum IEventStatus {
  OPEN = 'open',
  CLOSED = 'closed',
}
export interface IVoteEventSchema extends Document {
  eventName: string;
  startDate: Date;
  eventDuration: number;
  eventStatus: IEventStatus;
  eventImage?: string;
  eventDescription?: string;
  createdBy?: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
  candidates?: Types.ObjectId[];
}

export interface IExecutiveEventSchema extends IVoteEventSchema {
  executiveMembers: Types.ObjectId;
}

export interface IRegionalEventSchema extends IVoteEventSchema {
  eventLocation: Types.ObjectId;
}

export enum AdminLevel {
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export interface IAdminSchema extends Document {
  username: string;
  password: string;
  user: Types.ObjectId;
  privilegeLevel?: AdminLevel;
  notifications?: Types.ObjectId;
}

export interface IAdminLogSchema extends Document {
  admin: Types.ObjectId;
  actions: string[];
  logDate?: Date;
}

export interface INotificationSchema extends Document {
  title: string;
  message: string;
  overview: string;
  date?: Date;
  user: Types.ObjectId;
  seen: boolean;
}

export interface IRegionalOfficeSchema extends Document {
  cityName: string;
  secretaryName?: Types.ObjectId;
  controllerName?: Types.ObjectId;
  culturalOfficerName?: Types.ObjectId;
  sportsManagerName?: Types.ObjectId;
  treasurerName?: Types.ObjectId;
}

export interface IExecutiveOfficeSchema extends Document {
  presidentName?: Types.ObjectId;
  vicePresidentName?: Types.ObjectId;
  statutaryAuditorName?: Types.ObjectId;
}

export enum PendingTypes {
  SET_ADMIN = 'SET_ADMIN',
  SET_CANDIDATE = 'SET_CANDIDATE',
  UNSET_CANDIDATE = 'UNSET_CANDIDATE',
  UNSET_ADMIN = 'UNSET_ADMIN',
}

export enum RequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export interface IPendingRequestSchema {
  userID: Types.ObjectId;
  requestType: PendingTypes;
  requestDetails: string;
  requestDate?: Date;
  requestStatus?: RequestStatus;
  requestComment?: string;
  requestCommentDate?: Date;
}

export interface IKeyBasic {
  email: string;
  name: string;
  publicArmoredKey: string;
  privateArmoredKey: string;
  revocationCertificate?: string;
  passphrase?: string;
  knownEntities: IKnowEntity[];
}

export interface IKnowEntity {
  name: string;
  publicKey: string;
}

export type IdType = string | Types.ObjectId;
