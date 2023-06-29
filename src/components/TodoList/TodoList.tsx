import React, {FC, memo, useCallback, useState} from 'react';
import {AddItemForm} from '../AddItemForm/AddItemForm';
import {EditableSpan} from '../EditableSpan/EditableSpan';
import s from './TodoList.module.css'
import {IconButton, Typography} from '@mui/material';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from '../../store/store';
import {addTaskAC} from '../../reducers/tasks-reducer/tasks-reducer';
import {
    changeTodolistFilterAC,
    changeTodoListTitleAC,
    FilterValueType,
    removeTodolistAC,
    TodolistDomainType
} from '../../reducers/todolist-reducer/todolists-reducer';
import {ButtonWithMemo} from '../ButtonWithMemo/ButtonWithMemo';
import {Task} from './Task/Task';
import {TaskStatuses, TaskType, TodolistType} from '../../api/todolist-api';


type TodoListPropsType = {
    todolist: TodolistType
}
// type TodoListPropsType = {
//
// }

export const TodoList: FC<TodoListPropsType> = memo(
    ({todolist}) => {
        const {id, title} = todolist
        const [filter, setFilter] = useState<FilterValueType>('all')
        let tasks: TaskType[] = useSelector<AppRootStateType, TaskType[]>(state => state.tasks[id])
        const dispatch = useDispatch()


        const onClickAllFilter = useCallback(() => {
            dispatch(changeTodolistFilterAC('all', id))
            setFilter('all')
        }, [dispatch, id])

        const onClickActiveFilter = useCallback(() => {
            dispatch(changeTodolistFilterAC('active', id))
            setFilter('active')
        }, [dispatch, id])

        const onClickCompleteFilter = useCallback(() => {
            dispatch(changeTodolistFilterAC('complete', id))
            setFilter('complete')
        }, [dispatch, id])

        const addTask = useCallback((title: string) => dispatch(addTaskAC(title, id)), [dispatch, id])

        const changeTodoListTitle = useCallback((title: string) => {
            dispatch(changeTodoListTitleAC(title, id))
        }, [dispatch, id])

        const getFilterValues = useCallback((tasksList: Array<TaskType>, filterValue: FilterValueType) => {
            switch (filterValue) {
                case 'active':
                    return tasksList.filter(t => t.status === TaskStatuses.New)
                case 'complete':
                    return tasksList.filter(t => t.status === TaskStatuses.Completed)
                default:
                    return tasksList
            }
        }, [])
        const filteredTasks = getFilterValues(tasks, filter)

        return (
            <div className={s.todolist}>
                <Typography variant="h5" align="center" fontWeight="bold" padding="10px 0">
                    <EditableSpan title={title} changeTitle={changeTodoListTitle}/>
                    <IconButton onClick={() => dispatch(removeTodolistAC(id))}
                                size={'small'} sx={{}}><RestoreFromTrashIcon/></IconButton>
                </Typography>
                <AddItemForm addItem={addTask} label={'task name'}/>
                {
                    filteredTasks.length ? filteredTasks.map(t => <Task key={t.id} todolistId={id} task={t}/>)
                        :
                        <div>
                            Task list is empty</div>
                }
                <div className={s.btnFilterContainer}>
                    <ButtonWithMemo title={'all'} variant={'contained'} size={'small'}
                                    color={filter === 'all' ? 'secondary' : 'primary'}
                                    onClick={onClickAllFilter}/>
                    <ButtonWithMemo title={'active'} variant={'contained'} size={'small'}
                                    color={filter === 'active' ? 'secondary' : 'primary'}
                                    onClick={onClickActiveFilter}/>
                    <ButtonWithMemo title={'complete'} variant={'contained'} size={'small'}
                                    color={filter === 'complete' ? 'secondary' : 'primary'}
                                    onClick={onClickCompleteFilter}/>

                </div>
            </div>
        );
    });

// , (prevProps, nextProps) => {
//     return (
//         prevProps.todolist.id === nextProps.todolist.id &&
//         prevProps.todolist.filter === nextProps.todolist.filter &&
//         prevProps.todolist.title === nextProps.todolist.title
//     );
// }

