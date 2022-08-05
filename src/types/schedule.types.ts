export type ScheduleTask = {
    start: string | undefined;
    duration: number | undefined;
    id: string | undefined;
}

export type Schedule = {
    name: string;
    active: boolean;
    days: number[];
    tasks: ScheduleTask[];
}