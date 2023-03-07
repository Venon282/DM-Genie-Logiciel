import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { CoursierFormService, CoursierFormGroup } from './coursier-form.service';
import { ICoursier } from '../coursier.model';
import { CoursierService } from '../service/coursier.service';

@Component({
  selector: 'jhi-coursier-update',
  templateUrl: './coursier-update.component.html',
})
export class CoursierUpdateComponent implements OnInit {
  isSaving = false;
  coursier: ICoursier | null = null;

  editForm: CoursierFormGroup = this.coursierFormService.createCoursierFormGroup();

  constructor(
    protected coursierService: CoursierService,
    protected coursierFormService: CoursierFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ coursier }) => {
      this.coursier = coursier;
      if (coursier) {
        this.updateForm(coursier);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const coursier = this.coursierFormService.getCoursier(this.editForm);
    if (coursier.id !== null) {
      this.subscribeToSaveResponse(this.coursierService.update(coursier));
    } else {
      this.subscribeToSaveResponse(this.coursierService.create(coursier));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICoursier>>): void {
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

  protected updateForm(coursier: ICoursier): void {
    this.coursier = coursier;
    this.coursierFormService.resetForm(this.editForm, coursier);
  }
}
