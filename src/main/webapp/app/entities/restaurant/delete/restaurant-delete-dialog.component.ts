import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IRestaurant } from '../restaurant.model';
import { RestaurantService } from '../service/restaurant.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './restaurant-delete-dialog.component.html',
})
export class RestaurantDeleteDialogComponent {
  restaurant?: IRestaurant;

  constructor(protected restaurantService: RestaurantService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.restaurantService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
