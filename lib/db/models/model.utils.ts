import type { Document } from 'mongoose';

export const schemaOptions = {
  timestamps: true,
  toObject: {
    transform: function transform(_doc: Document, ret: Document) {
      delete ret.__v;
    },
  },
  toJSON: {
    transform: function transform(_doc: Document, ret: Document) {
      delete ret.__v;
    },
  },
};

export const voteCategories = [
  // Bureau regional
  'Sécretaire Générale',
  'Controlleur',
  'Chargée culturelle',
  'Chargée sportif',
  'Trésorier',
  // Bureau executif
  'Président',
  'Vice-Président',
  'Commisaire aux comptes',
];

export const eventScopes = ['regional', 'executive'];
