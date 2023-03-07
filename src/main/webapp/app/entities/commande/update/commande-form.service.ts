import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICommande, NewCommande } from '../commande.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICommande for edit and NewCommandeFormGroupInput for create.
 */
type CommandeFormGroupInput = ICommande | PartialWithRequiredKeyOf<NewCommande>;

type CommandeFormDefaults = Pick<NewCommande, 'id' | 'produits'>;

type CommandeFormGroupContent = {
  id: FormControl<ICommande['id'] | NewCommande['id']>;
  deliveryAddress: FormControl<ICommande['deliveryAddress']>;
  deliveryLatitude: FormControl<ICommande['deliveryLatitude']>;
  deliveryLongitude: FormControl<ICommande['deliveryLongitude']>;
  deliveryDistance: FormControl<ICommande['deliveryDistance']>;
  deliveryFees: FormControl<ICommande['deliveryFees']>;
  status: FormControl<ICommande['status']>;
  coursier: FormControl<ICommande['coursier']>;
  client: FormControl<ICommande['client']>;
  restaurant: FormControl<ICommande['restaurant']>;
  produits: FormControl<ICommande['produits']>;
};

export type CommandeFormGroup = FormGroup<CommandeFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CommandeFormService {
  createCommandeFormGroup(commande: CommandeFormGroupInput = { id: null }): CommandeFormGroup {
    const commandeRawValue = {
      ...this.getFormDefaults(),
      ...commande,
    };
    return new FormGroup<CommandeFormGroupContent>({
      id: new FormControl(
        { value: commandeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      deliveryAddress: new FormControl(commandeRawValue.deliveryAddress, {
        validators: [Validators.required, Validators.minLength(2), Validators.maxLength(100)],
      }),
      deliveryLatitude: new FormControl(commandeRawValue.deliveryLatitude, {
        validators: [Validators.required],
      }),
      deliveryLongitude: new FormControl(commandeRawValue.deliveryLongitude, {
        validators: [Validators.required],
      }),
      deliveryDistance: new FormControl(commandeRawValue.deliveryDistance, {
        validators: [Validators.required],
      }),
      deliveryFees: new FormControl(commandeRawValue.deliveryFees, {
        validators: [Validators.required],
      }),
      status: new FormControl(commandeRawValue.status, {
        validators: [Validators.required],
      }),
      coursier: new FormControl(commandeRawValue.coursier),
      client: new FormControl(commandeRawValue.client),
      restaurant: new FormControl(commandeRawValue.restaurant),
      produits: new FormControl(commandeRawValue.produits ?? []),
    });
  }

  getCommande(form: CommandeFormGroup): ICommande | NewCommande {
    return form.getRawValue() as ICommande | NewCommande;
  }

  resetForm(form: CommandeFormGroup, commande: CommandeFormGroupInput): void {
    const commandeRawValue = { ...this.getFormDefaults(), ...commande };
    form.reset(
      {
        ...commandeRawValue,
        id: { value: commandeRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CommandeFormDefaults {
    return {
      id: null,
      produits: [],
    };
  }
}
