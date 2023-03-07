import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CoursierService } from '../service/coursier.service';

import { CoursierComponent } from './coursier.component';

describe('Coursier Management Component', () => {
  let comp: CoursierComponent;
  let fixture: ComponentFixture<CoursierComponent>;
  let service: CoursierService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'coursier', component: CoursierComponent }]), HttpClientTestingModule],
      declarations: [CoursierComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(CoursierComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CoursierComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CoursierService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.coursiers?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to coursierService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getCoursierIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getCoursierIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
