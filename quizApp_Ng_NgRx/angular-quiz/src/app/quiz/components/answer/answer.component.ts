import {Component, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {AnswerType} from "../../types/answer.type";

@Component({
  selector: 'app-quiz-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.scss']
})
export class AnswerComponent {

  @Input() answerText!: AnswerType
  @Input() index!: number

  @Output() selectAnswer = new EventEmitter<AnswerType>();

  @HostListener('click', ['$event'])
  onClick() {
    this.selectAnswer.emit(this.answerText)
  }

  letterMapping: string[] = ['A', 'B', 'C', 'D']

  constructor() {
  }

}
