import type {Meta, StoryObj} from '@storybook/react';
import React from 'react';
import {EditableSpan} from './EditableSpan';
import {action} from '@storybook/addon-actions';


//Storybook - это инструмент для разработки и тестирования компонентов пользовательского интерфейса (UI) в изоляции от основного приложения. С помощью Storybook вы можете создавать и демонстрировать компоненты UI, чтобы убедиться, что они работают правильно, и протестировать их в разных контекстах и состояниях.
//1. meta date
const meta: Meta<typeof EditableSpan> = {
    title: 'TODOLISTS/EditableSpan',
    component: EditableSpan,
    tags: ['autodocs'],
    argTypes: {
        title: {
            description: 'Start value empty string. Set start value'
        },
        changeTitle: {
            description: 'Set new value'
        }
    },
    args: {
        title: 'Default value',
        changeTitle: action('Change value EditableSpan')
    }
};

export default meta;
type Story = StoryObj<typeof EditableSpan>;


export const EditableSpanStory: Story = {};

export const EditableSpanActiveStory: Story = {};


// export const AddItemFormErrorStory = {
//
//     render: () => {
//         return (
//             <div>
//
//             </div>
//         )
//     }
// }


