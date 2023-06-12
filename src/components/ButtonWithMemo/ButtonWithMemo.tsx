import React, {FC, memo} from 'react';
import {Button} from '@mui/material';
import {ButtonProps} from '@mui/material/Button/Button';


export const ButtonWithMemo: FC<ButtonProps> = memo(({
                                                         variant,
                                                         title, size, color, onClick
                                                     }) =>
    <Button variant={variant} size={size} color={color}
            onClick={onClick}>{title}
    </Button>);