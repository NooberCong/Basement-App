import React, { useState } from 'react';
import dayjs from 'dayjs';

//Mui
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import IconButton from '@material-ui/core/IconButton';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles(theme => ({
    main: {
        width: '100%',
        padding: '16px 16px',
        display: 'flex',
        alignItems: 'flex-start',
    },
    avatar: {
        height: 52,
        width: 52
    },
    content: {
        margin: '0 8px'
    },
    avatarContainer: {
        position: 'relative'
    },
    typeIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        transform: 'translate(20%, 20%)'
    },
    name: {
        fontSize: '16px',
        fontWeight: 'bold'
    },
    action: {
        fontSize: '16px'
    }
}));

const Notification = ({ notif }) => {

    //Helper functions
    const handleNotifMessage = (type) => {
        if (type.match(/like/)) {
            switch (type) {
                case 'flush like':
                    return 'liked your flush'
                case 'comment like':
                case 'reply like':
                    return 'liked your comment'
                default:
                    throw Error('Type unknown');
            }
        }
        else if (type === 'comment') {
            return 'commented on your flush'
        }
        else {
            return 'replied to your comment'
        }
    }

    //Hooks
    const classes = useStyles();
    const [anchorEl, setAnchor] = useState(null);

    return (
        <div className={classes.main}>
            <div className={classes.avatarContainer}>
                <Avatar src={notif.imageUrl} className={classes.avatar} />
                {notif.type.match(/like/)? <FavoriteIcon className={classes.typeIcon} style={{color: '#fc5c65'}} /> : <ChatBubbleIcon className={classes.typeIcon} color='primary' />}
            </div>
            <div className={classes.content}>
                <Typography className={classes.name} component='span'>{notif.from}</Typography>
                <Typography className={classes.action} component='span'>
                    {' '}{handleNotifMessage(notif.type)}
                </Typography>
                <Typography variant='subtitle2' color='textSecondary'>{dayjs(notif.created).format('MM-DD HH:mm')}</Typography>
            </div>
            <IconButton onClick={(e) => setAnchor(e.currentTarget)} aria-label="settings">
                <MoreHorizIcon />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={() => setAnchor(null)}
            >
                <MenuItem onClick={() => {
                    setAnchor(null);
                }}>Delete</MenuItem>
            </Menu>
        </div>
    )
}

export default Notification;