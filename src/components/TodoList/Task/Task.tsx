import React, {FC, memo, useCallback, useEffect} from 'react';
import {EditableSpan} from '../../EditableSpan/EditableSpan';
import {IconButton, ListItem} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import {SuperCheckBox} from '../../SuperCheckBox/SuperCheckBox';
import {useDispatch} from 'react-redux';
import {
    changeTaskStatusAC,
    changeTaskTitleAC,
    getTasksTC,
    deleteTaskAC, deleteTaskTC, updateTaskTC
} from '../../../reducers/tasks-reducer/tasks-reducer';

import {TaskStatuses, TaskType} from '../../../api/todolist-api';
import {useAppDispatch} from '../../../store/store';

type TasksPropsType = {
    todolistId: string
    task: TaskType
}

export const Task: FC<TasksPropsType> = memo(({todolistId, task}) => {
    const dispatch = useAppDispatch()

    const changeTaskStatus = useCallback((taskId: string, status: TaskStatuses) => dispatch(updateTaskTC(todolistId, taskId, {status})), [dispatch, todolistId])

    const removeTask = useCallback(() => dispatch(deleteTaskTC(todolistId, task.id)), [dispatch, task.id, todolistId])

    const changeTaskTitle = useCallback((title: string) => {
        dispatch(updateTaskTC(todolistId, task.id, {title}))
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
