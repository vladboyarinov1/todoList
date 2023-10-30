export enum TaskStatuses {
    New,
    InProgress,
    Completed,
    Draft,
}

export enum TaskEntityStatus {
    Prepared,
    Expectation,
}

export enum TaskPriorities {
    Low,
    Middle,
    Hi,
    Urgently,
    Later,
}

export enum ResultCode {
    OK = 0,
    ERROR = 1,
    CAPTCHA = 10,
}
