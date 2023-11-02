import React, { ChangeEvent, memo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { IconButton, TextField } from "@mui/material";

type Props = {
    addItem: (title: string) => any;
    label: string;
    disabled?: boolean;
};

export const AddItemForm = memo(({ addItem, label, disabled }: Props) => {
    const [title, setTitle] = useState<string>("");
    const [error, setError] = useState<any>("");

    const taskNotAdd = !title.length;

    const changeLocalTitle = (e: ChangeEvent<HTMLInputElement>) => {
        error && setError(null); // если была ошибка, то снимаем ее
        setTitle(e.currentTarget.value);
    };

    const addItemHandler = () => {
        if (title.trim() !== "") {
            addItem(title)
                .unwrap()
                .then((val: any) => {
                    setTitle("");
                })
                .catch((e: any) => {
                    debugger;
                    setError(e.errors);
                });
        } else {
            debugger;
            setError("Title required!");
        }
    };

    const addItemEnter = taskNotAdd
        ? undefined
        : (e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && addItemHandler();

    const onBlurHandler = () => {
        setError(null);
    };

    return (
        <div style={{ display: "flex", justifyContent: "space-between", width: "80%" }}>
            <TextField
                onChange={changeLocalTitle}
                error={error}
                value={title}
                onKeyDown={addItemEnter}
                size={"small"}
                onBlur={onBlurHandler}
                helperText={error}
            />
            <IconButton onClick={addItemHandler} size={"small"} style={{}}>
                <AddIcon />
            </IconButton>
        </div>
    );
});
