import React, {ChangeEvent, FC} from 'react';
import {Checkbox} from '@mui/material';

type CheckBoxType = {
    callBack: (current: boolean) => void
    checked: boolean
}

export const SuperCheckBox: FC<CheckBoxType> = (props) => {
    const {callBack, checked} = props

    const onChangeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
        callBack(e.currentTarget.checked)
    }
    return (
        <Checkbox onChange={onChangeTaskStatusHandler} checked={checked} size="small"/>
    );
};
