import {Injectable} from '@angular/core';
import {map, Observable} from "rxjs";
import {QuizStateInterface} from "../types/quizState.interface";
import {AnswerType} from "../types/answer.type";
import {QuestionInterface} from "../types/question.interface";
import {HttpClient} from "@angular/common/http";
import {BackendQuestionsInterface} from "../types/backendQuestions.interface";
import {select, Store} from "@ngrx/store";
import {getQuizAction, getSetState} from "../store/actions/quiz.actions";
import {tap} from "rxjs/operators";
import {quizSelector} from "../store/selectors";

@Injectable()
export class QuizService {

  readonly apiUrl = 'https://opentdb.com/api.php?amount=10&difficulty=medium&encode=url3986';

  state!: QuizStateInterface;

  constructor(private _http: HttpClient,
              private _store: Store) {
    this._store.pipe(select(quizSelector))
      .subscribe((v) => this.state = v);
  }

  nextQuestion(): void {
    const newShowResults = this.state.currentQuestionIndex === this.state.questions.length - 1
    const newCurrentQuestionIndex = newShowResults ? this.state.currentQuestionIndex : this.state.currentQuestionIndex + 1
    const newAnswers = newShowResults ? [] : this.shuffleAnswers(this.state.questions[newCurrentQuestionIndex])
    this._store.dispatch(getSetState({
      currentQuestionIndex: newCurrentQuestionIndex,
      showResults: newShowResults,
      answers: newAnswers,
      currentAnswer: null
    }))
  }

  restart() {
    this._store.dispatch(getQuizAction())
  }

  selectAnswer(answer: AnswerType) {
    const newCorrectAnswerCount =
      answer === this.state.questions[this.state.currentQuestionIndex].correctAnswer
        ? this.state.correctAnswerCount + 1
        : this.state.correctAnswerCount
    this._store.dispatch(getSetState({
      currentAnswer: answer,
      correctAnswerCount: newCorrectAnswerCount
    }))
  }

  getData(): Observable<BackendQuestionsInterface[]> {
    return this._http.get<{ results: BackendQuestionsInterface[] }>(this.apiUrl)
      .pipe(map(r => r.results),
        tap((v => this.loadQuestions(v))))
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
    this._store.dispatch(getSetState({
      questions: normalize,
      answers: initialAnswers
    }))
  }
}
