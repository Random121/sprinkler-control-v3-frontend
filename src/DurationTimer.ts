export type StartEndCallable = (duration: number) => void;
export type TickCallable = (duration: number, remaining: number) => void;

export class DurationTimer {
    duration: number;
    remaining: number;
    tickInterval: number;

    startCallback: StartEndCallable | undefined;
    endCallback: StartEndCallable | undefined;
    tickCallback: TickCallable | undefined;

    intervalId: number | undefined;

    constructor(duration: number, tickInterval = 1, autoStart = false) {
        this.duration = duration;
        this.remaining = duration;
        this.tickInterval = tickInterval;

        this._validate(duration, this.tickInterval);

        if (autoStart) {
            this.start();
        }
    }

    _validate(duration: number, tickInterval: number) {
        this._validateDuration(duration);
        this._validateTickInterval(duration, tickInterval);
    }

    _validateDuration(duration: number) {
        if (duration < 0) {
            throw Error("Duration must be positive");
        }
    }

    _validateTickInterval(duration: number, tickInterval: number) {
        if (tickInterval <= 0) {
            throw Error("tickInterval must be greater than 0");
        }
    }

    start() {
        if (this.intervalId) {
            throw Error("CountdownTimer already started");
        }

        // .bind(this) is called so the 'this' in the tick method
        // is DurationTimer not the browser window
        this.intervalId = setInterval(
            this.tick.bind(this),
            this.tickInterval * 1000
        );

        if (this.startCallback) {
            this.startCallback(this.duration);
        }
    }

    end() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = undefined;
        }

        if (this.endCallback) {
            this.endCallback(this.duration);
        }
    }

    tick() {
        this.remaining -= this.tickInterval;

        if (this.remaining <= 0) {
            this.remaining = 0;
            this.end();
        }

        if (this.tickCallback) {
            this.tickCallback(this.duration, this.remaining);
        }
    }

    setDuration(duration: number) {
        this._validate(duration, this.tickInterval);
        this.duration = duration;
        this.remaining = duration;
        return this;
    }

    setStartCallback(callback: StartEndCallable) {
        this.startCallback = callback;
        return this;
    }

    setEndCallback(callback: StartEndCallable) {
        this.endCallback = callback;
        return this;
    }

    setTickCallback(callback: TickCallable) {
        this.tickCallback = callback;
        return this;
    }
}
