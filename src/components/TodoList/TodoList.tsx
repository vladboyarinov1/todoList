import React, {ChangeEvent, FC, useState} from 'react';
import {FilterValueType, TaskType} from '../../App';
import {TasksList} from './TasksList/TasksList';
import {AddItemForm} from '../AddItemForm/AddItemForm';
import {EditableSpan} from '../EditableSpan/EditableSpan';
import s from './TodoList.module.css'
import {Button, IconButton, Typography} from '@mui/material';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';


//rsc
//callback - это функция, которая будет вызвана внутри дочерней компоненты, при этом передадим в нее какие-либо данные, которые полетят в родительскую компоненту.
//перевод callback - функция обратного вызова

type TodoListPropsType = {
    // data
    todoListId: string
    title: string
    filter: FilterValueType // передаем для стилизации кнопок
    tasks: Array<TaskType> // массив элементов типа TaskType
    // function for tasks
    removeTask: (taskId: string, todoListId: string) => void
    addTask: (title: string, todoListId: string) => void
    changeTaskStatus: (taskId: string, newIsDone: boolean, todoListId: string) => void
    changeTasksTitle: (taskId: string, newTitle: string, todoListId: string) => void
    // function for TodoLists
    changeTodoListFilter: (filter: FilterValueType, todoListId: string) => void
    removeTodoList: (todoListId: string) => void
    changeTodoListTitle: (title: string, todoListId: string) => void
}

export const TodoList: FC<TodoListPropsType> = (props) => {
    const {
        todoListId, title, filter,
        tasks, removeTask, addTask, changeTaskStatus,
        changeTodoListFilter, removeTodoList, changeTasksTitle, changeTodoListTitle,
    } = props

    const onClickChangeTodoListFilterHandler = (filter: any) => () => changeTodoListFilter(filter, todoListId)//разобраться что тут происходит со скобками
    const addTaskHandler = (title: string) => addTask(title, todoListId)

    const changeTodoListTitleHandler = (title: string) => {
        changeTodoListTitle(title, todoListId)
    }

    return (
        <div className={s.todolist}>
            <Typography variant="h5" align="center" fontWeight="bold" padding="10px 0">
                <EditableSpan title={title} changeTitle={changeTodoListTitleHandler}/>
                <IconButton onClick={() => removeTodoList(todoListId)}
                            size={'small'} sx={{}}><RestoreFromTrashIcon/></IconButton>
            </Typography>
            <AddItemForm addItem={addTaskHandler}/>

            <TasksList todoListId={todoListId} tasks={tasks} removeTask={removeTask}
                       changeTaskStatus={changeTaskStatus} changeTasksTitle={changeTasksTitle}
                       changeTodoListTitle={changeTodoListTitle}/>

            <div className={s.btnFilterContainer}>
                <Button variant={'contained'} size={'small'} color={filter === 'all' ? 'secondary' : 'primary'}
                        onClick={onClickChangeTodoListFilterHandler('all')}>All
                </Button>
                <Button variant={'contained'} size={'small'} color={filter === 'active' ? 'secondary' : 'primary'}
                        onClick={onClickChangeTodoListFilterHandler('active')}>Active
                </Button>
                <Button variant={'contained'} size={'small'} color={filter === 'complete' ? 'secondary' : 'primary'}
                        onClick={onClickChangeTodoListFilterHandler('complete')}>Completed
                </Button>
            </div>
        </div>
    );
};