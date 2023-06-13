import React, {ChangeEvent, FC, memo, useState} from 'react';
import AddIcon from '@mui/icons-material/Add';
import {IconButton, TextField} from '@mui/material';

type AddItemFormProps = {
    addItem: (title: string) => void
    label: string
}

export const AddItemForm: FC<AddItemFormProps> = memo((props) => {
    const {addItem, label} = props

    const [title, setTitle] = useState<string>('')
    const [error, setError] = useState<boolean>(false)

    const maxTaskLength = title.length > 15
    const taskNotAdd = !title.length || maxTaskLength
    const errorMessage = 'Error: enter the correct value!'

    const changeLocalTitle = (e: ChangeEvent<HTMLInputElement>) => {
        error && setError(false) // если была ошибка, то снимаем ее
        setTitle(e.currentTarget.value)
    }
    const addItemHandler = () => {
        if (title.trim()) {
            addItem(title)
        } else {
            setError(true)
        }
        setTitle('')
    }

    const addItemEnter = taskNotAdd ? undefined : (e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && addItemHandler()

    const onBlurHandler = () => {
        setError(false)
    }


    return (
        <div>
            <TextField onChange={changeLocalTitle} value={title} onKeyDown={addItemEnter}
                       error={error} size={'small'}
                       onBlur={onBlurHandler}
                       label={error ? errorMessage : label}/>
            <IconButton onClick={addItemHandler} size={'small'} disabled={taskNotAdd}
                        style={{}}><AddIcon/></IconButton>
        </div>
    );
});


