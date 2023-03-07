import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICoursier, NewCoursier } from '../coursier.model';

export type PartialUpdateCoursier = Partial<ICoursier> & Pick<ICoursier, 'id'>;

export type EntityResponseType = HttpResponse<ICoursier>;
export type EntityArrayResponseType = HttpResponse<ICoursier[]>;

@Injectable({ providedIn: 'root' })
export class CoursierService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/coursiers');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(coursier: NewCoursier): Observable<EntityResponseType> {
    return this.http.post<ICoursier>(this.resourceUrl, coursier, { observe: 'response' });
  }

  update(coursier: ICoursier): Observable<EntityResponseType> {
    return this.http.put<ICoursier>(`${this.resourceUrl}/${this.getCoursierIdentifier(coursier)}`, coursier, { observe: 'response' });
  }

  partialUpdate(coursier: PartialUpdateCoursier): Observable<EntityResponseType> {
    return this.http.patch<ICoursier>(`${this.resourceUrl}/${this.getCoursierIdentifier(coursier)}`, coursier, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICoursier>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICoursier[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCoursierIdentifier(coursier: Pick<ICoursier, 'id'>): number {
    return coursier.id;
  }

  compareCoursier(o1: Pick<ICoursier, 'id'> | null, o2: Pick<ICoursier, 'id'> | null): boolean {
    return o1 && o2 ? this.getCoursierIdentifier(o1) === this.getCoursierIdentifier(o2) : o1 === o2;
  }

  addCoursierToCollectionIfMissing<Type extends Pick<ICoursier, 'id'>>(
    coursierCollection: Type[],
    ...coursiersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const coursiers: Type[] = coursiersToCheck.filter(isPresent);
    if (coursiers.length > 0) {
      const coursierCollectionIdentifiers = coursierCollection.map(coursierItem => this.getCoursierIdentifier(coursierItem)!);
      const coursiersToAdd = coursiers.filter(coursierItem => {
        const coursierIdentifier = this.getCoursierIdentifier(coursierItem);
        if (coursierCollectionIdentifiers.includes(coursierIdentifier)) {
          return false;
        }
        coursierCollectionIdentifiers.push(coursierIdentifier);
        return true;
      });
      return [...coursiersToAdd, ...coursierCollection];
    }
    return coursierCollection;
  }
}
