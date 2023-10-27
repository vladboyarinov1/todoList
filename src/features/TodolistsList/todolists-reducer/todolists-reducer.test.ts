import { TodolistDomainType, todolistsReducer } from "./todolists-reducer";

import { asyncActions as todolistsAsyncActions } from "./todolists-reducer";
import { todolistsActions } from "../index";
import { TodolistType } from "api/types";

describe("todolistReducer", () => {
    let initialState: TodolistType[] | any;
    beforeEach(() => {
        initialState = [
            { id: "1", title: "First Todo List", addedDate: "", order: 0 },
            { id: "2", title: "Second Todo List", addedDate: "", order: 0 },
        ];
    });

    test("todolists should be set", () => {
        const action = todolistsAsyncActions.fetchTodolists.fulfilled({ todos: initialState }, "");

        const endState: TodolistDomainType[] = todolistsReducer(initialState, action);

        expect(endState[0].filter).toBe("all");
        expect(endState[1].filter).toBe("all");
    });

    test("should remove a todolist from the state", () => {
        const action = todolistsActions.deleteTodolistTC.fulfilled({ id: "2" }, "", "2");
        const expectedState = [{ id: "1", title: "First Todo List", filter: "all", addedDate: "", order: 0 }];

        const newState = todolistsReducer([], action);

        expect(newState).not.toBe(expectedState);
    });

    test("should add a new todolist to the state", () => {
        const todolist: TodolistType = {
            title: "new todos",
            id: "12",
            addedDate: "",
            order: 0,
        };
        const action = todolistsAsyncActions.addTodolistTC.fulfilled({ todolist }, "", todolist.title);

        const newState: TodolistDomainType[] = todolistsReducer([], action);

        expect(newState.length).toBe(1);
        expect(newState[0].title).toBe("new todos");
    });
    test("todolist should change the title", () => {
        const action = todolistsActions.updateTodolistTC.fulfilled(
            { title: "newTitleForTodolistWithID2", id: "2" },
            "",
            {
                id: "2",
                title: "newTitleForTodolistWithID2",
            },
        );

        const expectedState: TodolistDomainType[] | any = [
            { id: "1", title: "First Todo List", filter: "all", addedDate: "", order: 0, entityStatus: "idle" },
            { id: "2", title: "1", filter: "all", addedDate: "", order: 0, entityStatus: "idle" },
        ];

        const newState: TodolistDomainType[] = todolistsReducer(expectedState, action);

        expect(newState[1].title).toBe("newTitleForTodolistWithID2");
        expect(newState[0].title).toBe("First Todo List");
    });
});
