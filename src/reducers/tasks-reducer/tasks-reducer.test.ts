import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, deleteTaskAC, tasksReducer} from './tasks-reducer'
import {TasksStateType} from '../../App/App';
import {addTodolistAC, removeTodolistAC} from '../todolist-reducer/todolists-reducer';
import {TaskPriorities, TaskStatuses} from '../../api/todolist-api';

describe('todolistReducer', () => {
    let startState: TasksStateType;
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
                },
            ]
        }

    });

    test('correct task should be deleted from correct array', () => {

        const action = deleteTaskAC('1', 'todolistId2')

        const endState = tasksReducer(startState, action)

        expect(endState['todolistId2'].length).toBeFalsy()
    })
    test('correct task should be added to correct array', () => {

        const action = addTaskAC({
            id: '4', title: 'juce', status: TaskStatuses.New,
            startDate: '',
            deadline: '',
            addedDate: '',
            order: 0,
            priority: TaskPriorities.Low,
            todoListId: 'todolistId1',
            description: '',
        })
        const endState = tasksReducer(startState, action)

        expect(endState['todolistId1'][0].title).toBe('juce')
        expect(endState['todolistId2'][0].status).toBe(TaskStatuses.New)
    })
    test('status of specified task should be changed', () => {
        const action = changeTaskStatusAC('2', {status: TaskStatuses.New}, 'todolistId2')

        const endState = tasksReducer(startState, action)

        expect(endState['todolistId2'][0].status).toBeFalsy()
        expect(endState['todolistId1'][0].status).toBeFalsy()
    })

    test('title of specified task should be changed', () => {
        const action = changeTaskTitleAC('1', 'newTitle', 'todolistId1')

        const endState = tasksReducer(startState, action)

        expect(endState['todolistId1'][0].title).toBe('newTitle')
        expect(endState['todolistId2'][0].title).toBe('bread')
    })
    test('new array should be added when new todolist is added', () => {
        const action = addTodolistAC('new title', '123')

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
        const action = removeTodolistAC('todolistId2')

        const endState = tasksReducer(startState, action)
        const keys = Object.keys(endState)
        expect(keys.length).toBe(1)
        expect(endState['todolistId2']).not.toBeDefined()
    })
})