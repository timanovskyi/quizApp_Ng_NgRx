import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, debounceTime, map, switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {Router} from '@angular/router';
import {getQuizAction, getQuizFailureAction, getQuizSuccessAction} from "../actions/quiz.actions";
import {QuizService} from "../../services/quiz.service";

@Injectable()
export class QuizEffect {

  constructor(private actions$: Actions,
              private _router: Router,
              private _service: QuizService) {
  }

  getQuiz$ = createEffect(() => this.actions$.pipe(
      ofType(getQuizAction),
      debounceTime(2000),
      switchMap(() => {
        return this._service.getData()
          .pipe(
            map(() => getQuizSuccessAction()),
            catchError((err) => {
              return of(getQuizFailureAction({error: err}))
            })
          )
      })
    )
  )
}
