import React, { useEffect } from 'react';
import Notification from './Notification.component';

//Actions
import { markAsRead } from '../actions/userActions';

//Mui
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    container: {
        width: '100%'
    }
}));

const Notifications = ({ data, setTab, userDispatch, flushDispatch }) => {
    setTab('Notifications');
    //Hooks
    useEffect(() => {
        if (data.some(notif => !notif.read)) markAsRead(data.filter(notif => !notif.read).map(notif => notif.notifID), userDispatch);
    }, [data, userDispatch]);
    const classes = useStyles();

    return (
        <div className={classes.container}>
            {data.map((notif, i) => <Notification key={i} flushDispatch={flushDispatch} notif={notif} />)}
        </div>
    )
}

export default Notifications;