import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICommande, NewCommande } from '../commande.model';

export type PartialUpdateCommande = Partial<ICommande> & Pick<ICommande, 'id'>;

export type EntityResponseType = HttpResponse<ICommande>;
export type EntityArrayResponseType = HttpResponse<ICommande[]>;

@Injectable({ providedIn: 'root' })
export class CommandeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/commandes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(commande: NewCommande): Observable<EntityResponseType> {
    return this.http.post<ICommande>(this.resourceUrl, commande, { observe: 'response' });
  }

  update(commande: ICommande): Observable<EntityResponseType> {
    return this.http.put<ICommande>(`${this.resourceUrl}/${this.getCommandeIdentifier(commande)}`, commande, { observe: 'response' });
  }

  partialUpdate(commande: PartialUpdateCommande): Observable<EntityResponseType> {
    return this.http.patch<ICommande>(`${this.resourceUrl}/${this.getCommandeIdentifier(commande)}`, commande, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICommande>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICommande[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCommandeIdentifier(commande: Pick<ICommande, 'id'>): number {
    return commande.id;
  }

  compareCommande(o1: Pick<ICommande, 'id'> | null, o2: Pick<ICommande, 'id'> | null): boolean {
    return o1 && o2 ? this.getCommandeIdentifier(o1) === this.getCommandeIdentifier(o2) : o1 === o2;
  }

  addCommandeToCollectionIfMissing<Type extends Pick<ICommande, 'id'>>(
    commandeCollection: Type[],
    ...commandesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const commandes: Type[] = commandesToCheck.filter(isPresent);
    if (commandes.length > 0) {
      const commandeCollectionIdentifiers = commandeCollection.map(commandeItem => this.getCommandeIdentifier(commandeItem)!);
      const commandesToAdd = commandes.filter(commandeItem => {
        const commandeIdentifier = this.getCommandeIdentifier(commandeItem);
        if (commandeCollectionIdentifiers.includes(commandeIdentifier)) {
          return false;
        }
        commandeCollectionIdentifiers.push(commandeIdentifier);
        return true;
      });
      return [...commandesToAdd, ...commandeCollection];
    }
    return commandeCollection;
  }
}
