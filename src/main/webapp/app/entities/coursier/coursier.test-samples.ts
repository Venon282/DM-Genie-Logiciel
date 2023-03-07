import { ICoursier, NewCoursier } from './coursier.model';

export const sampleWithRequiredData: ICoursier = {
  id: 64789,
  firstName: 'Tracey',
  lastName: 'Koelpin',
  phone: '+75',
  email: 'J@Blclk-<QL.he',
  vehicleType: 'Bermuda Steel',
  activated: false,
};

export const sampleWithPartialData: ICoursier = {
  id: 40086,
  firstName: 'Curtis',
  lastName: 'Murazik',
  phone: '+94',
  email: '32sD13@h1qDOCp.U',
  vehicleType: 'Agent interfaces',
  activated: true,
};

export const sampleWithFullData: ICoursier = {
  id: 66310,
  firstName: 'Reina',
  lastName: 'Dietrich',
  phone: '+23',
  email: 'uUSH6E@lVMfLqDzDR',
  vehicleType: 'infrastructure Metal Human',
  activated: false,
};

export const sampleWithNewData: NewCoursier = {
  firstName: 'Nayeli',
  lastName: 'Satterfield',
  phone: '+93',
  email: 'nL@tBu669+pKoz',
  vehicleType: 'Gibraltar',
  activated: true,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
