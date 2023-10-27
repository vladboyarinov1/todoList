import { tasksReducer } from "../tasks-reducer/tasks-reducer";
import { TodolistDomainType, todolistsReducer } from "../todolists-reducer/todolists-reducer";
import { TasksStateType } from "../../../App/App";
import { TodolistType } from "../../../api/types";
import { asyncActions as todolistsAsyncActions } from "../todolists-reducer/todolists-reducer";

test("ids should be equals", () => {
    const startTasksState: TasksStateType = {};
    const startTodolistsState: TodolistDomainType[] | any = [];
    let todolist: TodolistType = {
        id: "21",
        title: "any",
        addedDate: "",
        order: 0,
    };

    const action: any = todolistsAsyncActions.addTodolistTC.fulfilled({ todolist }, "requesId", todolist.title);
    const endTasksState = tasksReducer(startTasksState, action);
    const endTodolistsState: TodolistDomainType[] = todolistsReducer(startTodolistsState, action);

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodolists = endTodolistsState[0].id;

    expect(idFromTasks).toBe(action.payload.todolist.id);
    expect(idFromTodolists).toBe(action.payload.todolist.id);
});
