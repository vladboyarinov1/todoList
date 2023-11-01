import React, { ChangeEvent } from "react";
import { Checkbox } from "@mui/material";

import { TaskStatuses } from "common/enums/enums";

type Props = {
    callBack: (current: TaskStatuses) => void;
    checked: boolean;
};

export const SuperCheckBox = ({ callBack, checked }: Props) => {
    const onChangeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
        callBack(e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New);
    };
    return <Checkbox onChange={onChangeTaskStatusHandler} checked={checked} size="small" />;
};
