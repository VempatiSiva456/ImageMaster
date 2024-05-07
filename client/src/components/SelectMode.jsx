import React, { useState } from 'react';
import Dashboard from './Dashboard';
import { Button } from '@mui/joy';

const SelectMode = () => {
    const [mode, setMode] = useState('private');  

    return (
        <div>
            <Button onClick={() => setMode('public')}>Show Public Images</Button>
            <Button onClick={() => setMode('private')}>Show Private Images</Button>
            <Dashboard mode={mode} />
        </div>
    );
};

export default SelectMode;
