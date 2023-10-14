import React, {ChangeEvent, FC, memo, useState} from 'react';
import AddIcon from '@mui/icons-material/Add';
import {IconButton, TextField} from '@mui/material';

type AddItemFormProps = {
    addItem: (title: string) => Promise<any>
    label: string
    disabled?: boolean
}

export const AddItemForm: FC<AddItemFormProps> = memo((props) => {
    const {addItem, label, disabled} = props

    const [title, setTitle] = useState<string>('')
    const [error, setError] = useState<any>('')

    // const maxTaskLength = title.length > 100
    const taskNotAdd = !title.length
    // const taskNotAdd = !title.length || maxTaskLength
    // const errorMessage = 'Error: enter the correct value!'

    const changeLocalTitle = (e: ChangeEvent<HTMLInputElement>) => {
        error && setError(null) // если была ошибка, то снимаем ее
        setTitle(e.currentTarget.value)
    }
    const addItemHandler = async () => {
        if (title.trim() !== '') {
            try {
                if (title.trim()) {
                    await addItem(title)
                    setTitle('')
                }
            } catch (error: any) {
                setError(error.message)
            }
        } else {
            // setError(true)

        }
    }

    const addItemEnter = taskNotAdd ? undefined : (e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && addItemHandler()

    const onBlurHandler = () => {
        setError(null)
    }


    return (

        <div style={{display: 'flex', justifyContent: 'space-between', width: '80%'}}>
                <TextField onChange={changeLocalTitle}  error={error} value={title} onKeyDown={addItemEnter}
                           size={'small'}
                           onBlur={onBlurHandler}
                           helperText={error}
                />
            <IconButton onClick={addItemHandler} size={'small'}
                        style={{}}><AddIcon/></IconButton>

        </div>
    );
});


