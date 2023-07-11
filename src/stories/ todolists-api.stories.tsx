import React, {useEffect, useState} from 'react'
import {TodolistApi} from '../api/todolist-api';

export default {
    title: 'API',
}
const settings = {
    withCredentials: true
}
const baseUrl: string = 'https://social-network.samuraijs.com/api/1.1'

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)

    useEffect(() => {
        // здесь мы будем делать запрос и ответ закидывать в стейт.
        // который в виде строки будем отображать в div-ке
        TodolistApi.getTodolists()
            .then((response) => setState(response.data)) // есть второй параметр callback нужен для того чтобы отловить ошибку если promise reject. Но обвчно обрабатывают через  catch
    }, [])
    return <div>{JSON.stringify(state)}</div>
}

export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)

    useEffect(() => {
        const title = 'Title'
        TodolistApi.createTodolist(title)
            .then((res) => setState(res.data))
    }, [])
    return <div>{JSON.stringify(state)}</div>
}

export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = '65226981-1bd9-4d7c-9f32-a8c2036b9ab2'
        TodolistApi.deleteTodolist(todolistId)
            .then((response) => setState(response.data))
    }, [])
    return <div>{JSON.stringify(state)}</div>
}

export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = 'b97df6ee-6bad-4d9b-9ece-18f0775d49e9'
        const title = 'New Title for Todo list1'
        TodolistApi.updateTodolistTitle(todolistId, title)
            .then((response) => setState(response.data))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

export const GetTasks = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = 'bda667d6-f7a7-4f7a-93c6-8bed3ac7a46f'
        TodolistApi.getTasks(todolistId)
            .then((response) => setState(response.data))
    }, [])


    return <div>{JSON.stringify(state)}</div>
}
export const CreateTasks = () => {
    const [state, setState] = useState<any>(null)
    const taskTitle = 'www.lalala.ruuuuu'
    useEffect(() => {
        const todolistId = 'bda667d6-f7a7-4f7a-93c6-8bed3ac7a46f'
        TodolistApi.createTask(todolistId, taskTitle)
            .then((res) => setState(res.data))
    }, [])
    return <div>{JSON.stringify(state)}</div>
}
export const DeleteTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = 'bda667d6-f7a7-4f7a-93c6-8bed3ac7a46f'
        const taskId = '8fed5e7a-1bfd-4164-8991-673e35efb7ab'
        TodolistApi.deleteTask(todolistId, taskId)
            .then((response) => setState(response.data))
    }, [])
    return <div>{JSON.stringify(state)}</div>
}

// export const UpdateTask = () => {
//     const [state, setState] = useState<any>(null)
//     useEffect(() => {
//         const todolistId = 'bda667d6-f7a7-4f7a-93c6-8bed3ac7a46f'
//         const taskId = 'c8c12b9f-cb2d-4d64-a1bc-b34bdc7f2a39'
//         const newTitle = 'new GFKJEFE TITLE!!'
//         TodolistApi.updateTask(todolistId, taskId, newTitle)
//             .then((response) => setState(response.data))
//     }, [])
//     return <div>{JSON.stringify(state)}</div>
// }




