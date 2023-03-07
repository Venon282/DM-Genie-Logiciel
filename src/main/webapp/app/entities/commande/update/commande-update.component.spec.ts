import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CommandeFormService } from './commande-form.service';
import { CommandeService } from '../service/commande.service';
import { ICommande } from '../commande.model';
import { ICoursier } from 'app/entities/coursier/coursier.model';
import { CoursierService } from 'app/entities/coursier/service/coursier.service';
import { IClient } from 'app/entities/client/client.model';
import { ClientService } from 'app/entities/client/service/client.service';
import { IRestaurant } from 'app/entities/restaurant/restaurant.model';
import { RestaurantService } from 'app/entities/restaurant/service/restaurant.service';
import { IProduit } from 'app/entities/produit/produit.model';
import { ProduitService } from 'app/entities/produit/service/produit.service';

import { CommandeUpdateComponent } from './commande-update.component';

describe('Commande Management Update Component', () => {
  let comp: CommandeUpdateComponent;
  let fixture: ComponentFixture<CommandeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let commandeFormService: CommandeFormService;
  let commandeService: CommandeService;
  let coursierService: CoursierService;
  let clientService: ClientService;
  let restaurantService: RestaurantService;
  let produitService: ProduitService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CommandeUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(CommandeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CommandeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    commandeFormService = TestBed.inject(CommandeFormService);
    commandeService = TestBed.inject(CommandeService);
    coursierService = TestBed.inject(CoursierService);
    clientService = TestBed.inject(ClientService);
    restaurantService = TestBed.inject(RestaurantService);
    produitService = TestBed.inject(ProduitService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call coursier query and add missing value', () => {
      const commande: ICommande = { id: 456 };
      const coursier: ICoursier = { id: 91048 };
      commande.coursier = coursier;

      const coursierCollection: ICoursier[] = [{ id: 60057 }];
      jest.spyOn(coursierService, 'query').mockReturnValue(of(new HttpResponse({ body: coursierCollection })));
      const expectedCollection: ICoursier[] = [coursier, ...coursierCollection];
      jest.spyOn(coursierService, 'addCoursierToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ commande });
      comp.ngOnInit();

      expect(coursierService.query).toHaveBeenCalled();
      expect(coursierService.addCoursierToCollectionIfMissing).toHaveBeenCalledWith(coursierCollection, coursier);
      expect(comp.coursiersCollection).toEqual(expectedCollection);
    });

    it('Should call Client query and add missing value', () => {
      const commande: ICommande = { id: 456 };
      const client: IClient = { id: 20505 };
      commande.client = client;

      const clientCollection: IClient[] = [{ id: 77784 }];
      jest.spyOn(clientService, 'query').mockReturnValue(of(new HttpResponse({ body: clientCollection })));
      const additionalClients = [client];
      const expectedCollection: IClient[] = [...additionalClients, ...clientCollection];
      jest.spyOn(clientService, 'addClientToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ commande });
      comp.ngOnInit();

      expect(clientService.query).toHaveBeenCalled();
      expect(clientService.addClientToCollectionIfMissing).toHaveBeenCalledWith(
        clientCollection,
        ...additionalClients.map(expect.objectContaining)
      );
      expect(comp.clientsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Restaurant query and add missing value', () => {
      const commande: ICommande = { id: 456 };
      const restaurant: IRestaurant = { id: 67598 };
      commande.restaurant = restaurant;

      const restaurantCollection: IRestaurant[] = [{ id: 26550 }];
      jest.spyOn(restaurantService, 'query').mockReturnValue(of(new HttpResponse({ body: restaurantCollection })));
      const additionalRestaurants = [restaurant];
      const expectedCollection: IRestaurant[] = [...additionalRestaurants, ...restaurantCollection];
      jest.spyOn(restaurantService, 'addRestaurantToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ commande });
      comp.ngOnInit();

      expect(restaurantService.query).toHaveBeenCalled();
      expect(restaurantService.addRestaurantToCollectionIfMissing).toHaveBeenCalledWith(
        restaurantCollection,
        ...additionalRestaurants.map(expect.objectContaining)
      );
      expect(comp.restaurantsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Produit query and add missing value', () => {
      const commande: ICommande = { id: 456 };
      const produits: IProduit[] = [{ id: 97161 }];
      commande.produits = produits;

      const produitCollection: IProduit[] = [{ id: 28744 }];
      jest.spyOn(produitService, 'query').mockReturnValue(of(new HttpResponse({ body: produitCollection })));
      const additionalProduits = [...produits];
      const expectedCollection: IProduit[] = [...additionalProduits, ...produitCollection];
      jest.spyOn(produitService, 'addProduitToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ commande });
      comp.ngOnInit();

      expect(produitService.query).toHaveBeenCalled();
      expect(produitService.addProduitToCollectionIfMissing).toHaveBeenCalledWith(
        produitCollection,
        ...additionalProduits.map(expect.objectContaining)
      );
      expect(comp.produitsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const commande: ICommande = { id: 456 };
      const coursier: ICoursier = { id: 46663 };
      commande.coursier = coursier;
      const client: IClient = { id: 51829 };
      commande.client = client;
      const restaurant: IRestaurant = { id: 73246 };
      commande.restaurant = restaurant;
      const produits: IProduit = { id: 94032 };
      commande.produits = [produits];

      activatedRoute.data = of({ commande });
      comp.ngOnInit();

      expect(comp.coursiersCollection).toContain(coursier);
      expect(comp.clientsSharedCollection).toContain(client);
      expect(comp.restaurantsSharedCollection).toContain(restaurant);
      expect(comp.produitsSharedCollection).toContain(produits);
      expect(comp.commande).toEqual(commande);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICommande>>();
      const commande = { id: 123 };
      jest.spyOn(commandeFormService, 'getCommande').mockReturnValue(commande);
      jest.spyOn(commandeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ commande });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: commande }));
      saveSubject.complete();

      // THEN
      expect(commandeFormService.getCommande).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(commandeService.update).toHaveBeenCalledWith(expect.objectContaining(commande));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICommande>>();
      const commande = { id: 123 };
      jest.spyOn(commandeFormService, 'getCommande').mockReturnValue({ id: null });
      jest.spyOn(commandeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ commande: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: commande }));
      saveSubject.complete();

      // THEN
      expect(commandeFormService.getCommande).toHaveBeenCalled();
      expect(commandeService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICommande>>();
      const commande = { id: 123 };
      jest.spyOn(commandeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ commande });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(commandeService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCoursier', () => {
      it('Should forward to coursierService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(coursierService, 'compareCoursier');
        comp.compareCoursier(entity, entity2);
        expect(coursierService.compareCoursier).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareClient', () => {
      it('Should forward to clientService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(clientService, 'compareClient');
        comp.compareClient(entity, entity2);
        expect(clientService.compareClient).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareRestaurant', () => {
      it('Should forward to restaurantService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(restaurantService, 'compareRestaurant');
        comp.compareRestaurant(entity, entity2);
        expect(restaurantService.compareRestaurant).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareProduit', () => {
      it('Should forward to produitService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(produitService, 'compareProduit');
        comp.compareProduit(entity, entity2);
        expect(produitService.compareProduit).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
