import React from 'react';
import Flush from './Flush.component';
import FlushEditor from './FlushEditor.component';
import FlushSkeleton from './FlushSkeleton.component';

console.log('Flush section rerendering')

const FlushSection = ({ data, user, flushDispatch, setTab }) => {
    setTab('Home');

    return (
        <div style={{ backgroundColor: '#f0f0f0' }}>
            <FlushEditor flush={{}} flushDispatch={flushDispatch} user={user} />
            {data.length > 0 ? data.map(flush => <Flush data={flush} key={flush.flushID} />) :
                <>
                    <FlushSkeleton />
                    <FlushSkeleton />
                    <FlushSkeleton />
                </>
            }
        </div>
    )
};

export default FlushSection;