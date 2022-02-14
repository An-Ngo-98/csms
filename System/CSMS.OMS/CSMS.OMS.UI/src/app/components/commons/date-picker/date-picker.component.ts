import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { DateFormat } from '../../../commons/consts/date-format.const';
import { MomentHelper } from '../../../commons/helpers/moment.helper';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html'
})
export class DatePickerComponent implements OnInit {

  // Decorators
  @Input() public minDate: moment.Moment | Date | string = null;
  @Input() public maxDate: moment.Moment | Date | string = null;
  @Input() public setDate: moment.Moment | Date | string = null;
  @Input() public format: string = DateFormat.DateFormatJson;
  @Input() public disabled = false;
  @Input() public placeholder = 'yyyy-mm-dd';
  @Input() public required = false;

  @Output() public selectedDateEmit: EventEmitter<any> = new EventEmitter();

  public selectedDate: NgbDate;
  public dataValid = true;

  constructor(
    private calendar: NgbCalendar,
    private formatter: NgbDateParserFormatter) { }

  ngOnInit() {
    this.selectedDate = this.setDate ?
      NgbDate.from(this.formatter.parse(MomentHelper.parseDateToString(this.setDate, null, DateFormat.DateFormatJson))) : null;
    this.selectedDate = this.required && !this.selectedDate ? this.calendar.getToday() : this.selectedDate;
    this.handleChangeInput();

    this.minDate = this.minDate ? moment(this.minDate) : moment('01/01/1950', 'MM/DD/YYYY');
    this.maxDate = this.maxDate ? moment(this.maxDate) : null;
  }

  public handleChangeInput(): void {
    if (!this.required && !this.selectedDate) {
      this.selectedDateEmit.emit(null);
      return;
    }

    if (!this.validateInput(this.selectedDate)) {
      this.dataValid = false;
      this.selectedDateEmit.emit(null);
      return;
    } else {
      this.dataValid = true;
      const date: Date = new Date(this.selectedDate.year, this.selectedDate.month - 1, this.selectedDate.day);
      const outputDate: string = MomentHelper.formatDate(date, this.format);
      this.selectedDateEmit.emit(outputDate);
    }
  }

  private validateInput(dateInput: NgbDate): boolean {
    if (!this.calendar.isValid(dateInput)) {
      return false;
    }

    const date: Date = new Date(this.selectedDate.year, this.selectedDate.month - 1, this.selectedDate.day);
    if (this.minDate && this.minDate > date) {
      return false;
    }
    if (this.maxDate && this.maxDate < date) {
      return false;
    }

    return true;
  }

  public praseDateToNgbDate(inputDate: moment.Moment | Date | string = null): NgbDate {
    return inputDate ?
      NgbDate.from(this.formatter.parse(MomentHelper.parseDateToString(inputDate, null, DateFormat.DateFormatJson))) : null
  }
}
