import {FilterValueType, TodoListType} from '../../AppWithRedux';
import {v1} from 'uuid';
//reducer - это чистая функция (это когда функция на одних и тех же данных функция дает один и тот же результат / это функция которая не работает с внешними переменными, не изменяет их и все что нужно получает в параметрах / не должны изменять входящие данные)
//в параметрах редюсера нужно указать:
//state - исходный state
//action - инструкция о том, какие действия мы хотим произвести + (еще нужно передать определенный набор данных необходимых для выполнения этой инструкции (параметры)) action - object
//должна вернуть новый state

//объект action - это объект, который обязательно имеет свойство type, и содержит еще какие то дополнительные данные, которые можно упаковать в объект payload

export type RemoveTodolistAT = ReturnType<typeof removeTodolistAC>
export type AddTodolistAT = ReturnType<typeof addTodolistAC>
export type ChangeTodoListTitleAT = ReturnType<typeof changeTodoListTitleAC>
export type ChangeTodolistFilterAT = ReturnType<typeof changeTodolistFilterAC>

export  type TodolistActionType =
    RemoveTodolistAT
    | AddTodolistAT
    | ChangeTodoListTitleAT
    | ChangeTodolistFilterAT
// export type ActionType = Record<string, { type: string; id?: string; title?: string; filter?: FilterValueType }>

export const todoListId_1 = v1()
export const todoListId_2 = v1()

const initState: TodoListType[] = [
    {id: todoListId_1, title: 'What to learn', filter: 'all'},
    {id: todoListId_2, title: 'What to buy', filter: 'all'}
]

export const todolistReducer = (todolists = initState, action: TodolistActionType): TodoListType[] => {
    switch (action.type) {

        case 'REMOVE-TODOLIST':
            //todoList.filter(tl => tl.id !== todoListId)
            return todolists.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            const newTodoList: TodoListType = {id: action.todolistId, title: action.title, filter: 'all'}
            return [...todolists, newTodoList]
        case 'CHANGE-TODOLIST-TITLE':
            return todolists.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case 'CHANGE-TODOLIST-FILTER':
            return todolists.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        default:
            return todolists
    }
}

export const removeTodolistAC = (id: string) => ({type: 'REMOVE-TODOLIST', id} as const)
export const addTodolistAC = (title: string) => ({type: 'ADD-TODOLIST', title, todolistId: v1()} as const)
export const changeTodoListTitleAC = (title: string, id: string) => ({
    type: 'CHANGE-TODOLIST-TITLE', title, id
} as const)
export const changeTodolistFilterAC = (filter: FilterValueType, id: string) => ({
    type: 'CHANGE-TODOLIST-FILTER', filter, id
} as const)
