import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { RestaurantFormService, RestaurantFormGroup } from './restaurant-form.service';
import { IRestaurant } from '../restaurant.model';
import { RestaurantService } from '../service/restaurant.service';
import { Language } from 'app/entities/enumerations/language.model';

@Component({
  selector: 'jhi-restaurant-update',
  templateUrl: './restaurant-update.component.html',
})
export class RestaurantUpdateComponent implements OnInit {
  isSaving = false;
  restaurant: IRestaurant | null = null;
  languageValues = Object.keys(Language);

  editForm: RestaurantFormGroup = this.restaurantFormService.createRestaurantFormGroup();

  constructor(
    protected restaurantService: RestaurantService,
    protected restaurantFormService: RestaurantFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ restaurant }) => {
      this.restaurant = restaurant;
      if (restaurant) {
        this.updateForm(restaurant);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const restaurant = this.restaurantFormService.getRestaurant(this.editForm);
    if (restaurant.id !== null) {
      this.subscribeToSaveResponse(this.restaurantService.update(restaurant));
    } else {
      this.subscribeToSaveResponse(this.restaurantService.create(restaurant));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRestaurant>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(restaurant: IRestaurant): void {
    this.restaurant = restaurant;
    this.restaurantFormService.resetForm(this.editForm, restaurant);
  }
}
