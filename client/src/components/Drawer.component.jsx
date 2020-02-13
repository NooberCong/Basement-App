import React, { useState } from 'react';
import {Link } from 'react-router-dom';

//Mui
import HomeIcon from '@material-ui/icons/Home';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ChatIcon from '@material-ui/icons/Chat';
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import FavoriteIcon from '@material-ui/icons/Favorite';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import MoreHorizRoundedIcon from '@material-ui/icons/MoreHorizRounded';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: 240,
            flexShrink: 0,
        },
    },
    toolbar: {
        height: '64px',
        display: 'flex',
        alignItems: 'center'
    },
    drawerPaper: {
        width: 240,
    },
    brandLogo: {
        width: '32px',
        height: '32px',
        backgroundColor: '#fff',
        margin: 'auto'
    },
    logo: {
        width: '100%',
        height: '100%'
    }
}));

const getPath = (s) => {
    switch(s){
        case 'Home': return '/';
        case 'Notifications': return '/notifications';
        case 'Messages': return '/messages';
        case 'Profile': return '/profile';
        case 'Liked': return '/favorites';
        case 'Top Flushes': return '/trending';
        default: return '/'

    }
}

const AppDrawer = ({ mobile, toggleMobile }) => {
    const [tab, setTab] = useState(0);
    const classes = useStyles();
    const drawer = (
        <div>
            <div className={classes.toolbar}>
                <Avatar className={classes.brandLogo} variant='square'>
                    <img src='https://activearts.files.wordpress.com/2014/10/the-butterfly-effect-logo-light-blue-298.jpg' className={classes.logo} alt='logo' />
                </Avatar>
            </div>
            <Divider />
            <List disablePadding>
                {['Home', 'Notifications', 'Messages', 'Profile'].map((text, index) => (
                    <ListItem onClick={() => setTab(index)} selected={tab === index} button key={text} component={Link} to={getPath(text)}>
                        <ListItemIcon>{[<HomeIcon />, <NotificationsIcon />, <ChatIcon />, <AccountCircleRoundedIcon />][index]}</ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List disablePadding>
                {['Liked', 'Top Flushes', 'More'].map((text, index) => (
                    <ListItem onClick={() => setTab(index + 4)} selected={tab === index + 4} button key={text} component={Link} to={getPath(text)}>
                        <ListItemIcon>{[<FavoriteIcon />, <TrendingUpIcon />, <MoreHorizRoundedIcon />][index]}</ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
        </div>
    );

    
    return (
        <nav className={classes.drawer} aria-label="mailbox folders">
            {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
            <Hidden smUp implementation="css">
                <Drawer
                    variant="temporary"
                    anchor={'left'}
                    open={mobile}
                    onClose={toggleMobile}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                >
                    {drawer}
                </Drawer>
            </Hidden>
            <Hidden xsDown implementation="css">
                <Drawer
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    variant="permanent"
                    open
                >
                    {drawer}
                </Drawer>
            </Hidden>
        </nav>
    )
}

export default AppDrawer;