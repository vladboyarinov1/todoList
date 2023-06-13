import type {Meta} from '@storybook/react';
import React from 'react';
import {Task} from './Task';
import {Provider, useSelector} from 'react-redux';
import {AppRootStateType} from '../../../store/store';
import {TaskType} from '../../../App/App';
import {ReduxStoreProviderDecorator, storyBookStore} from '../../../store/decorators/ReduxStoreProviderDecorator';
import {action} from '@storybook/addon-actions';

const meta: Meta<typeof Task> = {
    title: 'TODOLISTS/Task',
    component: Task,
    tags: ['autodocs'],
    args: {
        removeTask: action('Task was remove')
    },
    decorators: [
        (Story) => (
            <Provider store={storyBookStore}>
                <Story/>
            </Provider>
        ),
        ReduxStoreProviderDecorator,
    ],
} as Meta

export default meta;


// type Story = StoryObj<typeof Task>;

export const TaskStory = () => {
    const tasks = useSelector<AppRootStateType, TaskType[]>(state => state.tasks['todolistId1']);
    const task = tasks && tasks[0] ? tasks[0] : null;
    return (
        <Task
            todolistId={'todolistId1'}
            task={task ? task : {id: 'Default', title: 'Default', isDone: false}}
        />
    );
};







