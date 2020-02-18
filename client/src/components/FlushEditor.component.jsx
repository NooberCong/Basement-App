import React, { useState } from 'react';
import { isEmpty } from '../util/validators';

//Actions
import { postFlush, updateFlush } from '../actions/flushActions';

//Mui
import Paper from '@material-ui/core/Paper';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import { Avatar, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    writeFlush: {
        width: '100%',
        minHeight: '12vh',
        marginBottom: theme.spacing(2),
        borderRadius: '0',
        [theme.breakpoints.down('xs')]: {
            minWidth: '80vw'
        }
    },
    avatar: {
        alignSelf: 'flex-start',
        backgroundColor: '#f0f0f0'
    },
    avatarImg: {
        width: '100%',
        height: 'auto'
    },
    upper: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        padding: theme.spacing(2, 2, 1, 2)
    },
    flushText: {
        height: '2rem',
        marginLeft: theme.spacing(2),
        border: 'none',
        outline: 'none',
        width: 'calc(100% - 40px)',
        resize: 'none',
        fontFamily: 'sans-serif',
        fontSize: theme.spacing(2)
    },
    lower: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: theme.spacing(1, 2, 2, 2)
    },
    bg: {
        backgroundColor: '#f0f0f0'
    },
    media: {
        height: 'auto',
        width: '100%',
    },
    imgContainer: {
        width: '100%',
        height: 'auto',
        position: 'relative'
    },
    clearBtn: {
        position: 'absolute',
        top: 0,
        right: 0,
        color: '#fff'
    }
}));

const FlushEditor = ({ flush, flushDispatch, user, close }) => {
    const isEdit = !isEmpty(flush);
    //Hooks
    const classes = useStyles();
    const [text, setText] = useState(flush.text ? flush.text : '');
    const [file, setFile] = useState(flush.photoUrl ? flush.photoUrl : '');

    //Helper Functions
    const handleSubmit = () => {
        if (text || file) {
            if (isEmpty(flush)) {
                postFlush(text.replace(/\n/g, '<newLine>'), flushDispatch, file);
            }
            else {
                updateFlush({ text: text.replace(/\n/g, '<newLine>'), file }, flushDispatch, flush.flushID, flush.photoUrl);
            }
            setText('');
            setFile(null);
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (['jpg', 'jpeg', 'png'].includes(file.name.split('.')[file.name.split('.').length - 1])) {
            setFile(e.target.files[0]);
        };
    }

    return (
        <Paper elevation={isEdit ? 0 : 1} className={classes.writeFlush}>
            <div className={classes.upper}>
                <Avatar src={user.credentials.imageUrl} className={classes.avatar} />
                <form style={{ width: '100%' }}>
                    <TextareaAutosize autoFocus value={text} onChange={(e) => setText(e.target.value)} placeholder="What's happening?..." className={classes.flushText} />
                </form>
            </div>
            {file &&
                <div className={classes.imgContainer}>
                    <img className={classes.media} src={typeof file === "string" ? file : URL.createObjectURL(file)} alt="content" />
                    <IconButton onClick={() => {
                        setFile('');
                    }} className={classes.clearBtn}>
                        <ClearIcon />
                    </IconButton>
                </div>
            }
            <div className={classes.lower}>
                <div>
                    <Tooltip title='Insert Image' placement='top'>
                        <IconButton onClick={() => {
                            document.getElementById(isEdit ? 'editImgInput' : 'uploadImgInput').click();
                            setFile('');
                        }} size='small' color='primary'>
                            <InsertPhotoIcon />
                            <input type="file" hidden='hidden' id={isEdit ? 'editImgInput' : 'uploadImgInput'} onChange={handleImageChange} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title='Insert Emoji' placement='top'>
                        <IconButton size='small'>
                            <EmojiEmotionsIcon color='primary' />
                        </IconButton>
                    </Tooltip>
                </div>
                <div>
                    {isEdit &&
                        <Button onClick={close} color='primary'>Cancel</Button>}
                    <Button onClick={() => {
                        handleSubmit();
                        if (isEdit) close();
                    }} variant={isEdit ? 'text' : 'contained'} color='primary'>{isEdit ? 'Save' : 'Flush'}</Button>
                </div>
            </div>
        </Paper>
    )
}

export default FlushEditor;