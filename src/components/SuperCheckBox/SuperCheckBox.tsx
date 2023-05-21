import React, {ChangeEvent, FC} from 'react';
import {Checkbox} from '@mui/material';

type CheckBoxType = {
    onChange: (current: boolean) => void
    checked: any
}

export const SuperCheckBox: FC<CheckBoxType> = (props) => {
    const {onChange, checked} = props

    const onClickChangeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.currentTarget.checked)
    }
    return (
        <Checkbox onChange={onClickChangeTaskStatusHandler} checked={checked} size="small"/>
    );
};
