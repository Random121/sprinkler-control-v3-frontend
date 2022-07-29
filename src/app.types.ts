export interface IRelayState {
    is_active: boolean;
    duration: number | null;
    time_remaining: number | null;
    time_elapsed: number | null;
}

export interface IRelayInfo {
    id: string;
    pin: number;
    name: string;
    state: IRelayState;
}
