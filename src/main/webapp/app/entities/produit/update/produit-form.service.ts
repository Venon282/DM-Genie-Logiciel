import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IProduit, NewProduit } from '../produit.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IProduit for edit and NewProduitFormGroupInput for create.
 */
type ProduitFormGroupInput = IProduit | PartialWithRequiredKeyOf<NewProduit>;

type ProduitFormDefaults = Pick<NewProduit, 'id' | 'commandes'>;

type ProduitFormGroupContent = {
  id: FormControl<IProduit['id'] | NewProduit['id']>;
  name: FormControl<IProduit['name']>;
  description: FormControl<IProduit['description']>;
  price: FormControl<IProduit['price']>;
  photo: FormControl<IProduit['photo']>;
  photoContentType: FormControl<IProduit['photoContentType']>;
  restaurant: FormControl<IProduit['restaurant']>;
  commandes: FormControl<IProduit['commandes']>;
};

export type ProduitFormGroup = FormGroup<ProduitFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ProduitFormService {
  createProduitFormGroup(produit: ProduitFormGroupInput = { id: null }): ProduitFormGroup {
    const produitRawValue = {
      ...this.getFormDefaults(),
      ...produit,
    };
    return new FormGroup<ProduitFormGroupContent>({
      id: new FormControl(
        { value: produitRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(produitRawValue.name, {
        validators: [Validators.required, Validators.minLength(2)],
      }),
      description: new FormControl(produitRawValue.description, {
        validators: [Validators.required, Validators.minLength(2)],
      }),
      price: new FormControl(produitRawValue.price, {
        validators: [Validators.required, Validators.min(0.01)],
      }),
      photo: new FormControl(produitRawValue.photo),
      photoContentType: new FormControl(produitRawValue.photoContentType),
      restaurant: new FormControl(produitRawValue.restaurant),
      commandes: new FormControl(produitRawValue.commandes ?? []),
    });
  }

  getProduit(form: ProduitFormGroup): IProduit | NewProduit {
    return form.getRawValue() as IProduit | NewProduit;
  }

  resetForm(form: ProduitFormGroup, produit: ProduitFormGroupInput): void {
    const produitRawValue = { ...this.getFormDefaults(), ...produit };
    form.reset(
      {
        ...produitRawValue,
        id: { value: produitRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ProduitFormDefaults {
    return {
      id: null,
      commandes: [],
    };
  }
}
