import React, { useState } from 'react';
import Flush from './Flush.component';

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
        padding: theme.spacing(2),
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
        width: '100%'
    },
    flushText: {
        height: '2rem',
        marginLeft: theme.spacing(2),
        border: 'none',
        outline: 'none',
        width: 'calc(100% - 40px)',
        resize: 'none'
    },
    lower: {
        display: 'flex',
        marginTop: theme.spacing(2),
        justifyContent: 'space-between'
    },
    bg: {
        backgroundColor: '#f0f0f0'
    }
}))



const FlushSection = ({ data, user }) => {
    const classes = useStyles();
    const [text, setText] = useState('');

    return (
        <div className={classes.bg}>
            <Paper className={classes.writeFlush}>
                <div className={classes.upper}>
                    <Avatar src={user.credentials.imageUrl} className={classes.avatar} />
                    <form style={{ width: '100%' }}>
                        <TextareaAutosize value={text} onChange={(e) => setText(e.target.value)} placeholder="What's happening?..." className={classes.flushText} />
                    </form>
                </div>
                <div className={classes.lower}>
                    <div>
                        <IconButton size='small' color='primary'>
                            <InsertPhotoIcon />
                        </IconButton>
                        <IconButton size='small' color='primary'>
                            <MoodIcon />
                        </IconButton>
                    </div>
                    <Button variant='contained' color='primary'>Flush</Button>
                </div>
            </Paper>
            {data.map(flush => <Flush data={flush} key={flush.flushID} />)}
        </div>
    )
};

export default FlushSection;