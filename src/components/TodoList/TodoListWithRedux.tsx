import React, {FC} from 'react';
import {TaskType, TodoListType} from '../../AppWithRedux';
import {TasksList} from './TasksList/TasksList';
import {AddItemForm} from '../AddItemForm/AddItemForm';
import {EditableSpan} from '../EditableSpan/EditableSpan';
import s from './TodoList.module.css'
import {Button, IconButton, Typography} from '@mui/material';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from '../../store';
import {addTaskAC} from '../../reducers/tasks-reducer/tasks-reducer';
import {
    changeTodolistFilterAC,
    changeTodoListTitleAC,
    removeTodolistAC
} from '../../reducers/todolist-reducer/todolist-reducer';

//callback - это функция, которая будет вызвана внутри дочерней компоненты, при этом передадим в нее какие-либо данные, которые полетят в родительскую компоненту.
//перевод callback - функция обратного вызова
type TodoListPropsType = {
    todolist: TodoListType
}

export const TodoListWithRedux: FC<TodoListPropsType > = ({todolist}) => {

    const {id, filter, title} = todolist
    let tasks: TaskType[] = useSelector<AppRootStateType, TaskType[]>(state => state.tasks[id])
    const dispatch = useDispatch()

    const onClickChangeTodoListFilterHandler = (filter: any) => () => dispatch(changeTodolistFilterAC(filter, id))

    const addTaskHandler = (title: string) => dispatch(addTaskAC(title, id))

    const changeTodoListTitleHandler = (title: string) => {
        dispatch(changeTodoListTitleAC(title, id))
    }

   if (filter === 'active') {
       tasks = tasks.filter(t => !t.isDone)
   }
    if (filter === 'complete') {
        tasks = tasks.filter(t => t.isDone)
    }

    return (
        <div className={s.todolist}>
            <Typography variant="h5" align="center" fontWeight="bold" padding="10px 0">
                <EditableSpan title={title} changeTitle={changeTodoListTitleHandler}/>
                <IconButton onClick={() => dispatch(removeTodolistAC(id))}
                            size={'small'} sx={{}}><RestoreFromTrashIcon/></IconButton>
            </Typography>
            <AddItemForm addItem={addTaskHandler}/>
            <TasksList todolist={todolist} tasks={tasks}/>

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