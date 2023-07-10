import type { EditableSchedule } from "@/types/schedule.types";

export class ScheduleApiClient {
    endpoint: string;

    constructor(endpoint: string) {
        this.endpoint = endpoint;
    }

    addSchedule(schedule: EditableSchedule) {
        return fetch(`${this.endpoint}/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(schedule),
        });
    }

    updateSchedule(id: string, newSchedule: EditableSchedule) {
        return fetch(`${this.endpoint}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newSchedule),
        });
    }

    deleteSchedule(id: string) {
        return fetch(`${this.endpoint}/${id}`, {
            method: "DELETE",
        });
    }

    setScheduleActiveState(id: string, state: boolean) {
        return fetch(`${this.endpoint}/active/${id}`, {
            method: state ? "PUT" : "DELETE",
        });
    }

    getSchedules(onlyActive = false) {
        const url = onlyActive
            ? `${this.endpoint}/active/`
            : `${this.endpoint}/`;

        return fetch(url);
    }
}
