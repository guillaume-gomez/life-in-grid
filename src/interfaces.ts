export interface Period {
  name: string;
  color: string;
  start: Date;
  end: Date;
}

export interface PeriodFormInterface {
  start: string;
  end: string;
  timeSlotId: string;
  edit: boolean;
}

export interface TimeSlotFormInterface {
  id: string;
  color: string;
  name: string;
  edit: boolean;
}

