import type {Meta} from '@storybook/react';
import React from 'react';
import {Task} from './Task';
import {Provider, useSelector} from 'react-redux';
import {ReduxStoreProviderDecorator, storyBookStore} from '../../../../stories/decorators/ReduxStoreProviderDecorator';
import {action} from '@storybook/addon-actions';
import {TaskEntityStatus, TaskPriorities, TaskStatuses, TaskType} from '../../../../api/types';
import {AppRootStateType} from '../../../../utils/types';

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
          entityStatus={1}
            task={task ? task : {
                id: 'Default',
                title: 'Default',
                status: TaskStatuses.New,
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: '',
                order: 0,
                addedDate: '',
                entityStatus: TaskEntityStatus.Expectation

            }}
        />
    );
};







