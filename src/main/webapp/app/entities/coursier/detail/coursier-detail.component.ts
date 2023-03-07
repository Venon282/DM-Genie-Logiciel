import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICoursier } from '../coursier.model';

@Component({
  selector: 'jhi-coursier-detail',
  templateUrl: './coursier-detail.component.html',
})
export class CoursierDetailComponent implements OnInit {
  coursier: ICoursier | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ coursier }) => {
      this.coursier = coursier;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
