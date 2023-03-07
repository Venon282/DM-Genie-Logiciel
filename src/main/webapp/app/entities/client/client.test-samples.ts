import { IClient, NewClient } from './client.model';

export const sampleWithRequiredData: IClient = {
  id: 71655,
  firstName: 'Esta',
  lastName: 'Stamm',
  address: 'experiences',
  phone: '+69',
  email: 'hpY9tg@M0649gpE',
  activated: false,
};

export const sampleWithPartialData: IClient = {
  id: 17055,
  firstName: 'Isaiah',
  lastName: 'MacGyver',
  address: 'Legacy ability input',
  phone: '+17',
  email: 'ZAm@2WDvMfGf',
  activated: true,
};

export const sampleWithFullData: IClient = {
  id: 79497,
  firstName: 'Abe',
  lastName: 'Veum',
  address: 'Shirt Soft',
  phone: '3',
  email: 'tp@m6d2HT#6GV-vs',
  activated: true,
};

export const sampleWithNewData: NewClient = {
  firstName: 'Jarret',
  lastName: 'Champlin',
  address: 'EXE Illinois Vatu',
  phone: '+98',
  email: 'tVjihp@FZnmBN',
  activated: false,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
