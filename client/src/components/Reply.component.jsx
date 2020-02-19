import React, { useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

//Actions
import { likeReply, unlikeReply, deleteReply, updateReply } from '../actions/flushActions';

//Mui
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Menu from '@material-ui/core/Menu';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';


dayjs.extend(relativeTime);

const useStyles = makeStyles(theme => ({
    root: {
        marginLeft: theme.spacing(6),
        marginTop: '4px',
        display: 'flex',
        alignItems: 'center'
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    noVertPadding: {
        padding: '0 16px 0'
    },
    flex: {
        display: 'flex',
        alignItems: 'center'
    },
    interaction: {
        cursor: 'pointer',
        margin: theme.spacing(0, 1, 0),
        fontWeight: 'bold'
    },
    content: {
        padding: theme.spacing(1),
        backgroundColor: '#f0f0f0',
        borderRadius: '10px',
        margin: theme.spacing(0, 1),
        position: 'relative'
    },
    contentText: {
        wordBreak: 'break-word',
        maxWidth: 450,
        [theme.breakpoints.down('xs')]: {
            maxWidth: 300
        }
    },
    diagContentText: {
        padding: theme.spacing(2)
    },
    commentEditor: {
        display: 'flex',
        padding: theme.spacing(2)
    },
    editor: {
        minWidth: '30vw'
    },
    commentLikes: {
        padding: '2px',
        backgroundColor: '#fff',
        borderRadius: '20px',
        boxShadow: '2px 2px 3px rgba(0, 0, 0, 0.5)',
        position: 'absolute',
        bottom: 0,
        right: 0,
        transform: 'translate(80%, 30%)',
        display: 'flex',
        alignItems: 'center'
    }
}));

const Reply = ({ user, data, flushID, flushDispatch, reply }) => {
    const classes = useStyles();
    const [anchorEl, setAnchor] = useState(null);
    const [diagOpen, setDiagOpen] = useState(false);
    const [editText, setEditText] = useState(data.text);

    //Helper functions
    const handleMenuClose = () => setAnchor(null);

    const handleDiagClose = () => {
        setDiagOpen(false);
        setEditText('');
    };

    const handleLikeReply = () => {
        if (!data.likedByUser) likeReply(data.commentID, data.replyID, flushID, flushDispatch);
        else unlikeReply(data.commentID, data.replyID, flushID, flushDispatch);
    }

    const handleEditReply = () => {
        if (editText) updateReply(data.replyID, data.commentID, flushID, { text: editText }, flushDispatch);
    }

    return (
        <div className={classes.root}>
            <Avatar style={{ alignSelf: 'flex-start', width: 20, height: 20 }} src={data.imageUrl} />
            <div>
                <div className={classes.content}>
                    <Typography style={{ fontWeight: 'bold' }} variant='subtitle2' color='textPrimary'>{data.username}</Typography>
                    <Typography className={classes.contentText} variant="body2" color='textPrimary' component="p">
                        {data.text}
                    </Typography>
                    {data.likeCount > 0 &&
                        <div className={classes.commentLikes}>
                            <FavoriteIcon style={{ width: 16, height: 16, color: '#fc5c65' }} />
                            <Typography style={{ fontSize: '12px', marginLeft: '4px' }} color='textPrimary' variant='subtitle2'>{data.likeCount}</Typography>
                        </div>
                    }
                </div>
                <div className={classes.flex}>
                    <Typography style={{ margin: '0 8px 0' }} variant='subtitle2' color='textSecondary'>{dayjs(data.created).fromNow()}</Typography>
                    <Typography onClick={handleLikeReply} className={classes.interaction} variant='subtitle2' color={data.likedByUser ? 'primary' : 'textSecondary'}>Like</Typography>
                    <Typography onClick={() => reply(data)} className={classes.interaction} variant='subtitle2' color='textSecondary'>Reply</Typography>
                </div>
            </div>
            {data.username === user.credentials.username &&
                <>
                    <IconButton onClick={(e) => setAnchor(e.currentTarget)} style={{ height: '32px', transform: 'translateY(-40%)' }} size='small'>
                        <MoreHorizIcon />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem onClick={() => {
                            handleMenuClose();
                            setDiagOpen('Edit');
                        }}>Edit</MenuItem>
                        <MenuItem onClick={() => {
                            handleMenuClose();
                            setDiagOpen('Delete')
                        }}>Delete</MenuItem>
                    </Menu>
                    <Dialog open={Boolean(diagOpen)} onClose={() => setDiagOpen(false)}>
                        {diagOpen === 'Delete' ?
                            <>
                                <DialogTitle>{diagOpen}</DialogTitle>
                                <DialogContentText className={classes.diagContentText}>Are you sure you want to delete this comment?</DialogContentText>
                                <DialogActions>
                                    <Button onClick={handleDiagClose} color="primary">
                                        Cancel
                                    </Button>
                                    <Button onClick={(e) => {
                                        handleDiagClose();
                                        deleteReply(data.commentID, data.replyID, flushID, flushDispatch);
                                    }} style={{ color: '#e55039' }}>
                                        Delete
                                    </Button>
                                </DialogActions>
                            </>
                            : diagOpen === 'Edit' ?
                                <div className={classes.editor}>
                                    <DialogTitle>{diagOpen}</DialogTitle>
                                    <div>
                                        <div className={classes.commentEditor}>
                                            <Avatar style={{ marginRight: '8px' }} src={data.imageUrl} />
                                            <TextField value={editText} onChange={(e) => setEditText(e.target.value)} variant='outlined' autoFocus multiline fullWidth />
                                        </div>
                                        <DialogActions>
                                            <Button onClick={handleDiagClose} color="primary">
                                                Cancel
                                            </Button>
                                            <Button onClick={(e) => {
                                                handleDiagClose();
                                                handleEditReply()
                                            }} color='primary'>
                                                Save
                                            </Button>
                                        </DialogActions>
                                    </div>
                                </div> : ''
                        }
                    </Dialog>
                </>
            }
        </div>
    )
}

export default Reply;