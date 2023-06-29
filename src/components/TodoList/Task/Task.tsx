import React, {FC, memo, useCallback} from 'react';
import {EditableSpan} from '../../EditableSpan/EditableSpan';
import {IconButton, ListItem} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import {SuperCheckBox} from '../../SuperCheckBox/SuperCheckBox';
import {useDispatch} from 'react-redux';
import {changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from '../../../reducers/tasks-reducer/tasks-reducer';

import {TaskStatuses, TaskType} from '../../../api/todolist-api';

type TasksPropsType = {
    todolistId: string
    task: TaskType
}

export const Task: FC<TasksPropsType> = memo(({todolistId, task}) => {
    console.log(task.status === 2)
    const dispatch = useDispatch()

    const changeTaskStatus = useCallback((taskId: string, current: TaskStatuses) => dispatch(changeTaskStatusAC(taskId, current, todolistId)), [dispatch, todolistId])

    const removeTask = useCallback(() => dispatch(removeTaskAC(task.id, todolistId)), [dispatch, task.id, todolistId])

    const changeTaskTitle = useCallback((title: string) => {
        dispatch(changeTaskTitleAC(task.id, title, todolistId))
    }, [dispatch, task.id, todolistId])

    return (
        <ListItem key={task.id} id={task.id} divider disablePadding
                  secondaryAction={<IconButton onClick={removeTask}
                                               size={'small'}><ClearIcon/></IconButton>}>

            <SuperCheckBox callBack={(current) => changeTaskStatus(task.id, current)}
                           checked={task.status === TaskStatuses.Completed}/>

            <EditableSpan title={task.title} changeTitle={changeTaskTitle}/>
        </ListItem>
    )
})
