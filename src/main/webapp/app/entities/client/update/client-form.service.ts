import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IClient, NewClient } from '../client.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IClient for edit and NewClientFormGroupInput for create.
 */
type ClientFormGroupInput = IClient | PartialWithRequiredKeyOf<NewClient>;

type ClientFormDefaults = Pick<NewClient, 'id' | 'activated'>;

type ClientFormGroupContent = {
  id: FormControl<IClient['id'] | NewClient['id']>;
  firstName: FormControl<IClient['firstName']>;
  lastName: FormControl<IClient['lastName']>;
  address: FormControl<IClient['address']>;
  phone: FormControl<IClient['phone']>;
  email: FormControl<IClient['email']>;
  activated: FormControl<IClient['activated']>;
};

export type ClientFormGroup = FormGroup<ClientFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ClientFormService {
  createClientFormGroup(client: ClientFormGroupInput = { id: null }): ClientFormGroup {
    const clientRawValue = {
      ...this.getFormDefaults(),
      ...client,
    };
    return new FormGroup<ClientFormGroupContent>({
      id: new FormControl(
        { value: clientRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      firstName: new FormControl(clientRawValue.firstName, {
        validators: [Validators.required, Validators.minLength(2), Validators.maxLength(50)],
      }),
      lastName: new FormControl(clientRawValue.lastName, {
        validators: [Validators.required, Validators.minLength(2), Validators.maxLength(50)],
      }),
      address: new FormControl(clientRawValue.address, {
        validators: [Validators.required, Validators.minLength(2), Validators.maxLength(100)],
      }),
      phone: new FormControl(clientRawValue.phone, {
        validators: [Validators.required, Validators.pattern('^([+][1-9][0-9]|[0-9])$')],
      }),
      email: new FormControl(clientRawValue.email, {
        validators: [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')],
      }),
      activated: new FormControl(clientRawValue.activated, {
        validators: [Validators.required],
      }),
    });
  }

  getClient(form: ClientFormGroup): IClient | NewClient {
    return form.getRawValue() as IClient | NewClient;
  }

  resetForm(form: ClientFormGroup, client: ClientFormGroupInput): void {
    const clientRawValue = { ...this.getFormDefaults(), ...client };
    form.reset(
      {
        ...clientRawValue,
        id: { value: clientRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ClientFormDefaults {
    return {
      id: null,
      activated: false,
    };
  }
}
