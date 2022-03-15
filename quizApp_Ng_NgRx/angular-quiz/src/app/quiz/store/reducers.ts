import { Action, createReducer, on } from '@ngrx/store';
import { routerNavigationAction } from '@ngrx/router-store';
import {getQuizAction, getQuizFailureAction, getQuizSuccessAction, getSetState} from "./actions/quiz.actions";
import {QuizStateInterface} from "../types/quizState.interface";

const initialState: QuizStateInterface = {
    questions: [],
    currentQuestionIndex: 0,
    showResults: false,
    correctAnswerCount: 0,
    answers: [],
    currentAnswer: null
}

const quizReducer = createReducer(
  initialState,
  on(getQuizAction, (): QuizStateInterface =>
    ({
      ...initialState,
      isLoading: true
    })
  ),
  on(getQuizSuccessAction, (state): QuizStateInterface =>
    ({
      ...state,
      isLoading: false
    })
  ),
  on(getQuizFailureAction, (state, action): QuizStateInterface =>
    ({
      ...state,
      isLoading: false,
      error: action.error
    })
  ),
  on(getSetState, (state, action): QuizStateInterface =>
    ({
      ...state,
      ...action
    })
  ),
  on(routerNavigationAction, (): QuizStateInterface => initialState),
)

export function reducers(state: QuizStateInterface, action: Action) {
  return quizReducer(state, action)
}
