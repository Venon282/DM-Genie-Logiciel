import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IRestaurant, NewRestaurant } from '../restaurant.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IRestaurant for edit and NewRestaurantFormGroupInput for create.
 */
type RestaurantFormGroupInput = IRestaurant | PartialWithRequiredKeyOf<NewRestaurant>;

type RestaurantFormDefaults = Pick<NewRestaurant, 'id' | 'activated'>;

type RestaurantFormGroupContent = {
  id: FormControl<IRestaurant['id'] | NewRestaurant['id']>;
  name: FormControl<IRestaurant['name']>;
  address: FormControl<IRestaurant['address']>;
  phone: FormControl<IRestaurant['phone']>;
  email: FormControl<IRestaurant['email']>;
  description: FormControl<IRestaurant['description']>;
  language: FormControl<IRestaurant['language']>;
  activated: FormControl<IRestaurant['activated']>;
};

export type RestaurantFormGroup = FormGroup<RestaurantFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class RestaurantFormService {
  createRestaurantFormGroup(restaurant: RestaurantFormGroupInput = { id: null }): RestaurantFormGroup {
    const restaurantRawValue = {
      ...this.getFormDefaults(),
      ...restaurant,
    };
    return new FormGroup<RestaurantFormGroupContent>({
      id: new FormControl(
        { value: restaurantRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(restaurantRawValue.name, {
        validators: [Validators.required, Validators.minLength(2), Validators.maxLength(50)],
      }),
      address: new FormControl(restaurantRawValue.address, {
        validators: [Validators.required, Validators.minLength(2), Validators.maxLength(100)],
      }),
      phone: new FormControl(restaurantRawValue.phone, {
        validators: [Validators.required, Validators.pattern('^([+][1-9][0-9]|[0-9])$')],
      }),
      email: new FormControl(restaurantRawValue.email, {
        validators: [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')],
      }),
      description: new FormControl(restaurantRawValue.description, {
        validators: [Validators.required, Validators.minLength(2), Validators.maxLength(2000)],
      }),
      language: new FormControl(restaurantRawValue.language, {
        validators: [Validators.required],
      }),
      activated: new FormControl(restaurantRawValue.activated, {
        validators: [Validators.required],
      }),
    });
  }

  getRestaurant(form: RestaurantFormGroup): IRestaurant | NewRestaurant {
    return form.getRawValue() as IRestaurant | NewRestaurant;
  }

  resetForm(form: RestaurantFormGroup, restaurant: RestaurantFormGroupInput): void {
    const restaurantRawValue = { ...this.getFormDefaults(), ...restaurant };
    form.reset(
      {
        ...restaurantRawValue,
        id: { value: restaurantRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): RestaurantFormDefaults {
    return {
      id: null,
      activated: false,
    };
  }
}
