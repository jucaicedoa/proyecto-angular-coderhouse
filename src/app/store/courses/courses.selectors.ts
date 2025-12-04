import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CoursesState } from './courses.reducer';

export const selectCoursesState = createFeatureSelector<CoursesState>('courses');

export const selectCourses = createSelector(
  selectCoursesState,
  (state) => state.courses
);

export const selectCoursesLoading = createSelector(
  selectCoursesState,
  (state) => state.isLoading
);

export const selectCoursesError = createSelector(
  selectCoursesState,
  (state) => state.error
);
