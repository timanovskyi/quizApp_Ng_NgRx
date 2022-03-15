import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizComponent } from './components/quiz/quiz.component';
import {RouterModule, Routes} from "@angular/router";
import { AnswerComponent } from './components/answer/answer.component';
import { QuestionComponent } from './components/question/question.component';
import {QuizService} from "./services/quiz.service";
import {QuizEffect} from "./store/effects/quiz.effect";
import {EffectsModule} from "@ngrx/effects";
import {StoreModule} from "@ngrx/store";
import {reducers} from "./store/reducers";

const routes: Routes = [
  {
    path: '',
    component: QuizComponent
  }
]

@NgModule({
  declarations: [
    QuizComponent,
    AnswerComponent,
    QuestionComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    EffectsModule.forFeature(
      [
        QuizEffect
      ]
    ),
    StoreModule.forFeature(
      'quiz', reducers
    ),
  ],
  providers: [QuizService]
})
export class QuizModule { }
