import React, {ChangeEvent, FC, useState} from 'react';
import {TextField} from '@mui/material';

type EditableSpanPropsType = {
    title: string
    spanClasses?: string
    inputClasses?: string
    changeTitle: (title: string) => void
}

export const EditableSpan: FC<EditableSpanPropsType> = (props) => {
    const {title, spanClasses, changeTitle} = props

    const [editMode, setEditMode] = useState<boolean>(false)
    const [localTitle, setTitle] = useState<string>(title)

    const changeLocalTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }//

    const onEditMode = () => {
        setEditMode(true)
    }
    const offEditMode = () => {
        setEditMode(false)
        changeTitle(localTitle)// передаем новое название в функцию
    }

    return (
        editMode
            ? <TextField onChange={changeLocalTitle}
                         onBlur={offEditMode}
                         value={localTitle} size="small" variant="standard"/>// title но уже пропущенный через локальный стейт
            : <span onDoubleClick={onEditMode} className={spanClasses}>{title}</span>
    );
};

//кликаем по названию таски - появляется форма для редактирования
