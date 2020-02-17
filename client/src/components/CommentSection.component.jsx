import React, { useState } from 'react';
import Comment from './Comment.component';

//Actions
import { postComment, replyComment, getReplies } from '../actions/flushActions';

//Mui
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Tooltip from '@material-ui/core/Tooltip';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import Input from '@material-ui/core/Input';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    root: {
        padding: 0,
    },
    main: {
        minWidth: 600,
        height: '80vh',
        [theme.breakpoints.down('xs')]: {
            minWidth: '80vw'
        }
    },
    actionBar: {
        display: 'flex',
        justifyContent: 'flex-start',
    },
    commentText: {
        backgroundColor: '#f0f0f0',
        borderRadius: '8px',
        padding: '0 8px'
    }
}));

const CommentSection = ({ data, flushDispatch, open, close, user, flushID }) => {
    //Hooks
    const classes = useStyles();
    const [text, setText] = useState('');
    const [replyTo, setReplyTo] = useState(false);
    const [subject, setSubject] = useState('Comments');

    //Helper functions
    const handleComment = () => {
        if (text) {
            if (!replyTo) postComment({ username: user.username, text }, flushID, flushDispatch, user);
            else replyComment(text, replyTo, flushID, flushDispatch);
            setText('');
        }
    }

    const handleReplyReply = (comment, reply) => {
        setReplyTo(comment.commentID);
        setText(`${reply.username} `);
        setSubject(`Replying to ${reply.username}`);
    }

    const handleCommentReply = (comment) => {
        setReplyTo(comment.commentID);
        getReplies(comment.commentID, flushID, flushDispatch);
        setText(`${comment.username} `);
        setSubject(`Replying to ${comment.username}`);
    }

    const handleViewReplies = (comment) => {
        getReplies(comment.commentID, flushID, flushDispatch);
    }

    return (
        <Dialog className={classes.root} open={open} onClose={() => {
            close();
            setReplyTo(false);
            }} aria-labelledby="form-dialog-title">
            <DialogTitle>
                {replyTo &&
                    <IconButton onClick={() => {
                        setReplyTo(null);
                        setText('');
                        setSubject('Comment');
                    }}>
                        <ArrowBackIcon />
                    </IconButton>
                }{' '}
                {subject}
            </DialogTitle>
            <DialogContent className={classes.main}>
                {data.map((comment, i) => <Comment specific={!replyTo || replyTo === comment.commentID} viewReplies={() => handleViewReplies(comment)} replyToReply={(reply) => handleReplyReply(comment, reply)} replyToComment={() => handleCommentReply(comment)} flushDispatch={flushDispatch} flushID={flushID} key={`${comment.flushID}cmt${i}`} data={comment} />)}
            </DialogContent>
            <DialogActions className={classes.actionBar}>
                <Tooltip title='Insert Emoji' placement='top'>
                    <IconButton>
                        <EmojiEmotionsIcon color='primary' />
                    </IconButton>
                </Tooltip>
                <Input
                    className={classes.commentText}
                    disableUnderline
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    endAdornment={<InputAdornment position="end"><Tooltip title='Send' placement='top'><IconButton onClick={handleComment} size='small'><SendIcon color='primary' /></IconButton></Tooltip></InputAdornment>}
                    fullWidth />
            </DialogActions>
        </Dialog>
    )
}

export default CommentSection;