import {tasksReducer} from '../tasks-reducer/tasks-reducer';
import {addTodolistAC, TodolistDomainType, todolistsReducer} from '../todolist-reducer/todolists-reducer';
import {TasksStateType,} from '../../../App/App';


test('ids should be equals', () => {
    const startTasksState: TasksStateType = {}
    const startTodolistsState: TodolistDomainType[] | any = []

    const action = addTodolistAC({title: 'new todolist', todolistId: '1'})

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState: TodolistDomainType[] = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState)
    const idFromTasks = keys[0]
    const idFromTodolists = endTodolistsState[0].id

    expect(idFromTasks).toBe(action.payload.todolistId)
    expect(idFromTodolists).toBe(action.payload.todolistId)
})

