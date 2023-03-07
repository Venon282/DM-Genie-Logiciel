import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IRestaurant } from '../restaurant.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../restaurant.test-samples';

import { RestaurantService } from './restaurant.service';

const requireRestSample: IRestaurant = {
  ...sampleWithRequiredData,
};

describe('Restaurant Service', () => {
  let service: RestaurantService;
  let httpMock: HttpTestingController;
  let expectedResult: IRestaurant | IRestaurant[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(RestaurantService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Restaurant', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const restaurant = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(restaurant).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Restaurant', () => {
      const restaurant = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(restaurant).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Restaurant', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Restaurant', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Restaurant', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addRestaurantToCollectionIfMissing', () => {
      it('should add a Restaurant to an empty array', () => {
        const restaurant: IRestaurant = sampleWithRequiredData;
        expectedResult = service.addRestaurantToCollectionIfMissing([], restaurant);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(restaurant);
      });

      it('should not add a Restaurant to an array that contains it', () => {
        const restaurant: IRestaurant = sampleWithRequiredData;
        const restaurantCollection: IRestaurant[] = [
          {
            ...restaurant,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addRestaurantToCollectionIfMissing(restaurantCollection, restaurant);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Restaurant to an array that doesn't contain it", () => {
        const restaurant: IRestaurant = sampleWithRequiredData;
        const restaurantCollection: IRestaurant[] = [sampleWithPartialData];
        expectedResult = service.addRestaurantToCollectionIfMissing(restaurantCollection, restaurant);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(restaurant);
      });

      it('should add only unique Restaurant to an array', () => {
        const restaurantArray: IRestaurant[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const restaurantCollection: IRestaurant[] = [sampleWithRequiredData];
        expectedResult = service.addRestaurantToCollectionIfMissing(restaurantCollection, ...restaurantArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const restaurant: IRestaurant = sampleWithRequiredData;
        const restaurant2: IRestaurant = sampleWithPartialData;
        expectedResult = service.addRestaurantToCollectionIfMissing([], restaurant, restaurant2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(restaurant);
        expect(expectedResult).toContain(restaurant2);
      });

      it('should accept null and undefined values', () => {
        const restaurant: IRestaurant = sampleWithRequiredData;
        expectedResult = service.addRestaurantToCollectionIfMissing([], null, restaurant, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(restaurant);
      });

      it('should return initial array if no Restaurant is added', () => {
        const restaurantCollection: IRestaurant[] = [sampleWithRequiredData];
        expectedResult = service.addRestaurantToCollectionIfMissing(restaurantCollection, undefined, null);
        expect(expectedResult).toEqual(restaurantCollection);
      });
    });

    describe('compareRestaurant', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareRestaurant(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareRestaurant(entity1, entity2);
        const compareResult2 = service.compareRestaurant(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareRestaurant(entity1, entity2);
        const compareResult2 = service.compareRestaurant(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareRestaurant(entity1, entity2);
        const compareResult2 = service.compareRestaurant(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
