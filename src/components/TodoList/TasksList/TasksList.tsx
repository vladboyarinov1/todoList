import React, {FC} from 'react';
import {EditableSpan} from '../../EditableSpan/EditableSpan';
import {IconButton, ListItem} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import {SuperCheckBox} from '../../SuperCheckBox/SuperCheckBox';
import {useDispatch} from 'react-redux';
import {changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from '../../../reducers/tasks-reducer/tasks-reducer';
import {TaskType, TodoListType} from '../../../AppWithRedux';


type TasksPropsType = {
    todolist: TodoListType
    tasks: TaskType[]
}

export const TasksList: FC<TasksPropsType> = ({todolist, tasks}) => {
    const {id} = todolist

    const dispatch = useDispatch()

    const onChangeTaskStatusHandler = (taskId: string, current: boolean) => dispatch(changeTaskStatusAC(taskId, current, id))

    const taskList = tasks.length ? tasks.map((t) => {// map вернет новый массив и в новом массиве будут новые элементы, полученные в результате преобразованя элементов исходного массива
        const onClickRemoveTaskHandler = () => dispatch(removeTaskAC(t.id, id))

        const changeTaskTitleHandler = (title: string) => {
            dispatch(changeTaskTitleAC(t.id, title, id))
        }//naming????
        const isDoneTitleStyle = t.isDone ? 'taskDone' : 'task'

        return (
            <ListItem id={t.id} divider disablePadding secondaryAction={<IconButton onClick={onClickRemoveTaskHandler}
                                                                                    size={'small'}><ClearIcon/></IconButton>}>

                <SuperCheckBox callBack={(current) => onChangeTaskStatusHandler(t.id, current)} checked={t.isDone}/>

                <EditableSpan title={t.title} spanClasses={isDoneTitleStyle} changeTitle={changeTaskTitleHandler}/>
            </ListItem>
        )
    }) : <span>Task list is empty</span>

    return <>
        {taskList}
    </>
};