import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProduit } from '../produit.model';
import { ProduitService } from '../service/produit.service';

@Injectable({ providedIn: 'root' })
export class ProduitRoutingResolveService implements Resolve<IProduit | null> {
  constructor(protected service: ProduitService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProduit | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((produit: HttpResponse<IProduit>) => {
          if (produit.body) {
            return of(produit.body);
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
