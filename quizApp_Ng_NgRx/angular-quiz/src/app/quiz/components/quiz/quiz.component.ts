import { Component, OnInit } from '@angular/core';
import {QuizService} from "../../services/quiz.service";
import {map, Observable} from "rxjs";

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {

  questionsLength$: Observable<number>;
  currentQuestionIndex$: Observable<number>;
  showResults$: Observable<boolean>;
  correctAnswerCount$: Observable<number>;

  constructor(private _service: QuizService) {
   this.questionsLength$ = this._service.state$.pipe(map((state) => state.questions.length))
   this.currentQuestionIndex$ = this._service.state$.pipe(map((state) => state.currentQuestionIndex + 1))
   this.showResults$ = this._service.state$.pipe(map((state) => state.showResults))
   this.correctAnswerCount$ = this._service.state$.pipe(map((state) => state.correctAnswerCount))
  }

  ngOnInit(): void {
  }

  nextQuestion() {
    this._service.nextQuestion()
  }

  restart() {
    this._service.restart()
  }
}
