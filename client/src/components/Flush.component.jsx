import React, { useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import FlushEditor from '../components/FlushEditor.component';

//Actions
import { likeFlush, unlikeFlush, deleteFlush } from '../actions/flushActions';

//Hooks
import { useUser } from '../context/userContext';
import { useFlush } from '../context/flushContext';

//Mui
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import CardMedia from '@material-ui/core/CardMedia';
import ShareIcon from '@material-ui/icons/Share';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';

dayjs.extend(relativeTime);
const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        borderRadius: '0',
        marginBottom: 2
    },
    media: {
        height: 0,
        paddingTop: '56.25%'
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: '#f0f0f0',
    },
    avatarImg: {
        width: '100%',
        height: 'auto'
    },
    interactionBtn: {
        display: 'flex',
        alignItems: 'center',
        marginRight: theme.spacing(1)
    },
    likeBtn: {
        '&:hover': {
            color: '#e55039',
            backgroundColor: '#f5d3d3',
        },
        marginRight: '5px'
    },
    btn: {
        '&:hover': {
            backgroundColor: '#cce8e8',
            color: '#03a9f4'
        },
        marginRight: '5px'
    },
    diagContentText: {
        padding: theme.spacing(2, 3)
    },
    content: {
        padding: theme.spacing(0, 2, 2, 2)
    }
}));



const Flush = ({ data }) => {
    //Hooks
    const classes = useStyles();
    const [user, userDispatch] = useUser();
    const [anchorEl, setAnchor] = useState(null);
    const [diagOpen, setDiagOpen] = useState(false);
    const flushDispatch = useFlush()[1];

    //Helper Functions
    const handleLikeBtn = (flushID) => {
        if (!user.likes.filter(like => like.flushID === flushID).length) likeFlush(flushID, userDispatch, flushDispatch);
        else unlikeFlush(flushID, userDispatch, flushDispatch);
    }

    const handleMenuOpen = (e) => {
        setAnchor(e.currentTarget);
    }

    const handleMenuClose = () => {
        setAnchor(null);
    }

    const handleDeleteFlush = (flushID) => {
        deleteFlush(flushID, userDispatch, flushDispatch);
    }

    const handleDiagClose = () => setDiagOpen('');

    return (
        <Card className={classes.root}>
            <CardHeader
                avatar={
                    <Avatar src={data.imageUrl} className={classes.avatar} />
                }
                action={
                    data.user === user.credentials.username &&
                    <>
                        <IconButton onClick={handleMenuOpen} aria-label="settings">
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
                                setDiagOpen('Delete');
                            }}>Delete</MenuItem>
                        </Menu>
                        <Dialog className={classes.diag} open={Boolean(diagOpen)} onClose={handleDiagClose} aria-labelledby="form-dialog-title">
                            {diagOpen && <DialogTitle id="form-dialog-title">{diagOpen === 'Delete'? 'Confirm Delete': 'Edit Flush'}</DialogTitle>}
                            {diagOpen === 'Delete'?
                                <>
                                    <DialogContentText className={classes.diagContentText}>Are you sure you want to delete this flush?</DialogContentText>
                                    <DialogActions>
                                        <Button onClick={handleDiagClose} color="primary">
                                            Cancel
                                        </Button>
                                        <Button onClick={(e) => {
                                            handleDiagClose();
                                            handleDeleteFlush(data.flushID);
                                        }} style={{ color: '#e55039' }}>
                                            Delete
                                        </Button>
                                    </DialogActions>
                                </>: diagOpen === 'Edit'?
                                <FlushEditor flush={data} flushDispatch={flushDispatch} user={user} cancel={handleDiagClose} /> : <></>
                            }
                        </Dialog>
                    </>
                }
                title={data.user}
                subheader={dayjs(data.created).fromNow()}
            />
            <CardContent className={classes.content}>
                <Typography variant="body2" color="textPrimary" component="p">
                    {data.text}
                </Typography>
            </CardContent>
            {data.photoUrl &&
                <CardMedia
                    className={classes.media}
                    image={`${data.photoUrl}`}
                />}
            <CardActions disableSpacing>
                <div className={classes.interactionBtn}>
                    <IconButton className={classes.btn} size='small' aria-label="comments">
                        <ChatBubbleOutlineIcon />
                    </IconButton>
                    <Typography variant='subtitle2' color='textSecondary'>{data.commentCount}</Typography>
                </div>
                <div className={classes.interactionBtn}>
                    <IconButton size='small' className={classes.likeBtn} onClick={() => handleLikeBtn(data.flushID)} aria-label="add to favorites">
                        {user.likes.filter(like => like.flushID === data.flushID).length ? (<FavoriteIcon style={{ color: '#fc5c65' }} />) : (<FavoriteBorderIcon className={classes.likeIcon} />)}
                    </IconButton>
                    <Typography variant='subtitle2' color='textSecondary'>{data.likeCount}</Typography>
                </div>
                <IconButton className={classes.btn} size='small' aria-label="share">
                    <ShareIcon />
                </IconButton>
            </CardActions>
        </Card>
    );
}

export default Flush;