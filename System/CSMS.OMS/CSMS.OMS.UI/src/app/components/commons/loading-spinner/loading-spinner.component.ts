import { Component, OnInit, Input } from '@angular/core';
import { SpinnerType, SpinnerColor, SpinnerAlign } from '../../../commons/consts/spinner.const';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html'
})
export class LoadingSpinnerComponent implements OnInit {

  @Input() public type = SpinnerType.BorderMedium;
  @Input() public color = SpinnerColor.Black;
  @Input() public align = SpinnerAlign.Center;

  constructor() { }

  ngOnInit() {
  }

}
