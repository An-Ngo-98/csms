import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html'
})
export class CheckboxComponent {

  // Decorators
  @Input() checked = false;
  @Input() disabled = false;
  @Input() text = '';
  @Input() textAfter = true;
  @Input() public size = 'lg';
  @Input() public sizeText = 'sm';
  @Input() public customClass = '';
  @Output() checkedCallback: EventEmitter<boolean> = new EventEmitter();

  onClick(): void {
    if (!this.disabled) {
      this.checked = !this.checked;
      this.checkedCallback.emit(this.checked);
    }
  }
}
