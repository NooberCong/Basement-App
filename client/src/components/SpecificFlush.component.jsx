import React, { useEffect } from 'react';
import queryString from 'query-string';
import { useParams, useLocation } from 'react-router-dom';

import Flush from '../components/Flush.component';


//Actions
import { getSpecificFlush, freeSpecificFlush } from '../actions/flushActions';

const SpecificFlush = ({ specific, flushDispatch, user }) => {
    const { flushID } = useParams();
    const location = useLocation();
    const { commentID, replyID } = queryString.parse(location.search);
    useEffect(() => {
        const fetchFlush = () => {
            if (user.authenticated) getSpecificFlush(flushDispatch, flushID, commentID, replyID);
            else setTimeout(fetchFlush, 500);
        }
        fetchFlush();
        return () => freeSpecificFlush(flushDispatch);
    }, [flushDispatch, commentID, replyID, flushID, user.authenticated]);
    return (
        specific.text ? <Flush data={specific} /> : <p>Loading...</p>
    )
}

export default SpecificFlush;