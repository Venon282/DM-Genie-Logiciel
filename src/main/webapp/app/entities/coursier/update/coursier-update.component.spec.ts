import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CoursierFormService } from './coursier-form.service';
import { CoursierService } from '../service/coursier.service';
import { ICoursier } from '../coursier.model';

import { CoursierUpdateComponent } from './coursier-update.component';

describe('Coursier Management Update Component', () => {
  let comp: CoursierUpdateComponent;
  let fixture: ComponentFixture<CoursierUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let coursierFormService: CoursierFormService;
  let coursierService: CoursierService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CoursierUpdateComponent],
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
      .overrideTemplate(CoursierUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CoursierUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    coursierFormService = TestBed.inject(CoursierFormService);
    coursierService = TestBed.inject(CoursierService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const coursier: ICoursier = { id: 456 };

      activatedRoute.data = of({ coursier });
      comp.ngOnInit();

      expect(comp.coursier).toEqual(coursier);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICoursier>>();
      const coursier = { id: 123 };
      jest.spyOn(coursierFormService, 'getCoursier').mockReturnValue(coursier);
      jest.spyOn(coursierService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ coursier });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: coursier }));
      saveSubject.complete();

      // THEN
      expect(coursierFormService.getCoursier).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(coursierService.update).toHaveBeenCalledWith(expect.objectContaining(coursier));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICoursier>>();
      const coursier = { id: 123 };
      jest.spyOn(coursierFormService, 'getCoursier').mockReturnValue({ id: null });
      jest.spyOn(coursierService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ coursier: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: coursier }));
      saveSubject.complete();

      // THEN
      expect(coursierFormService.getCoursier).toHaveBeenCalled();
      expect(coursierService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICoursier>>();
      const coursier = { id: 123 };
      jest.spyOn(coursierService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ coursier });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(coursierService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
