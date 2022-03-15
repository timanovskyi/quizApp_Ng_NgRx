import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizComponent } from './components/quiz/quiz.component';
import {RouterModule, Routes} from "@angular/router";
import { AnswerComponent } from './components/answer/answer.component';
import { QuestionComponent } from './components/question/question.component';
import {QuizService} from "./services/quiz.service";

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
    RouterModule.forChild(routes)
  ],
  providers: [QuizService]
})
export class QuizModule { }
