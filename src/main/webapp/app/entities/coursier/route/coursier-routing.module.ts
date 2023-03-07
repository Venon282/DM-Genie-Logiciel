import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CoursierComponent } from '../list/coursier.component';
import { CoursierDetailComponent } from '../detail/coursier-detail.component';
import { CoursierUpdateComponent } from '../update/coursier-update.component';
import { CoursierRoutingResolveService } from './coursier-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const coursierRoute: Routes = [
  {
    path: '',
    component: CoursierComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CoursierDetailComponent,
    resolve: {
      coursier: CoursierRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CoursierUpdateComponent,
    resolve: {
      coursier: CoursierRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CoursierUpdateComponent,
    resolve: {
      coursier: CoursierRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(coursierRoute)],
  exports: [RouterModule],
})
export class CoursierRoutingModule {}
