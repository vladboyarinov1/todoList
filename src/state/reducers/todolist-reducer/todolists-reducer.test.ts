import {
    addTodolistAC,
    AddTodolistAT, changeTodoListTitleAC,
    removeTodolistAC,
    RemoveTodolistAT,
    setTodolistAC, TodolistDomainType, todolistsReducer

} from './todolists-reducer';
import {TodolistType} from '../../../api/todolist-api';
import {v1} from 'uuid';

describe('todolistReducer', () => {
    let initialState: TodolistType[];
    beforeEach(() => {
        initialState = [
            {id: '1', title: 'First Todo List', addedDate: '', order: 0},
            {id: '2', title: 'Second Todo List', addedDate: '', order: 0}
        ];
    });

    test('todolists should be set', () => {
        const action = setTodolistAC(initialState)

        const endState = todolistsReducer([], action)

        expect(endState[0].filter).toBe('all')
        expect(endState[1].filter).toBe('all')
    })

    test('should remove a todolist from the state', () => {

        const action: RemoveTodolistAT = removeTodolistAC('2');
        const expectedState = [
            {id: '1', title: 'First Todo List', filter: 'all', addedDate: '', order: 0},
        ];

        const newState = todolistsReducer([], action);

        expect(newState).not.toBe(expectedState);
    });

    test('should add a new todolist to the state', () => {
        const action: AddTodolistAT = addTodolistAC('New Todo List', v1());
        const newState = todolistsReducer([], action);

        expect(newState.length).toBe(1)
        expect(newState[0].title).toBe('New Todo List')
    });
    test('todolist should change the title', () => {

        const action = changeTodoListTitleAC('newTitleForTodolistWithID2', '2')

        const expectedState: TodolistDomainType[] = [
            {id: '1', title: 'First Todo List', filter: 'all', addedDate: '', order: 0, entityStatus: 'idle'},
            {id: '2', title: '1', filter: 'all', addedDate: '', order: 0, entityStatus: 'idle'}
        ];

        const newState = todolistsReducer(expectedState, action);

        expect(newState[1].title).toBe('newTitleForTodolistWithID2')
        expect(newState[0].title).toBe('First Todo List')
    })
});


