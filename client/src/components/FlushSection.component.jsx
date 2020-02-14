import React, { useState } from 'react';
import Flush from './Flush.component';

//Actions
import { postFlush } from '../actions/flushActions';

//Mui
import Paper from '@material-ui/core/Paper';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';
import MoodIcon from '@material-ui/icons/Mood';
import IconButton from '@material-ui/core/IconButton';
import { Avatar, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    writeFlush: {
        width: '100%',
        minHeight: '12vh',
        marginBottom: theme.spacing(2),
        borderRadius: '0',
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
        width:'100%',
    }
}))



const FlushSection = ({ data, user, flushDispatch, setTab }) => {
    setTab('Home');
    //Hooks
    const classes = useStyles();
    const [text, setText] = useState('');
    const [image, setImage] = useState(null);

    //Helper Functions
    const handlePostFlush = () => {
        if (text) {
            postFlush(text, flushDispatch);
            setText('');
        }
    }

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    }

    return (
        <div className={classes.bg}>
            <Paper className={classes.writeFlush}>
                <div className={classes.upper}>
                    <Avatar src={user.credentials.imageUrl} className={classes.avatar} />
                    <form style={{ width: '100%' }}>
                        <TextareaAutosize value={text} onChange={(e) => setText(e.target.value)} placeholder="What's happening?..." className={classes.flushText} />
                    </form>
                </div>
                {image && <img className={classes.media} src={`${URL.createObjectURL(image)}`} alt="content"/>}
                <div className={classes.lower}>
                    <div>
                        <IconButton onClick={() => document.getElementById('imageInput').click()} size='small' color='primary'>
                            <InsertPhotoIcon />
                            <input type="file" hidden='hidden' id='imageInput' onChange={handleImageChange} />
                        </IconButton>
                        <IconButton size='small' color='primary'>
                            <MoodIcon />
                        </IconButton>
                    </div>
                    <Button onClick={handlePostFlush} variant='contained' color='primary'>Flush</Button>
                </div>
            </Paper>
            {data.map(flush => <Flush data={flush} key={flush.flushID} />)}
        </div>
    )
};

export default FlushSection;