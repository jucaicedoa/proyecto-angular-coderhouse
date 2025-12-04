import { createAction, props } from '@ngrx/store';
import { Curso } from '../../core/models/curso.interface';

export const loadCourses = createAction('[Courses] Load Courses');

export const loadCoursesSuccess = createAction(
  '[Courses] Load Courses Success',
  props<{ courses: Curso[] }>()
);

export const loadCoursesFailure = createAction(
  '[Courses] Load Courses Failure',
  props<{ error: any }>()
);

export const addCourse = createAction(
  '[Courses] Add Course',
  props<{ course: Omit<Curso, 'id'> }>()
);

export const addCourseSuccess = createAction(
  '[Courses] Add Course Success',
  props<{ course: Curso }>()
);

export const updateCourse = createAction(
  '[Courses] Update Course',
  props<{ id: number; course: Partial<Curso> }>()
);

export const updateCourseSuccess = createAction(
  '[Courses] Update Course Success',
  props<{ course: Curso }>()
);

export const deleteCourse = createAction(
  '[Courses] Delete Course',
  props<{ id: number }>()
);

export const deleteCourseSuccess = createAction(
  '[Courses] Delete Course Success',
  props<{ id: number }>()
);
