export type RelayState = {
    is_active: boolean;
    duration: number | null;
    time_remaining: number | null;
    time_elapsed: number | null;
}

export type RelayInformation = {
    id: string;
    pin: number;
    name: string;
    state: RelayState;
}