import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICoursier } from '../coursier.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../coursier.test-samples';

import { CoursierService } from './coursier.service';

const requireRestSample: ICoursier = {
  ...sampleWithRequiredData,
};

describe('Coursier Service', () => {
  let service: CoursierService;
  let httpMock: HttpTestingController;
  let expectedResult: ICoursier | ICoursier[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CoursierService);
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

    it('should create a Coursier', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const coursier = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(coursier).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Coursier', () => {
      const coursier = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(coursier).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Coursier', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Coursier', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Coursier', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCoursierToCollectionIfMissing', () => {
      it('should add a Coursier to an empty array', () => {
        const coursier: ICoursier = sampleWithRequiredData;
        expectedResult = service.addCoursierToCollectionIfMissing([], coursier);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(coursier);
      });

      it('should not add a Coursier to an array that contains it', () => {
        const coursier: ICoursier = sampleWithRequiredData;
        const coursierCollection: ICoursier[] = [
          {
            ...coursier,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCoursierToCollectionIfMissing(coursierCollection, coursier);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Coursier to an array that doesn't contain it", () => {
        const coursier: ICoursier = sampleWithRequiredData;
        const coursierCollection: ICoursier[] = [sampleWithPartialData];
        expectedResult = service.addCoursierToCollectionIfMissing(coursierCollection, coursier);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(coursier);
      });

      it('should add only unique Coursier to an array', () => {
        const coursierArray: ICoursier[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const coursierCollection: ICoursier[] = [sampleWithRequiredData];
        expectedResult = service.addCoursierToCollectionIfMissing(coursierCollection, ...coursierArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const coursier: ICoursier = sampleWithRequiredData;
        const coursier2: ICoursier = sampleWithPartialData;
        expectedResult = service.addCoursierToCollectionIfMissing([], coursier, coursier2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(coursier);
        expect(expectedResult).toContain(coursier2);
      });

      it('should accept null and undefined values', () => {
        const coursier: ICoursier = sampleWithRequiredData;
        expectedResult = service.addCoursierToCollectionIfMissing([], null, coursier, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(coursier);
      });

      it('should return initial array if no Coursier is added', () => {
        const coursierCollection: ICoursier[] = [sampleWithRequiredData];
        expectedResult = service.addCoursierToCollectionIfMissing(coursierCollection, undefined, null);
        expect(expectedResult).toEqual(coursierCollection);
      });
    });

    describe('compareCoursier', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCoursier(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCoursier(entity1, entity2);
        const compareResult2 = service.compareCoursier(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCoursier(entity1, entity2);
        const compareResult2 = service.compareCoursier(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCoursier(entity1, entity2);
        const compareResult2 = service.compareCoursier(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
