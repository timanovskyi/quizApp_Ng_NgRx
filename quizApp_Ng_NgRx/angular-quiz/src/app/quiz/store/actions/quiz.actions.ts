import {createAction, props} from "@ngrx/store";
import {ActionTypes} from "../actionTypes";
import {QuestionInterface} from "../../types/question.interface";
import {AnswerType} from "../../types/answer.type";

export const getQuizAction = createAction(
  ActionTypes.GET_QUIZ,
)

export const getQuizSuccessAction = createAction(
  ActionTypes.GET_QUIZ_SUCCESS
)
export const getQuizFailureAction = createAction(
  ActionTypes.GET_QUIZ_FAILURE,
  props<{error: any}>()
)

export const getSetState = createAction(
  ActionTypes.SET_STATE,
  props<{
    questions?: QuestionInterface[];
    currentQuestionIndex?: number;
    showResults?: boolean;
    correctAnswerCount?: number;
    answers?: AnswerType[];
    currentAnswer?: AnswerType | null;
  }>()
)
