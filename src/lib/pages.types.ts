import { ICandidateData, ICandidateDetails } from '@/db/models/models.types';

export interface ICandidateAPIResponse {
  data: ICandidateData;
  count: number;
}

export interface CandidateModalProps {
  show: boolean;
  candidate?: ICandidateDetails;
}

type ModalCBType = ICandidateDetails | false;

export type SetShowModal = (candidate: ModalCBType | false) => void;
