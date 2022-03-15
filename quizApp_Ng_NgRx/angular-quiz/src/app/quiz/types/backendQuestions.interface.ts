import {AnswerType} from "./answer.type";

export interface BackendQuestionsInterface {
  question: string,
  incorrect_answers: AnswerType[],
  correct_answer: AnswerType;
}
