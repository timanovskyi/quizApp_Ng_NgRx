import {Injectable} from '@angular/core';
import {BehaviorSubject, map} from "rxjs";
import {QuizStateInterface} from "../types/quizState.interface";
import {AnswerType} from "../types/answer.type";
import {QuestionInterface} from "../types/question.interface";
import {HttpClient} from "@angular/common/http";
import {BackendQuestionsInterface} from "../types/backendQuestions.interface";

@Injectable()
export class QuizService {

 readonly apiUrl = 'https://opentdb.com/api.php?amount=10&difficulty=medium&encode=url3986';

  initialState: QuizStateInterface = {
    questions: [],
    currentQuestionIndex: 0,
    showResults: false,
    correctAnswerCount: 0,
    answers: [],
    currentAnswer: null
  }
  state$ = new BehaviorSubject<QuizStateInterface>({...this.initialState})

  constructor(private _http: HttpClient) {
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
    this.getData()
  }

  selectAnswer(answer: AnswerType) {
    const newCorrectAnswerCount =
      answer === this.getState().questions[this.getState().currentQuestionIndex].correctAnswer
        ? this.getState().correctAnswerCount + 1
        : this.getState().correctAnswerCount
    this.setState({currentAnswer: answer, correctAnswerCount: newCorrectAnswerCount})
  }

  getData(): void {
    this._http.get<{results: BackendQuestionsInterface[]}>(this.apiUrl)
      .pipe(map(r => r.results))
      .subscribe(v => this.loadQuestions(v))
  }

  private _normalizeQuestions(data: BackendQuestionsInterface[]): QuestionInterface[] {
    return data.map(q => ({
      question: decodeURIComponent(q.question),
      correctAnswer: decodeURIComponent(q.correct_answer),
      incorrectAnswers: q.incorrect_answers.map(v => decodeURIComponent((v)))
    }))
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

  loadQuestions(q: BackendQuestionsInterface[]) {
    const normalize = this._normalizeQuestions(q);
    const initialAnswers = this.shuffleAnswers(normalize[0])
    this.setState({
      questions: normalize,
      answers: initialAnswers
    })
  }
}
