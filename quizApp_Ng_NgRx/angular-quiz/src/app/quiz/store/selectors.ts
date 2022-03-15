import { createFeatureSelector, createSelector } from '@ngrx/store';
import {QuizStateInterface} from "../types/quizState.interface";

export const quizFeatureSelector = createFeatureSelector<QuizStateInterface>('quiz')

export const quizSelector = createSelector(quizFeatureSelector, (state: QuizStateInterface) => state)
export const isLoadingSelector = createSelector(quizFeatureSelector, (state: QuizStateInterface) => state.isLoading)
export const errorsSelector = createSelector(quizFeatureSelector, (state: QuizStateInterface) => state.error)
