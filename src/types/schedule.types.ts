export type EditableScheduleTask = {
    start: string | undefined;
    duration: number | undefined;
    id: string | undefined;
}

export type EditableSchedule = {
    name: string;
    active: boolean;
    days: number[];
    tasks: ScheduleTask[];
}

export type ScheduleTask = {
    start: string;
    duration: number;
    id: string;
}

export type Schedule = {
    _id: string;
    name: string;
    active: boolean;
    days: number[];
    tasks: ScheduleTask[];
}