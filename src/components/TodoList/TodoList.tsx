import React, {FC, memo, useCallback, useEffect, useState} from 'react';
import {AddItemForm} from '../AddItemForm/AddItemForm';
import {EditableSpan} from '../EditableSpan/EditableSpan';
import s from './TodoList.module.css'
import {IconButton, Typography} from '@mui/material';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import {useSelector} from 'react-redux';
import {AppRootStateType, useAppDispatch, useAppSelector} from '../../state/store/store';
import {createTaskTC, getTasksTC} from '../../state/reducers/tasks-reducer/tasks-reducer';
import {
    changeTodolistFilterAC,
    changeTodoListTitleAC, deleteTodolistTC,
    FilterValueType,
    removeTodolistAC, updateTodolistTC,
} from '../../state/reducers/todolist-reducer/todolists-reducer';
import {ButtonWithMemo} from '../ButtonWithMemo/ButtonWithMemo';
import {Task} from './Task/Task';
import {TaskStatuses, TaskType, TodolistType} from '../../api/todolist-api';
import {RequestStatusType} from '../../state/reducers/app-reducer/app-reducer';
import {log} from 'util';

type TodoListPropsType = {
    todolist: TodolistType
    entityStatus: RequestStatusType
}

export const TodoList: FC<TodoListPropsType> = memo(
    ({todolist, entityStatus}) => {
        const dispatch = useAppDispatch()
        const {id, title} = todolist
        const [filter, setFilter] = useState<FilterValueType>('all')
        let tasks = useAppSelector<TaskType[]>(state => state.tasks[id])



        useEffect(() => {
            dispatch(getTasksTC(id))
        }, [dispatch, id])

        const removeTodolist = () => dispatch(deleteTodolistTC(id))
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

        const addTask = useCallback((title: string) => dispatch(createTaskTC(id, title)), [dispatch, id])

        const changeTodoListTitle = useCallback((title: string) => {
            dispatch(updateTodolistTC(id, title))
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

        let tasksForRender: TaskType[] = getFilterValues(tasks, filter)

        const tasksList = tasksForRender.length ? tasksForRender?.map(t => <Task key={t.id} todolistId={id}
                                                                                 task={t}/>) :
            <div className={s.emptyTasksText}>Task list is empty</div>

        return (
            <div className={s.todolist}>
                <Typography variant="h5" align="center" fontWeight="bold" padding="10px 0">
                    <EditableSpan title={title} changeTitle={changeTodoListTitle}/>
                    <IconButton onClick={removeTodolist}
                                size={'small'}
                                disabled={entityStatus === 'loading'}><RestoreFromTrashIcon/></IconButton>
                </Typography>
                <AddItemForm addItem={addTask} label={'task name'} disabled={entityStatus === 'loading'}/>
                {
                    tasksList
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

