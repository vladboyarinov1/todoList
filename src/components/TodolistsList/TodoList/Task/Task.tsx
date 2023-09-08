import React, {FC, memo, useCallback} from 'react';
import {EditableSpan} from '../../../EditableSpan/EditableSpan';
import {IconButton, ListItem} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import {SuperCheckBox} from '../../../SuperCheckBox/SuperCheckBox';
import {TaskEntityStatus, TaskStatuses, TaskType} from '../../../../api/todolist-api';
import {useAppDispatch} from '../../../../state/store/store';
import s from './Task.module.css'
import {useActions} from '../../../../hooks/useActions/useActions';
import {tasksActions} from '../../index';

type TasksPropsType = {
    todolistId: string
    task: TaskType
    entityStatus: TaskEntityStatus
}

export const Task: FC<TasksPropsType> = memo(({todolistId, task, entityStatus}) => {
    const dispatch = useAppDispatch()

    const {updateTaskTC, removeTaskTC,} = useActions(tasksActions)

    const changeTaskStatus = useCallback((taskId: string, status: TaskStatuses) => updateTaskTC({
        todolistId,
        taskId,
        model: {status}
    }), [dispatch, todolistId])

    const changeTaskTitle = useCallback((title: string) => {
        updateTaskTC({todolistId, taskId: task.id, model: {title}})
    }, [dispatch, task.id, todolistId])

    const removeTask = useCallback((todolistId: string, taskId: string) => removeTaskTC({
        todolistId,
        taskId
    }), [dispatch, task.id, todolistId])

    return (
        <ListItem className={entityStatus === TaskEntityStatus.Expectation ? s.disabledTask : ''} key={task.id}
                  id={task.id} divider disablePadding
                  secondaryAction={<IconButton onClick={() => removeTask(todolistId, task.id)}
                                               size={'small'}><ClearIcon/></IconButton>}>

            <SuperCheckBox callBack={(current) => changeTaskStatus(task.id, current)}
                           checked={task.status === TaskStatuses.Completed}/>

            <EditableSpan title={task.title} changeTitle={changeTaskTitle}/>
        </ListItem>
    )
})
