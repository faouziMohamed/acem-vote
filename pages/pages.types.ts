import { IUserBasic } from '../lib/db/models/models.types';

export interface ICandidate {
  id: string;
  user: IUserBasic;
  details: { skills: string[]; description: string };
  candidatePost: string;
}

export interface CandidateModalProps {
  show: boolean;
  candidate?: ICandidate;
}

type ModalCBType = ICandidate | false;

export type SetShowModal = (candidate: ModalCBType | false) => void;
