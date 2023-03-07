import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICoursier, NewCoursier } from '../coursier.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICoursier for edit and NewCoursierFormGroupInput for create.
 */
type CoursierFormGroupInput = ICoursier | PartialWithRequiredKeyOf<NewCoursier>;

type CoursierFormDefaults = Pick<NewCoursier, 'id' | 'activated'>;

type CoursierFormGroupContent = {
  id: FormControl<ICoursier['id'] | NewCoursier['id']>;
  firstName: FormControl<ICoursier['firstName']>;
  lastName: FormControl<ICoursier['lastName']>;
  phone: FormControl<ICoursier['phone']>;
  email: FormControl<ICoursier['email']>;
  vehicleType: FormControl<ICoursier['vehicleType']>;
  activated: FormControl<ICoursier['activated']>;
};

export type CoursierFormGroup = FormGroup<CoursierFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CoursierFormService {
  createCoursierFormGroup(coursier: CoursierFormGroupInput = { id: null }): CoursierFormGroup {
    const coursierRawValue = {
      ...this.getFormDefaults(),
      ...coursier,
    };
    return new FormGroup<CoursierFormGroupContent>({
      id: new FormControl(
        { value: coursierRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      firstName: new FormControl(coursierRawValue.firstName, {
        validators: [Validators.required, Validators.minLength(2), Validators.maxLength(50)],
      }),
      lastName: new FormControl(coursierRawValue.lastName, {
        validators: [Validators.required, Validators.minLength(2), Validators.maxLength(50)],
      }),
      phone: new FormControl(coursierRawValue.phone, {
        validators: [Validators.required, Validators.pattern('^([+][1-9][0-9]|[0-9])$')],
      }),
      email: new FormControl(coursierRawValue.email, {
        validators: [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')],
      }),
      vehicleType: new FormControl(coursierRawValue.vehicleType, {
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      activated: new FormControl(coursierRawValue.activated, {
        validators: [Validators.required],
      }),
    });
  }

  getCoursier(form: CoursierFormGroup): ICoursier | NewCoursier {
    return form.getRawValue() as ICoursier | NewCoursier;
  }

  resetForm(form: CoursierFormGroup, coursier: CoursierFormGroupInput): void {
    const coursierRawValue = { ...this.getFormDefaults(), ...coursier };
    form.reset(
      {
        ...coursierRawValue,
        id: { value: coursierRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CoursierFormDefaults {
    return {
      id: null,
      activated: false,
    };
  }
}
