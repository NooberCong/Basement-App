import React from 'react';
import Notification from './Notification.component';

//Mui
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    container: {
        width: '100%'
    }
}));

const Notifications = ({ data, setTab }) => {
    setTab('Notifications');
    //Hooks
    const classes = useStyles();

    return (
        <div className={classes.container}>
            {data.map((notif, i) => <Notification key={i} notif={notif} />)}
        </div>
    )
}

export default Notifications;