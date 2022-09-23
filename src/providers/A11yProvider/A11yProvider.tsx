import React from 'react';
import { A11yStatusKeyboard } from '../A11yStatusKeyboard';
import { A11yStatusProvider } from '../A11yStatusProvider';
import { KeyboardProvider } from '../KeyboardProvider';

export const A11yProvider: React.FC = ({ children }) => {
    return <A11yStatusProvider>
        <A11yStatusKeyboard>
            <KeyboardProvider>
                {children}
            </KeyboardProvider>
        </A11yStatusKeyboard>
    </A11yStatusProvider>
}