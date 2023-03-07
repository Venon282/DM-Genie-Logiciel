import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CommandeFormService, CommandeFormGroup } from './commande-form.service';
import { ICommande } from '../commande.model';
import { CommandeService } from '../service/commande.service';
import { ICoursier } from 'app/entities/coursier/coursier.model';
import { CoursierService } from 'app/entities/coursier/service/coursier.service';
import { IClient } from 'app/entities/client/client.model';
import { ClientService } from 'app/entities/client/service/client.service';
import { IRestaurant } from 'app/entities/restaurant/restaurant.model';
import { RestaurantService } from 'app/entities/restaurant/service/restaurant.service';
import { IProduit } from 'app/entities/produit/produit.model';
import { ProduitService } from 'app/entities/produit/service/produit.service';

@Component({
  selector: 'jhi-commande-update',
  templateUrl: './commande-update.component.html',
})
export class CommandeUpdateComponent implements OnInit {
  isSaving = false;
  commande: ICommande | null = null;

  coursiersCollection: ICoursier[] = [];
  clientsSharedCollection: IClient[] = [];
  restaurantsSharedCollection: IRestaurant[] = [];
  produitsSharedCollection: IProduit[] = [];

  editForm: CommandeFormGroup = this.commandeFormService.createCommandeFormGroup();

  constructor(
    protected commandeService: CommandeService,
    protected commandeFormService: CommandeFormService,
    protected coursierService: CoursierService,
    protected clientService: ClientService,
    protected restaurantService: RestaurantService,
    protected produitService: ProduitService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCoursier = (o1: ICoursier | null, o2: ICoursier | null): boolean => this.coursierService.compareCoursier(o1, o2);

  compareClient = (o1: IClient | null, o2: IClient | null): boolean => this.clientService.compareClient(o1, o2);

  compareRestaurant = (o1: IRestaurant | null, o2: IRestaurant | null): boolean => this.restaurantService.compareRestaurant(o1, o2);

  compareProduit = (o1: IProduit | null, o2: IProduit | null): boolean => this.produitService.compareProduit(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ commande }) => {
      this.commande = commande;
      if (commande) {
        this.updateForm(commande);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const commande = this.commandeFormService.getCommande(this.editForm);
    if (commande.id !== null) {
      this.subscribeToSaveResponse(this.commandeService.update(commande));
    } else {
      this.subscribeToSaveResponse(this.commandeService.create(commande));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICommande>>): void {
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

  protected updateForm(commande: ICommande): void {
    this.commande = commande;
    this.commandeFormService.resetForm(this.editForm, commande);

    this.coursiersCollection = this.coursierService.addCoursierToCollectionIfMissing<ICoursier>(
      this.coursiersCollection,
      commande.coursier
    );
    this.clientsSharedCollection = this.clientService.addClientToCollectionIfMissing<IClient>(
      this.clientsSharedCollection,
      commande.client
    );
    this.restaurantsSharedCollection = this.restaurantService.addRestaurantToCollectionIfMissing<IRestaurant>(
      this.restaurantsSharedCollection,
      commande.restaurant
    );
    this.produitsSharedCollection = this.produitService.addProduitToCollectionIfMissing<IProduit>(
      this.produitsSharedCollection,
      ...(commande.produits ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.coursierService
      .query({ filter: 'commandes-is-null' })
      .pipe(map((res: HttpResponse<ICoursier[]>) => res.body ?? []))
      .pipe(
        map((coursiers: ICoursier[]) =>
          this.coursierService.addCoursierToCollectionIfMissing<ICoursier>(coursiers, this.commande?.coursier)
        )
      )
      .subscribe((coursiers: ICoursier[]) => (this.coursiersCollection = coursiers));

    this.clientService
      .query()
      .pipe(map((res: HttpResponse<IClient[]>) => res.body ?? []))
      .pipe(map((clients: IClient[]) => this.clientService.addClientToCollectionIfMissing<IClient>(clients, this.commande?.client)))
      .subscribe((clients: IClient[]) => (this.clientsSharedCollection = clients));

    this.restaurantService
      .query()
      .pipe(map((res: HttpResponse<IRestaurant[]>) => res.body ?? []))
      .pipe(
        map((restaurants: IRestaurant[]) =>
          this.restaurantService.addRestaurantToCollectionIfMissing<IRestaurant>(restaurants, this.commande?.restaurant)
        )
      )
      .subscribe((restaurants: IRestaurant[]) => (this.restaurantsSharedCollection = restaurants));

    this.produitService
      .query()
      .pipe(map((res: HttpResponse<IProduit[]>) => res.body ?? []))
      .pipe(
        map((produits: IProduit[]) =>
          this.produitService.addProduitToCollectionIfMissing<IProduit>(produits, ...(this.commande?.produits ?? []))
        )
      )
      .subscribe((produits: IProduit[]) => (this.produitsSharedCollection = produits));
  }
}
