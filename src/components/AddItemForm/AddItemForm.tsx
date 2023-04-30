import React, {ChangeEvent, FC, useState} from 'react';
import AddIcon from '@mui/icons-material/Add';
import {IconButton, TextField} from '@mui/material';

type addItemFormProps = {
    addItem: (title: string) => void
}

export const AddItemForm: FC<addItemFormProps> = (props) => {
    const {addItem} = props

    const [title, setTitle] = useState<string>('')
    const [error, setError] = useState<boolean>(false)

    const maxTaskLength = title.length > 15
    const taskNotAdd = !title.length || maxTaskLength
    const errorMessage = error && <span>enter the correct value!</span>

    const maxValueError = maxTaskLength && <span style={{color: 'red', fontSize: '12px'}}>input length reached!</span>

    const changeLocalTitle = (e: ChangeEvent<HTMLInputElement>) => {
        error && setError(false) // если была ошибка, то снимаем ее
        setTitle(e.currentTarget.value)
    }
    const addItemHandler = () => {// shift f6 переименовать все компоненты с названием
        if (title.trim()) {
            addItem(title)
        } else {
            setError(true)
        }
        setTitle('')
    }
    const addItemEnter = taskNotAdd ? undefined : (e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && addItemHandler()


    return (
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <TextField onChange={changeLocalTitle} value={title} onKeyDown={addItemEnter}
                       error={error} helperText={errorMessage || maxValueError} size={'small'}
                       placeholder="Enter task name"/>
            <IconButton onClick={addItemHandler} size={'small'} disabled={taskNotAdd}><AddIcon/></IconButton>
        </div>
    );
};
