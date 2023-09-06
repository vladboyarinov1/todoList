import {changeTaskTitleAC, createTaskTC, removeTaskTC, tasksReducer} from './tasks-reducer'
import {addTodolistAC, removeTodolistAC, setTodolistAC} from '../todolist-reducer/todolists-reducer';
import {TaskEntityStatus, TaskPriorities, TaskStatuses} from '../../../api/todolist-api';

describe('todolistReducer', () => {
    let startState: any;
    beforeEach(() => {
        startState = {
            'todolistId1': [
                {
                    id: '1', title: 'CSS', status: TaskStatuses.New,
                    startDate: '',
                    deadline: '',
                    addedDate: '',
                    order: 0,
                    priority: TaskPriorities.Low,
                    todoListId: 'todolistId1',
                    description: '',
                    entityStatus: TaskEntityStatus.Expectation
                },
            ],
            'todolistId2': [
                {
                    id: '1', title: 'bread', status: TaskStatuses.New,
                    startDate: '',
                    deadline: '',
                    addedDate: '',
                    order: 0,
                    priority: TaskPriorities.Low,
                    todoListId: 'todolistId2',
                    description: '',
                    entityStatus: TaskEntityStatus.Expectation
                },
            ]
        }

    });

    test('correct task should be deleted from correct array', () => {
        let param = {taskId: '1', todolistId: 'todolistId2'}

        const action = removeTaskTC.fulfilled(param, '', {taskId: '1', todolistId: 'todolistId2'}, '',)


        const endState = tasksReducer(startState, action)

        expect(endState['todolistId2'].length).toBeFalsy()
    })
    test('correct task should be added to correct array', () => {
        const action = createTaskTC.fulfilled(
            {
                task: {
                    id: '4',
                    title: 'juce',
                    status: TaskStatuses.New,
                    startDate: '',
                    deadline: '',
                    addedDate: '',
                    order: 0,
                    priority: TaskPriorities.Low,
                    todoListId: 'todolistId1',
                    description: '',
                    entityStatus: TaskEntityStatus.Expectation
                }
            },
            '',
            {
                todolistId: 'todolistId1',
                title: 'juce'
            }
        );
        const endState = tasksReducer(startState, action);

        expect(endState['todolistId1'][0].title).toBe('juce');
        expect(endState['todolistId2'][0].status).toBe(TaskStatuses.New);
    });
    test('status of specified task should be changed', () => {
        const action = changeTaskStatusAC({taskId: '2', model: {status: TaskStatuses.New}, todolistId: 'todolistId2'})

        const endState = tasksReducer(startState, action)

        expect(endState['todolistId2'][0].status).toBeFalsy()
        expect(endState['todolistId1'][0].status).toBeFalsy()
    })

    test('title of specified task should be changed', () => {
        const action = changeTaskTitleAC({taskId: '1', title: 'newTitle', todolistId: 'todolistId1'})


        const endState = tasksReducer(startState, action)

        expect(endState['todolistId1'][0].title).toBe('newTitle')
        expect(endState['todolistId2'][0].title).toBe('bread')
    })
    test('new array should be added when new todolist is added', () => {
        const action = addTodolistAC({title: 'new title', todolistId: '123'})

        const endState = tasksReducer(startState, action)

        const keys = Object.keys(endState)
        const newKey = keys.find(k => k != 'todolistId1' && k != 'todolistId2')
        if (!newKey) {
            throw Error('new key should be added')
        }

        expect(keys.length).toBe(3)
        expect(endState[newKey]).toEqual([])
    })

    test('property with todolistId should be deleted', () => {
        const action = removeTodolistAC({id: 'todolistId2'})

        const endState = tasksReducer(startState, action)
        const keys = Object.keys(endState)
        expect(keys.length).toBe(1)
        expect(endState['todolistId2']).not.toBeDefined()
    })
    test('empty arrays should be added when we set todolist', () => {

        const action = setTodolistAC({
            todos: [
                {id: '1', title: 'T1', addedDate: '', order: 0},
                {id: '2', title: 'T2', addedDate: '', order: 1},
            ]
        })

        const endState = tasksReducer({}, action)
        const keys = Object.keys(endState)

        expect(keys.length).toBe(2)
        expect(endState['1']).toStrictEqual([])
        expect(endState['2']).toStrictEqual([])
    })
})