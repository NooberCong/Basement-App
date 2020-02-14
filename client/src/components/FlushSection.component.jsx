import React from 'react';
import Flush from './Flush.component';
import FlushEditor from './FlushEditor.component';

const FlushSection = ({ data, user, flushDispatch, setTab }) => {
    setTab('Home');
    
    return (
        <div style={{backgroundColor: '#f0f0f0'}}>
            <FlushEditor flush={{}} flushDispatch={flushDispatch} user={user} />
            {data.map(flush => <Flush data={flush} key={flush.flushID} />)}
        </div>
    )
};

export default FlushSection;