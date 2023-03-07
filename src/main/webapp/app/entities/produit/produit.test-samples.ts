import { IProduit, NewProduit } from './produit.model';

export const sampleWithRequiredData: IProduit = {
  id: 91013,
  name: 'Garden',
  description: 'New Ball',
  price: 87180,
};

export const sampleWithPartialData: IProduit = {
  id: 2823,
  name: 'Supervisor deposit CSS',
  description: 'Sleek input deposit',
  price: 89776,
  photo: '../fake-data/blob/hipster.png',
  photoContentType: 'unknown',
};

export const sampleWithFullData: IProduit = {
  id: 45890,
  name: 'Unbranded Connecticut sensor',
  description: 'e-services',
  price: 10343,
  photo: '../fake-data/blob/hipster.png',
  photoContentType: 'unknown',
};

export const sampleWithNewData: NewProduit = {
  name: 'Dinar Metal AI',
  description: 'Plastic',
  price: 24505,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
