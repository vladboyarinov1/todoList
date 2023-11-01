import React, { ChangeEvent, FC } from "react";
import { Checkbox } from "@mui/material";

import { TaskStatuses } from "common/enums/enums";

type Props = {
    callBack: (current: TaskStatuses) => void;
    checked: boolean;
};

export const SuperCheckBox: FC<Props> = (props) => {
    const { callBack, checked } = props;

    const onChangeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
        callBack(e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New);
    };
    return <Checkbox onChange={onChangeTaskStatusHandler} checked={checked} size="small" />;
};
