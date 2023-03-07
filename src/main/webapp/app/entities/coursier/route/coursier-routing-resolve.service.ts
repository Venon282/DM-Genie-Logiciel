import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICoursier } from '../coursier.model';
import { CoursierService } from '../service/coursier.service';

@Injectable({ providedIn: 'root' })
export class CoursierRoutingResolveService implements Resolve<ICoursier | null> {
  constructor(protected service: CoursierService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICoursier | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((coursier: HttpResponse<ICoursier>) => {
          if (coursier.body) {
            return of(coursier.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
