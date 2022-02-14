export class EventViewModel {
  public id: number;
  public code: string;
  public title: string;
  public startDate: Date;
  public endDate: Date;
  public platforms: string[];
  public description: string;
  public enabled: boolean;
}

export class CsmsEvent {
  public id: number;
  public code: string;
  public startTime: Date | string = new Date(Date.now());
  public endTime: Date | string = null;
  public startTimeInDate: string = null;
  public endTimeInDate: string = null;
  public title: string;
  public description: string;
  public eventTypeId: number;
  public discountPercent = 0;
  public maxDiscount: number;
  public minTotalInvoice: number;
  public accountLimit: number;
  public quantityLimit: number;
  public appliedAllProducts = true;
  public enabled = true;
  public productIds: number[] = [];
  public categoryIds: number[] = [];
  public deviceIds: number[] = [];

  public set setStartDate(dateInput: string) {
    const date = new Date(dateInput);

    if (dateInput && dateInput !== 'Invalid date') {
      if (!this.startTime) {
        this.startTime = new Date();
        this.startTime.setHours(0);
        this.startTime.setMinutes(0);
      }
      this.startTime = new Date(this.startTime);
      this.startTime.setSeconds(0);
      this.startTime.setDate(date.getDate());
      this.startTime.setMonth(date.getMonth());
      this.startTime.setFullYear(date.getFullYear());
    } else {
      this.startTime = null;
    }
  }

  public set setStartTime(timeString: string) {
    if (timeString && this.startTime) {
      const hour = timeString.split(':')[0];
      const minute = timeString.split(':')[1];
      this.startTime = new Date(this.startTime);
      this.startTime.setHours(+hour);
      this.startTime.setMinutes(+minute);
    }
  }

  public set setEndDate(dateInput: string) {
    const date = new Date(dateInput);

    if (dateInput && dateInput !== 'Invalid date') {
      if (!this.endTime) {
        this.endTime = new Date();
        this.endTime.setHours(23);
        this.endTime.setMinutes(59);
        this.endTime.setSeconds(59);
      }
      this.endTime = new Date(this.endTime);
      this.endTime.setDate(date.getDate());
      this.endTime.setMonth(date.getMonth());
      this.endTime.setFullYear(date.getFullYear());
    } else {
      this.endTime = null;
    }
  }

  public set setEndTime(timeString: string) {
    if (timeString && this.endTime) {
      this.endTime = new Date(this.endTime);
      const hour = timeString.split(':')[0];
      const minute = timeString.split(':')[1];
      this.endTime.setHours(+hour);
      this.endTime.setMinutes(+minute);
    }
  }
}

export class CsmsDevice {
  public id: number;
  public code: string;
  public title: string;
}

export class CsmsEventType {
  public id: number;
  public code: string;
  public title: string;
}