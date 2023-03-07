import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CoursierDetailComponent } from './coursier-detail.component';

describe('Coursier Management Detail Component', () => {
  let comp: CoursierDetailComponent;
  let fixture: ComponentFixture<CoursierDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoursierDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ coursier: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CoursierDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CoursierDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load coursier on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.coursier).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
