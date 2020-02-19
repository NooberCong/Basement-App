import React, { useState } from 'react';
import dayjs from 'dayjs';
import queryString from 'query-string';
import { useHistory } from 'react-router-dom';


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
        alignItems: 'flex-start'
    },
    avatar: {
        height: 52,
        width: 52
    },
    flushLink: {
        flexGrow: 1
    },
    content: {
        width: '100%',
        margin: '0 8px',
        color: '#000'
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

const Notification = ({ notif, flushDispatch }) => {
    //Hooks
    const history = useHistory();

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
    const goToFlush = () => {
        const query = {};
        if (notif.commentID) query.commentID = notif.commentID;
        if (notif.replyID) query.replyID = notif.replyID;
        history.push(`/flushes/${notif.flushID}${Object.keys(query).length > 0 ? `?${queryString.stringify(query)}`: ''}`);
    }
    //Hooks
    const classes = useStyles();
    const [anchorEl, setAnchor] = useState(null);

    return (
        <div className={classes.main}>
            <div className={classes.avatarContainer}>
                <Avatar src={notif.imageUrl} className={classes.avatar} />
                {notif.type.match(/like/) ? <FavoriteIcon className={classes.typeIcon} style={{ color: '#fc5c65' }} /> : <ChatBubbleIcon className={classes.typeIcon} color='primary' />}
            </div>
            <div onClick={goToFlush} className={classes.content}>
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