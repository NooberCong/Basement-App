import React, { useState } from 'react';
import { postFlush } from '../actions/flushActions';
import { isEmpty } from '../util/validators';

//Mui
import Paper from '@material-ui/core/Paper';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';
import MoodIcon from '@material-ui/icons/Mood';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import { Avatar, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    writeFlush: {
        width: '100%',
        minHeight: '12vh',
        marginBottom: theme.spacing(2),
        borderRadius: '0'
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
        fontFamily: 'sans-serif'
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

const FlushEditor = ({ flush, flushDispatch, user, cancel }) => {
    const isEdit = !isEmpty(flush);
    //Hooks
    const classes = useStyles();
    const [text, setText] = useState(flush.text ? flush.text : '');
    
    const [image, setImage] = useState(flush.photoUrl ? flush.photoUrl : null);

    //Helper Functions
    const handleSubmit = () => {
        if (text) {
            if (isEmpty(flush)) {
                postFlush(text, flushDispatch, image);
            }
            else {
                //patchFlush(text, flushDispatch, image);
            }
            setText('');
            setImage(null);
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (['jpg', 'jpeg', 'png'].includes(file.name.split('.')[file.name.split('.').length - 1])) setImage(URL.createObjectURL(e.target.files[0]));
    }

    return (
        <Paper elevation={isEdit? 0: 1} className={classes.writeFlush}>
            <div className={classes.upper}>
                <Avatar src={user.credentials.imageUrl} className={classes.avatar} />
                <form style={{ width: '100%' }}>
                    <TextareaAutosize value={text} onChange={(e) => setText(e.target.value)} placeholder="What's happening?..." className={classes.flushText} />
                </form>
            </div>
            {image &&
                <div className={classes.imgContainer}>
                    <img className={classes.media} src={image} alt="content" />
                    <IconButton onClick={() => setImage(null)} className={classes.clearBtn}>
                        <ClearIcon />
                    </IconButton>
                </div>
            }
            <div className={classes.lower}>
                <div>
                    <IconButton onClick={() => {
                        document.getElementById(isEdit? 'editImgInput': 'uploadImgInput').click();
                        setImage(null);
                        }} size='small' color='primary'>
                        <InsertPhotoIcon />
                        <input type="file" hidden='hidden' id={isEdit? 'editImgInput': 'uploadImgInput'} onChange={handleImageChange} />
                    </IconButton>
                    <IconButton size='small' color='primary'>
                        <MoodIcon />
                    </IconButton>
                </div>
                <div>
                    {isEdit &&
                    <Button onClick={cancel} color='primary'>Cancel</Button>}
                    <Button onClick={handleSubmit} variant={isEdit ? 'text' : 'contained'} color='primary'>{isEdit ? 'Save' : 'Flush'}</Button>
                </div>
            </div>
        </Paper>
    )
}

export default FlushEditor;