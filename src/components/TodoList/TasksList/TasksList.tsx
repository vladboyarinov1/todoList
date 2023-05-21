import React, {ChangeEvent, FC} from 'react';
import {TaskType} from '../../../App';
import {EditableSpan} from '../../EditableSpan/EditableSpan';
import {Checkbox, IconButton, ListItem} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import {SuperCheckBox} from '../../SuperCheckBox/SuperCheckBox';


type TasksPropsType = {
    todoListId: string
    tasks: Array<TaskType>
    removeTask: (taskId: string, todoListId: string) => void
    changeTaskStatus: (taskId: string, newIsDone: boolean, todoListId: string) => void
    changeTasksTitle: (taskId: string, newTitle: string, todoListId: string) => void
    changeTodoListTitle: (title: string, todoListId: string) => void
}

export const TasksList: FC<TasksPropsType> = (props) => {
    const {tasks, removeTask, todoListId, changeTaskStatus, changeTasksTitle, changeTodoListTitle} = props

    const taskList = tasks.length ? tasks.map((t) => {// map вернет новый массив и в новом массиве будут новые элементы, полученные в результате преобразованя элементов исходного массива
        const onClickRemoveTaskHandler = () => removeTask(t.id, todoListId)

        const onClickChangeTaskStatus = (current: boolean) => changeTaskStatus(t.id, current, todoListId)

        const changeTaskTitleHandler = (title: string) => {
            changeTasksTitle(t.id, title, todoListId)
        }//naming????
        const isDoneTitleStyle = t.isDone ? 'taskDone' : 'task'

        return (
            <ListItem id={t.id} divider disablePadding secondaryAction={<IconButton onClick={onClickRemoveTaskHandler} size={'small'}><ClearIcon/></IconButton>}>

                <SuperCheckBox onChange={onClickChangeTaskStatus} checked={t.isDone}/>

                <EditableSpan title={t.title} spanClasses={isDoneTitleStyle} changeTitle={changeTaskTitleHandler}/>
            </ListItem>
        )
    }) : <span>Task list is empty</span>

    return <>
        {taskList}
    </>


};