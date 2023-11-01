import React, { useCallback } from "react";
import { FilterValue, TodolistDomain } from "features/TodolistsList/model/todolists/todolistsSlice";
import { ButtonWithMemo } from "common/components/ButtonWithMemo/ButtonWithMemo";
import { useActions } from "common/hooks/useActions";
import { todolistsActions } from "features/TodolistsList/index";

type Props = {
    todolist: TodolistDomain;
};

export const FilterTasksButtons = ({ todolist }: Props) => {
    const { id, filter } = todolist;
    const { changeTodolistFilter } = useActions({
        ...todolistsActions,
    });

    const onClickChangeFilter = useCallback((filter: FilterValue) => {
        changeTodolistFilter({ filter, id });
    }, []);

    const renderFilterButton = (title: string, currenFilter: FilterValue) => {
        return (
            <ButtonWithMemo
                title={title}
                variant={"contained"}
                size={"small"}
                color={filter === currenFilter ? "secondary" : "primary"}
                onClick={() => onClickChangeFilter(currenFilter)}
            />
        );
    };
    return (
        <>
            {renderFilterButton("All", "all")}
            {renderFilterButton("Active", "active")}
            {renderFilterButton("Complete", "complete")}
        </>
    );
};
