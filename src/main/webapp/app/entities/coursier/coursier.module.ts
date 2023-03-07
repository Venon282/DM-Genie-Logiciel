import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CoursierComponent } from './list/coursier.component';
import { CoursierDetailComponent } from './detail/coursier-detail.component';
import { CoursierUpdateComponent } from './update/coursier-update.component';
import { CoursierDeleteDialogComponent } from './delete/coursier-delete-dialog.component';
import { CoursierRoutingModule } from './route/coursier-routing.module';

@NgModule({
  imports: [SharedModule, CoursierRoutingModule],
  declarations: [CoursierComponent, CoursierDetailComponent, CoursierUpdateComponent, CoursierDeleteDialogComponent],
})
export class CoursierModule {}
