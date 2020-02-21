import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

//Mui
import { makeStyles } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import HomeIcon from '@material-ui/icons/Home';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100vw',
        position: 'fixed',
        bottom: -1
    },
    notifContainer: {
        position: 'relative'
    },
    unread: {
        position: 'absolute',
        padding: '2px 6px',
        borderRadius: '6px',
        backgroundColor: '#ff3838',
        top: '50%',
        left: '50%',
        transform: 'translateY(-100%)',
        color: '#fff'
    }
}));

const BottomNav = ({ unread }) => {
    const classes = useStyles();
    const [value, setValue] = useState(0);
    const history = useHistory();
    return (
        <Hidden smUp>
            <BottomNavigation
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                    history.push(`${['/', '/profile', '/notifications'][newValue]}`);
                }}
                showLabels
                className={classes.root}
            >
                <BottomNavigationAction label="Home" icon={<HomeIcon />} />
                <BottomNavigationAction label="Profile" icon={<AccountCircleIcon />} />
                <BottomNavigationAction label="Notifications" icon={
                    <div className={classes.notifContainer}>
                        <NotificationsIcon />
                        {unread > 0 && 
                        <div className={classes.unread}>
                            {unread}
                        </div>}
                    </div>} />
            </BottomNavigation>
        </Hidden>
    )
}

export default BottomNav;