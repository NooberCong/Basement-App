import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import Flush from './Flush.component';


//Actions
import { freeUserFlushes, getUserFlushes } from '../actions/flushActions';
import {  getOtherUserDetails, freeOtherUserDetails } from '../actions/userActions';

//Mui
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Avatar, Link, IconButton } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import RoomIcon from '@material-ui/icons/Room';
import LanguageIcon from '@material-ui/icons/Language';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import Toolbar from '@material-ui/core/Toolbar';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ChatIcon from '@material-ui/icons/Chat';

const useStyles = makeStyles(theme => ({
    container: {
        paddingTop: '3vh',
        width: '100%',
        position: 'relative',
        textAlign: 'center',
        paddingBottom: theme.spacing(2)
    },
    name: {
        fontWeight: 'bold',
    },
    bg: {
        top: 0,
        position: 'absolute',
        width: '100%',
        height: '15vh',
        maxHeight: '120px',
        backgroundImage: 'url(https://demo.geekslabs.com/materialize/v2.1/layout03/images/user-profile-bg.jpg)',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
    },
    avatar: {
        margin: 'auto',
        height: 128,
        width: 128,
        zIndex: 1,
    },
    icon: {
        transform: 'translateY(20%)',
        margin: theme.spacing(0, 1)
    },
    toolbar: {
        width: '100%',
        marginTop: theme.spacing(2),
        margin: 'auto',
        display: 'flex',
        justifyContent: 'space-around',
        padding: 0,
        [theme.breakpoints.up("sm")]: {
            width: '70%'
        }
    },
    details: {
        padding: '1vh'
    },
    toolbarBtn: {
        backgroundColor: '#ecf0f1',
        '&:hover': {
            opacity: '0.9',
            backgroundColor: '#ecf0f1'
        },
        padding: theme.spacing(1)
    },
    black: {
        color: '#000'
    },
    flushContainer: {
        backgroundColor: '#f0f0f0',
        margintop: theme.spacing(1)
    }
}));



const OtherProfile = ({ user, credentials, userDispatch, flushDispatch, flushes, setTab }) => {
    setTab(credentials.username);

    //Hooks
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const { username } = useParams();

    useEffect(() => {
        const getFlushes = () => {
            if (user.authenticated) getUserFlushes(username, flushDispatch);
            else setTimeout(getFlushes, 500);
        }
        getFlushes();
        getOtherUserDetails(username, userDispatch);
        return () => {
            freeUserFlushes(flushDispatch);
            freeOtherUserDetails(userDispatch);
        };
    }, [username, userDispatch, user.authenticated, flushDispatch]);

    //Helper Functions

    const handleMenuOpen = (e) => {
        setAnchorEl(e.currentTarget);
    }
    const handleMenuClose = () => {
        setAnchorEl(null);
    }

    return (
        <>
            <div className={classes.container}>
                <div className={classes.bg} />
                <a data-fancybox href={credentials.imageUrl}>
                    <Avatar src={credentials.imageUrl} className={classes.avatar} />
                </a>
                <Typography variant='h5' className={classes.name}>
                    {credentials.username}
                    <CheckCircleIcon className={classes.icon} color='primary' />
                </Typography>
                <Toolbar className={classes.toolbar}>
                    <div>
                        <IconButton className={classes.toolbarBtn}>
                            <ChatIcon color='primary' />
                        </IconButton>
                        <Typography variant='subtitle2'>Message</Typography>
                    </div>
                    <div>
                        <IconButton className={classes.toolbarBtn}>
                            <PersonAddIcon className={classes.black} />
                        </IconButton>
                        <Typography variant='subtitle2'>Follow</Typography>
                    </div>
                    <div>
                        <IconButton className={classes.toolbarBtn} onClick={handleMenuOpen}>
                            <MoreHorizIcon className={classes.black} />
                        </IconButton>
                        <Typography variant='subtitle2'>More</Typography>
                        <Menu
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={handleMenuClose}>Copy Profile Link</MenuItem>
                            <MenuItem onClick={handleMenuClose}>Report this user</MenuItem>
                            <MenuItem onClick={handleMenuClose}>Block</MenuItem>
                        </Menu>
                    </div>
                </Toolbar>
                <div className={classes.details}>
                    <Typography>{credentials.bio}</Typography>
                    <Typography>
                        <RoomIcon className={classes.icon} color='secondary' />
                        {credentials.location}
                    </Typography>
                    <Link href={credentials.website} target='_blank' >
                        <LanguageIcon className={classes.icon} color='secondary' />
                        {credentials.website}
                    </Link>
                    <Typography>
                        <CalendarTodayIcon className={classes.icon} color='secondary' />
                        Joined on {dayjs(credentials.created).format('MMM YYYY')}
                    </Typography>
                </div>
            </div>
            <div className={classes.flushContainer}>
                {flushes.map(flush => <Flush data={flush} key={flush.flushID} />)}
            </div>
        </>
    )
}

export default OtherProfile