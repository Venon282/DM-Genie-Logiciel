import { ICommande, NewCommande } from './commande.model';

export const sampleWithRequiredData: ICommande = {
  id: 5189,
  deliveryAddress: 'Frozen Associate',
  deliveryLatitude: 93952,
  deliveryLongitude: 76871,
  deliveryDistance: 40062,
  deliveryFees: 27961,
  status: 'Keyboard Coves overriding',
};

export const sampleWithPartialData: ICommande = {
  id: 93441,
  deliveryAddress: 'invoice purposes Pizza',
  deliveryLatitude: 69863,
  deliveryLongitude: 16299,
  deliveryDistance: 92669,
  deliveryFees: 39982,
  status: 'firmware Passage Down-sized',
};

export const sampleWithFullData: ICommande = {
  id: 59398,
  deliveryAddress: 'Spring Ergonomic',
  deliveryLatitude: 42750,
  deliveryLongitude: 40096,
  deliveryDistance: 48601,
  deliveryFees: 28327,
  status: 'Strategist Intelligent',
};

export const sampleWithNewData: NewCommande = {
  deliveryAddress: 'redundant',
  deliveryLatitude: 60722,
  deliveryLongitude: 67771,
  deliveryDistance: 16385,
  deliveryFees: 81666,
  status: 'calculate seamless Analyst',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
