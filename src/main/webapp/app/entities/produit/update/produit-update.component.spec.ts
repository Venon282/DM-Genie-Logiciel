import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ProduitFormService } from './produit-form.service';
import { ProduitService } from '../service/produit.service';
import { IProduit } from '../produit.model';
import { IRestaurant } from 'app/entities/restaurant/restaurant.model';
import { RestaurantService } from 'app/entities/restaurant/service/restaurant.service';

import { ProduitUpdateComponent } from './produit-update.component';

describe('Produit Management Update Component', () => {
  let comp: ProduitUpdateComponent;
  let fixture: ComponentFixture<ProduitUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let produitFormService: ProduitFormService;
  let produitService: ProduitService;
  let restaurantService: RestaurantService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ProduitUpdateComponent],
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
      .overrideTemplate(ProduitUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProduitUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    produitFormService = TestBed.inject(ProduitFormService);
    produitService = TestBed.inject(ProduitService);
    restaurantService = TestBed.inject(RestaurantService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Restaurant query and add missing value', () => {
      const produit: IProduit = { id: 456 };
      const restaurant: IRestaurant = { id: 33304 };
      produit.restaurant = restaurant;

      const restaurantCollection: IRestaurant[] = [{ id: 77944 }];
      jest.spyOn(restaurantService, 'query').mockReturnValue(of(new HttpResponse({ body: restaurantCollection })));
      const additionalRestaurants = [restaurant];
      const expectedCollection: IRestaurant[] = [...additionalRestaurants, ...restaurantCollection];
      jest.spyOn(restaurantService, 'addRestaurantToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ produit });
      comp.ngOnInit();

      expect(restaurantService.query).toHaveBeenCalled();
      expect(restaurantService.addRestaurantToCollectionIfMissing).toHaveBeenCalledWith(
        restaurantCollection,
        ...additionalRestaurants.map(expect.objectContaining)
      );
      expect(comp.restaurantsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const produit: IProduit = { id: 456 };
      const restaurant: IRestaurant = { id: 34073 };
      produit.restaurant = restaurant;

      activatedRoute.data = of({ produit });
      comp.ngOnInit();

      expect(comp.restaurantsSharedCollection).toContain(restaurant);
      expect(comp.produit).toEqual(produit);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProduit>>();
      const produit = { id: 123 };
      jest.spyOn(produitFormService, 'getProduit').mockReturnValue(produit);
      jest.spyOn(produitService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ produit });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: produit }));
      saveSubject.complete();

      // THEN
      expect(produitFormService.getProduit).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(produitService.update).toHaveBeenCalledWith(expect.objectContaining(produit));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProduit>>();
      const produit = { id: 123 };
      jest.spyOn(produitFormService, 'getProduit').mockReturnValue({ id: null });
      jest.spyOn(produitService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ produit: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: produit }));
      saveSubject.complete();

      // THEN
      expect(produitFormService.getProduit).toHaveBeenCalled();
      expect(produitService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProduit>>();
      const produit = { id: 123 };
      jest.spyOn(produitService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ produit });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(produitService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareRestaurant', () => {
      it('Should forward to restaurantService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(restaurantService, 'compareRestaurant');
        comp.compareRestaurant(entity, entity2);
        expect(restaurantService.compareRestaurant).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
