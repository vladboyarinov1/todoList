// import type {Meta, StoryObj} from '@storybook/react';
// import {AddItemForm} from './AddItemForm';
// import {action} from '@storybook/addon-actions'
// import React from 'react';
// import {IconButton, TextField} from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
//
//
// const meta: Meta<typeof AddItemForm> = {
//     title: 'TODOLISTS/AddItemForm',
//     component: AddItemForm,
//     tags: ['autodocs'],
//     argTypes: {
//         addItem: {
//             description: 'Button clicked inside form',
//             action: 'clicked'
//         }
//     },
// };
//
// export default meta;
// type Story = StoryObj<typeof AddItemForm>;
//
// export const AddItemFormStory: Story = {
//     args: {
//         addItem: action('Button clicked inside form'),// покажет что кнопка была нажата
//         label: 'Enter text'
//     }
// };
//
// export const AddItemFormErrorStory = {
//     render: () => {
//         return (
//             <div>
//                 <TextField onChange={() => {
//                     alert('onChange')}} value={''} onKeyDown={() => {}}
//                            error={true} size={'small'} onBlur={() => {}}
//                            label={'Error: Enter the correct value!'}
//                            focused={true}/>
//                 <IconButton onClick={() => {}} size={'small'} disabled={true}
//                             style={{}}><AddIcon/></IconButton>
//             </div>
//         )
//     }
// }
