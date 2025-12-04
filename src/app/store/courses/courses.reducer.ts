import { createReducer, on } from '@ngrx/store';
import { Curso } from '../../core/models/curso.interface';
import { CURSOS_MOCK } from '../../core/data/mock-data';
import * as CoursesActions from './courses.actions';

export interface CoursesState {
  courses: Curso[];
  isLoading: boolean;
  error: any;
}

export const initialState: CoursesState = {
  courses: CURSOS_MOCK,
  isLoading: false,
  error: null
};

export const coursesReducer = createReducer(
  initialState,
  on(CoursesActions.loadCourses, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(CoursesActions.loadCoursesSuccess, (state, { courses }) => ({
    ...state,
    courses,
    isLoading: false,
    error: null
  })),
  on(CoursesActions.loadCoursesFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  on(CoursesActions.addCourseSuccess, (state, { course }) => ({
    ...state,
    courses: [...state.courses, course]
  })),
  on(CoursesActions.updateCourseSuccess, (state, { course }) => ({
    ...state,
    courses: state.courses.map(c => c.id === course.id ? course : c)
  })),
  on(CoursesActions.deleteCourseSuccess, (state, { id }) => ({
    ...state,
    courses: state.courses.filter(c => c.id !== id)
  }))
);
