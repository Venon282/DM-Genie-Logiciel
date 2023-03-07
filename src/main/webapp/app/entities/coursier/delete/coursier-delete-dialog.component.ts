import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICoursier } from '../coursier.model';
import { CoursierService } from '../service/coursier.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './coursier-delete-dialog.component.html',
})
export class CoursierDeleteDialogComponent {
  coursier?: ICoursier;

  constructor(protected coursierService: CoursierService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.coursierService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
