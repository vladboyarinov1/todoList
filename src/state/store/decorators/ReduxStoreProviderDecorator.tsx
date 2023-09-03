import React, {ReactNode} from 'react'
import {Provider} from 'react-redux';
import {AppRootStateType} from '../store';
import {combineReducers, legacy_createStore} from 'redux';
import {tasksReducer} from '../../reducers/tasks-reducer/tasks-reducer';
import {v1} from 'uuid';
import {todolistsReducer} from '../../reducers/todolist-reducer/todolists-reducer';
import {TaskEntityStatus, TaskPriorities, TaskStatuses} from '../../../api/todolist-api';

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
})

const initialGlobalState: any = {
    todolists: [
        {id: 'todolistId1', title: 'What to learn', filter: 'all', addedDate: '', order: 0, entityStatus: 'idle'},
        {id: 'todolistId2', title: 'What to buy', filter: 'all', addedDate: '', order: 0, entityStatus: 'loading'}
    ],
    tasks: {
        ['todolistId1']: [
            {
                id: v1(), title: 'HTML&CSS', status: TaskStatuses.New,
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,
                todoListId: 'todolistId1',
                description: '',
                entityStatus: TaskEntityStatus.Expectation
            },
            {
                id: v1(), title: 'JS', status: TaskStatuses.New,
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,
                todoListId: 'todolistId1',
                description: '',
                entityStatus: TaskEntityStatus.Expectation
            }
        ],
        ['todolistId2']: [
            {
                id: v1(), title: 'Milk', status: TaskStatuses.New,
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,
                todoListId: 'todolistId2',
                description: '',
                entityStatus: TaskEntityStatus.Expectation
            },
            {
                id: v1(), title: 'React Book', status: TaskStatuses.New,
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,
                todoListId: 'todolistId2',
                description: '',
                entityStatus: TaskEntityStatus.Expectation
            }
        ]
    }
};

export const storyBookStore = legacy_createStore(rootReducer, initialGlobalState as AppRootStateType);

export const ReduxStoreProviderDecorator = (storyFn: () => ReactNode) => {
    return <Provider store={storyBookStore}>{storyFn()}</Provider>
}
