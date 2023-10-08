import type {Meta, StoryObj} from '@storybook/react';
import React from 'react';
import App from './App';
import {ReduxStoreProviderDecorator} from '../stories/decorators/ReduxStoreProviderDecorator';

//Storybook - это инструмент для разработки и тестирования компонентов пользовательского интерфейса (UI) в изоляции от основного приложения. С помощью Storybook вы можете создавать и демонстрировать компоненты UI, чтобы убедиться, что они работают правильно, и протестировать их в разных контекстах и состояниях.
//1. meta date
const meta: Meta<typeof App> = {
    title: 'TODOLISTS/App',
    component: App,
    tags: ['autodocs'],
    decorators: [ReduxStoreProviderDecorator],
};

export default meta;
type Story = StoryObj<typeof App>;


export const AppStory: Story = {};



