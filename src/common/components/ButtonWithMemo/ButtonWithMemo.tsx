import React, { memo } from "react";
import { Button } from "@mui/material";
import { ButtonProps } from "@mui/material/Button/Button";

export const ButtonWithMemo = memo(({ variant, title, size, color, onClick }: ButtonProps) => (
    <Button variant={variant} size={size} color={color} onClick={onClick}>
        {title}
    </Button>
));
