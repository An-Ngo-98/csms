import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html'
})
export class RadioComponent {

  // Decorators
  @Input() checked = false;
  @Input() disabled = false;
  @Input() text: any = '';
  @Input() value: any = '';
  @Input() position = 'right';
  @Output() callback: EventEmitter<any> = new EventEmitter();

  onClick(): void {
    if (!this.disabled) {
      if (this.checked === false) {
        this.checked = true;
        this.callback.emit(this.value);
      }
    }
  }
}
