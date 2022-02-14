import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { DateFormat } from '../../../commons/consts/date-format.const';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html'
})
export class TimePickerComponent implements OnInit, OnChanges {

  // Decorators
  @Input() public setTime: string = null;
  @Input() public meridian = false;
  @Input() public format: string = DateFormat.TimeFormatHHMMSS;
  @Input() public disabled = false;
  @Input() public placeholder = 'HH:MM';
  @Input() public required = false;
  @Input() public showClearButton = false;
  @Input() public defaultTime: NgbTimeStruct = { hour: 0, minute: 0, second: 0 };

  @Output() public selectedTimeEmit: EventEmitter<any> = new EventEmitter();

  public selectedTime: NgbTimeStruct;
  public dataValid = true;

  constructor() { }

  ngOnInit() {
    this.selectedTime = this.praseStringToNgbTimeStruct(this.setTime);
    this.selectedTime = this.required && !this.selectedTime ? this.defaultTime : this.selectedTime;
    this.handleChangeInput();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.setTime.previousValue !== changes.setTime.currentValue) {
      this.selectedTime = this.praseStringToNgbTimeStruct(this.setTime);
      this.selectedTime = this.required && !this.selectedTime ? this.defaultTime : this.selectedTime;
      this.handleChangeInput();
    }
  }

  public handleChangeInput(): void {
    if (!this.required && !this.selectedTime) {
      this.selectedTimeEmit.emit(null);
      return;
    }

    if (!this.isValidTime(this.selectedTime)) {
      this.dataValid = false;
      this.selectedTimeEmit.emit(null);
    } else {
      this.dataValid = true;
      this.selectedTimeEmit.emit(this.praseTimeToString(this.selectedTime));
    }
  }

  public onClear(): void {
    this.selectedTime = null;
    this.handleChangeInput();
  }

  private isValidTime(inputTime: NgbTimeStruct): boolean {
    if (inputTime.hour < 0
      || inputTime.hour > 23
      || inputTime.minute < 0
      || inputTime.minute > 59
      || inputTime.second < 0
      || inputTime.second > 59) {
      return false;
    }

    return true;
  }

  public praseStringToNgbTimeStruct(inputTime: string = null): NgbTimeStruct {
    if (inputTime) {
      const hours = +inputTime.split(':')[0];
      const mins = +inputTime.split(':')[1];
      const secs = +inputTime.split(':')[2];

      return { hour: hours, minute: mins, second: secs };
    }

    return null;
  }

  public formatTime(inputTime: NgbTimeStruct): string {
    if (inputTime) {
      const hours = inputTime.hour < 10 ? '0' + inputTime.hour : inputTime.hour;
      const mins = inputTime.minute < 10 ? '0' + inputTime.minute : inputTime.minute;

      return hours + ' : ' + mins;
    }

    return null;
  }

  private praseTimeToString(inputTime: NgbTimeStruct): string {
    if (inputTime) {
      const hours = inputTime.hour < 10 ? '0' + inputTime.hour : inputTime.hour;
      const mins = inputTime.minute < 10 ? '0' + inputTime.minute : inputTime.minute;
      const secs = inputTime.second < 10 ? '0' + inputTime.second : inputTime.second;

      return hours + ':' + mins + ':' + secs;
    }

    return 'N/A';
  }
}
