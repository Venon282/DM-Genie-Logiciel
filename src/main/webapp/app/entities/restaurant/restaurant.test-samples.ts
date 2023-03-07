import { Language } from 'app/entities/enumerations/language.model';

import { IRestaurant, NewRestaurant } from './restaurant.model';

export const sampleWithRequiredData: IRestaurant = {
  id: 59197,
  name: 'zero Human',
  address: 'Future-proofed Rustic Director',
  phone: '7',
  email: 'c@J36GK',
  description: 'Technician Squares',
  language: Language['SPANISH'],
  activated: true,
};

export const sampleWithPartialData: IRestaurant = {
  id: 99702,
  name: 'Computers',
  address: 'Checking sticky',
  phone: '+18',
  email: 'DU@uf7bkxgltB',
  description: 'back',
  language: Language['FRENCH'],
  activated: false,
};

export const sampleWithFullData: IRestaurant = {
  id: 99090,
  name: 'redundant',
  address: 'backing Nepalese Auto',
  phone: '9',
  email: 'GPwf6A@QCPd]aIOve',
  description: 'Chile Future',
  language: Language['SPANISH'],
  activated: false,
};

export const sampleWithNewData: NewRestaurant = {
  name: 'Frozen',
  address: 'Garden Shoes Clothing',
  phone: '+79',
  email: '6T+o0@-Y2r,g9X',
  description: 'withdrawal Car Principal',
  language: Language['FRENCH'],
  activated: true,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
