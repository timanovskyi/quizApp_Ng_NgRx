import { Component, OnInit } from '@angular/core';
import {QuizService} from "../../services/quiz.service";
import {Observable} from "rxjs";
import {getQuizAction} from "../../store/actions/quiz.actions";
import {select, Store} from "@ngrx/store";
import {isLoadingSelector, quizSelector} from "../../store/selectors";
import {QuizStateInterface} from "../../types/quizState.interface";

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {

  quiz$: Observable<QuizStateInterface>;
  isLoadingSelector$: Observable<boolean | undefined>;

  constructor(private _service: QuizService,
              private _store: Store) {
   this.quiz$ = this._store.pipe(select(quizSelector))
   this.isLoadingSelector$ = this._store.pipe(select(isLoadingSelector))
  }

  ngOnInit(): void {
    this._store.dispatch(getQuizAction())
  }

  nextQuestion() {
    this._service.nextQuestion()
  }

  restart() {
    this._service.restart()
  }
}
