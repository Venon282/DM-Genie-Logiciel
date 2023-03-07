import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../coursier.test-samples';

import { CoursierFormService } from './coursier-form.service';

describe('Coursier Form Service', () => {
  let service: CoursierFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoursierFormService);
  });

  describe('Service methods', () => {
    describe('createCoursierFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCoursierFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            firstName: expect.any(Object),
            lastName: expect.any(Object),
            phone: expect.any(Object),
            email: expect.any(Object),
            vehicleType: expect.any(Object),
            activated: expect.any(Object),
          })
        );
      });

      it('passing ICoursier should create a new form with FormGroup', () => {
        const formGroup = service.createCoursierFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            firstName: expect.any(Object),
            lastName: expect.any(Object),
            phone: expect.any(Object),
            email: expect.any(Object),
            vehicleType: expect.any(Object),
            activated: expect.any(Object),
          })
        );
      });
    });

    describe('getCoursier', () => {
      it('should return NewCoursier for default Coursier initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCoursierFormGroup(sampleWithNewData);

        const coursier = service.getCoursier(formGroup) as any;

        expect(coursier).toMatchObject(sampleWithNewData);
      });

      it('should return NewCoursier for empty Coursier initial value', () => {
        const formGroup = service.createCoursierFormGroup();

        const coursier = service.getCoursier(formGroup) as any;

        expect(coursier).toMatchObject({});
      });

      it('should return ICoursier', () => {
        const formGroup = service.createCoursierFormGroup(sampleWithRequiredData);

        const coursier = service.getCoursier(formGroup) as any;

        expect(coursier).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICoursier should not enable id FormControl', () => {
        const formGroup = service.createCoursierFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCoursier should disable id FormControl', () => {
        const formGroup = service.createCoursierFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
