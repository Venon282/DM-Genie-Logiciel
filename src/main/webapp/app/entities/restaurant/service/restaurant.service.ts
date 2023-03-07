import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRestaurant, NewRestaurant } from '../restaurant.model';

export type PartialUpdateRestaurant = Partial<IRestaurant> & Pick<IRestaurant, 'id'>;

export type EntityResponseType = HttpResponse<IRestaurant>;
export type EntityArrayResponseType = HttpResponse<IRestaurant[]>;

@Injectable({ providedIn: 'root' })
export class RestaurantService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/restaurants');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(restaurant: NewRestaurant): Observable<EntityResponseType> {
    return this.http.post<IRestaurant>(this.resourceUrl, restaurant, { observe: 'response' });
  }

  update(restaurant: IRestaurant): Observable<EntityResponseType> {
    return this.http.put<IRestaurant>(`${this.resourceUrl}/${this.getRestaurantIdentifier(restaurant)}`, restaurant, {
      observe: 'response',
    });
  }

  partialUpdate(restaurant: PartialUpdateRestaurant): Observable<EntityResponseType> {
    return this.http.patch<IRestaurant>(`${this.resourceUrl}/${this.getRestaurantIdentifier(restaurant)}`, restaurant, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IRestaurant>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRestaurant[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getRestaurantIdentifier(restaurant: Pick<IRestaurant, 'id'>): number {
    return restaurant.id;
  }

  compareRestaurant(o1: Pick<IRestaurant, 'id'> | null, o2: Pick<IRestaurant, 'id'> | null): boolean {
    return o1 && o2 ? this.getRestaurantIdentifier(o1) === this.getRestaurantIdentifier(o2) : o1 === o2;
  }

  addRestaurantToCollectionIfMissing<Type extends Pick<IRestaurant, 'id'>>(
    restaurantCollection: Type[],
    ...restaurantsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const restaurants: Type[] = restaurantsToCheck.filter(isPresent);
    if (restaurants.length > 0) {
      const restaurantCollectionIdentifiers = restaurantCollection.map(restaurantItem => this.getRestaurantIdentifier(restaurantItem)!);
      const restaurantsToAdd = restaurants.filter(restaurantItem => {
        const restaurantIdentifier = this.getRestaurantIdentifier(restaurantItem);
        if (restaurantCollectionIdentifiers.includes(restaurantIdentifier)) {
          return false;
        }
        restaurantCollectionIdentifiers.push(restaurantIdentifier);
        return true;
      });
      return [...restaurantsToAdd, ...restaurantCollection];
    }
    return restaurantCollection;
  }
}
