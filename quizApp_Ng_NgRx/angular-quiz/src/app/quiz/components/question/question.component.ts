import {Component, OnDestroy, OnInit} from '@angular/core';
import {QuizService} from "../../services/quiz.service";
import {map, Observable, Subscription} from "rxjs";
import {QuestionInterface} from "../../types/question.interface";
import {AnswerType} from "../../types/answer.type";

@Component({
  selector: 'app-quiz-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit, OnDestroy {

  question$: Observable<QuestionInterface>;
  answers$: Observable<AnswerType[]>;
  correctAnswer: AnswerType = '';
  currentAnswer: AnswerType | null = null;

  subs$: Subscription = new Subscription();

  constructor(private _service: QuizService) {
    this.question$ = this._service.state$.pipe(map((state) => state.questions[state.currentQuestionIndex]))
    this.answers$ = this._service.state$.pipe(map((state) => state.answers))

  }

  ngOnInit() {
    this.subs$.add(this._service.state$.pipe(
      map((state) => state.currentAnswer))
      .subscribe(v => this.currentAnswer = v)
    )
    this.subs$.add(this.question$.pipe(
      map((question) => question.correctAnswer))
      .subscribe(v => this.correctAnswer = v)
    )
  }

  ngOnDestroy() {
    this.subs$.unsubscribe();
  }

  selectAnswer(answer: AnswerType) {
    this._service.selectAnswer(answer)
  }

  isDisabledAnswer(answer: string): boolean {
    if (!this.currentAnswer || !this.correctAnswer) {
      return false
    }
    return Boolean(this.currentAnswer)
  }

  isWrongAnswer(answer: string) {
    if (!this.currentAnswer || !this.correctAnswer) {
      return false
    }
    return this.currentAnswer === answer && this.currentAnswer !== this.correctAnswer
  }

  isCorrectAnswer(answer: string) {
    return Boolean(this.currentAnswer) && answer === this.correctAnswer
  }
}
