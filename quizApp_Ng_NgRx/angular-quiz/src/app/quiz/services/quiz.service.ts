import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {QuizStateInterface} from "../types/quizState.interface";
import mockData from '../data'
import {AnswerType} from "../types/answer.type";
import {QuestionInterface} from "../types/question.interface";

@Injectable()
export class QuizService {

  initialState: QuizStateInterface = {
    questions: mockData,
    currentQuestionIndex: 0,
    showResults: false,
    correctAnswerCount: 0,
    answers: this.shuffleAnswers(mockData[0]),
    currentAnswer: null
  }
  state$ = new BehaviorSubject<QuizStateInterface>({...this.initialState})

  constructor() {
  }

  setState(partialState: Partial<QuizStateInterface>): void {
    this.state$.next({...this.state$.getValue(), ...partialState})
  }

  getState(): QuizStateInterface {
    return this.state$.getValue()
  }

  nextQuestion(): void {
    const newShowResults = this.getState().currentQuestionIndex === this.getState().questions.length - 1
    const newCurrentQuestionIndex = newShowResults ? this.getState().currentQuestionIndex : this.getState().currentQuestionIndex + 1
    const newAnswers = newShowResults ? [] : this.shuffleAnswers(this.getState().questions[newCurrentQuestionIndex])
    this.setState({
      currentQuestionIndex: newCurrentQuestionIndex,
      showResults: newShowResults,
      answers: newAnswers,
      currentAnswer: null
    })
  }

  restart() {
    this.setState(this.initialState)
  }

  selectAnswer(answer: AnswerType) {
    const newCorrectAnswerCount =
      answer === this.getState().questions[this.getState().currentQuestionIndex].correctAnswer
        ? this.getState().correctAnswerCount + 1
        : this.getState().correctAnswerCount
    this.setState({currentAnswer: answer, correctAnswerCount: newCorrectAnswerCount})
  }

  private shuffleAnswers(mockDatum: QuestionInterface): AnswerType[] {
    const unshuffledAnswer = [
      ...mockDatum.incorrectAnswers,
      mockDatum.correctAnswer
    ]
    return unshuffledAnswer
      .map(a => ({sort: Math.random(), value: a}))
      .sort((a, b) => a.sort - b.sort).map(el => el.value)
  }
}
