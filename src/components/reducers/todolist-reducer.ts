import {FilterValueType, TodoListType} from '../../App';
import {v1} from 'uuid';
//reducer - это чистая функция (это когда функция на одних и тех же данных функция дает один и тот же результат / это функция которая не работает с внешними переменными, не изменяет их и все что нужно получает в параметрах / не должны изменять входящие данные)
//в параметрах редюсера нужно указать:
//state - исходный state
//action - инструкция о том, какие действия мы хотим произвести + (еще нужно передать определенный набор данных необходимых для выполнения этой инструкции (параметры)) action - object
//должна вернуть новый state

//объект action - это объект, который обязательно имеет свойство type, и содержит еще какие то дополнительные данные, которые можно упаковать в объект payload

export type RemoveTodolistAT = {
    type: 'REMOVE-TODOLIST'
    id: string
}
export type AddTodolistAT = {
    type: 'ADD-TODOLIST'
    title: string
}

export type ChangeTodoListTitleAT = {
    type: 'CHANGE-TODOLIST-TITLE'
    title: string
    id: string
}

export type ChangeTodolistFilterAT = {
    type: 'CHANGE-TODOLIST-FILTER'
    filter: FilterValueType
    id: string
}

export type ActionType = RemoveTodolistAT | AddTodolistAT | ChangeTodoListTitleAT | ChangeTodolistFilterAT
// export type ActionType = Record<string, { type: string; id?: string; title?: string; filter?: FilterValueType }>

export const todolistReducer = (todolists: TodoListType[], action: ActionType): TodoListType[] => {
    switch (action.type) {

        case 'REMOVE-TODOLIST':
            //todoList.filter(tl => tl.id !== todoListId)
            return todolists.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            const newTodoList: TodoListType = {id: v1(), title: action.title, filter: 'all'}
            return [...todolists, newTodoList]
        case 'CHANGE-TODOLIST-TITLE':
            return todolists.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case 'CHANGE-TODOLIST-FILTER':
            return todolists.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)

        default:
            return todolists
    }
}

export const RemoveTodolistAT = (id: string): RemoveTodolistAT => ({type: 'REMOVE-TODOLIST', id})
export const AddTodolistAT = (title: string): AddTodolistAT => ({type: 'ADD-TODOLIST', title})
export const ChangeTodoListTitleAT = (title: string, id: string): ChangeTodoListTitleAT => ({
    type: 'CHANGE-TODOLIST-TITLE', title, id
})
export const ChangeTodolistFilterAT = (filter: FilterValueType, id: string): ChangeTodolistFilterAT => ({
    type: 'CHANGE-TODOLIST-FILTER', filter, id
})
