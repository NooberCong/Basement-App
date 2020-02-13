import React from 'react';
import dayjs from 'dayjs';
import axios from 'axios';

//Mui
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Avatar, Link, IconButton } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import RoomIcon from '@material-ui/icons/Room';
import LanguageIcon from '@material-ui/icons/Language';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import Toolbar from '@material-ui/core/Toolbar';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import PeopleIcon from '@material-ui/icons/People';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useState } from 'react';

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
        transform: 'translateY(-100%)'
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
    stats: {
        display: 'flex',
        justifyContent: 'space-around',
        marginBottom: theme.spacing(1),
        backgroundColor: '#fff',
        borderTop: '1px solid #bdc3c7',
        borderBottom: '1px solid #bdc3c7'
    },
    stat: {
        height: '100%',
        cursor: 'pointer'
    },
    statistics: {
        fontWeight: 'bold'
    },
    icon: {
        transform: 'translateY(20%)',
        margin: theme.spacing(0, 1)
    },
    iconBtn: {
        transform: 'translate(100%, -80%)',
        backgroundColor: '#ecf0f1',
        zIndex: 2,
        '&:hover': {
            opacity: '0.9',
            backgroundColor: '#ecf0f1'
        },
        padding: theme.spacing(1)
    },
    toolbar: {
        width: '100%',
        transform: 'translateY(-20%)',
        margin: 'auto',
        display: 'flex',
        justifyContent: 'space-around',
        padding: 0,
        [theme.breakpoints.up("sm")]: {
            width: '70%'
        }
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
    }
}));

const Profile = ({ user, updateUser, setUnauthenticated }) => {
    //Hooks
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const [diagOpen, setDiagOpen] = useState(false);

    //Edit Details Input State
    const [bio, setBio] = useState(user.credentials.bio? user.credentials.bio: '');
    const [location, setLocation] = useState(user.credentials.location? user.credentials.location : '');
    const [website, setWebsite] = useState(user.credentials.website? user.credentials.website : '');

    //Helper Functions
    const handleImageChange = (e) => {
        const image = e.target.files[0];
        const formData = new FormData();
        formData.append('image', image, image.name);
        axios.post('/users/image', formData).then(() => {
            updateUser();
        })
            .catch(err => console.log(err));
    }
    const handleMenuOpen = (e) => {
        setAnchorEl(e.currentTarget);
    }
    const handleMenuClose = () => {
        setAnchorEl(null);
    }
    const handleDiagOpen = (e) => {
        setDiagOpen(true);
    }
    const handleDiagClose = () => {
        setDiagOpen(false);
    }
    const handleEdit = (e) => {
        e.preventDefault();
        axios.post('/users', {bio, location, website})
        .then(() => updateUser())
        .catch(err => console.log(err));
    }
    const handleLogOut = () => {
        localStorage.removeItem('idToken');
        setUnauthenticated();
    }

    return (
        <div className={classes.container}>
            <div className={classes.bg} />
            <Avatar src={user.credentials.imageUrl} className={classes.avatar} />
            <input type="file" hidden='hidden' id='imageInput' onChange={handleImageChange} />
            <IconButton size='small' onClick={() => document.getElementById('imageInput').click()} className={classes.iconBtn} >
                <CameraAltIcon className={classes.black} />
            </IconButton>
            <Typography variant='h5' className={classes.name}>
                {user.credentials.username}
                <CheckCircleIcon className={classes.icon} color='primary' />
            </Typography>
            <Toolbar className={classes.toolbar}>
                <div>
                    <IconButton className={classes.toolbarBtn}>
                        <AddIcon className={classes.black} />
                    </IconButton>
                    <Typography variant='subtitle2'>New Flush</Typography>
                </div>
                <div>
                    <IconButton className={classes.toolbarBtn} onClick={handleDiagOpen}>
                        <EditIcon className={classes.black} />
                    </IconButton>
                    <Typography variant='subtitle2'>Edit Profile</Typography>
                    <Dialog open={diagOpen} onClose={handleDiagClose} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">Edit Profile Details</DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Bio"
                                type="text"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                fullWidth
                            />
                            <TextField
                                margin="dense"
                                label="Location"
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                fullWidth
                            />
                            <TextField
                                margin="dense"
                                label="Personal/Professional Website"
                                type="text"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                fullWidth
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleDiagClose} color="primary">
                                Cancel
                        </Button>
                            <Button onClick={(e) => {
                                handleDiagClose();
                                handleEdit(e);
                                }} color="primary">
                                Save
                        </Button>
                        </DialogActions>
                    </Dialog>
                </div>
                <div>
                    <IconButton className={classes.toolbarBtn}>
                        <PeopleIcon className={classes.black} />
                    </IconButton>
                    <Typography variant='subtitle2'>Followers</Typography>
                </div>
                <div>
                    <IconButton className={classes.toolbarBtn} onClick={handleMenuOpen}>
                        <MoreHorizIcon className={classes.black} />
                    </IconButton>
                    <Typography variant='subtitle2'>More</Typography>
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
                        <MenuItem onClick={handleMenuClose}>My account</MenuItem>
                        <MenuItem onClick={() => {
                            handleMenuClose();
                            handleLogOut();
                            }}>Logout</MenuItem>
                    </Menu>
                </div>
            </Toolbar>
            <div className={classes.stats}>
                <div className={classes.stat}>
                    <Typography className={classes.statistics} variant='subtitle2' color='textSecondary'>Flushes</Typography>
                    <Typography className={classes.statistics} variant='h6' color='textSecondary'>127</Typography>
                </div>
                <div className={classes.stat}>
                    <Typography className={classes.statistics} variant='subtitle2' color='textSecondary'>Following</Typography>
                    <Typography className={classes.statistics} variant='h6' color='textSecondary'>12,700</Typography>
                </div>
                <div className={classes.stat}>
                    <Typography className={classes.statistics} variant='subtitle2' color='textSecondary'>Followers</Typography>
                    <Typography className={classes.statistics} variant='h6' color='textSecondary'>3,233,123</Typography>
                </div>
                <div className={classes.stat}>
                    <Typography className={classes.statistics} variant='subtitle2' color='textSecondary'>Likes</Typography>
                    <Typography className={classes.statistics} variant='h6' color='textSecondary'>2,333</Typography>
                </div>
            </div>
            <div className="details">
                <Typography>{user.credentials.bio}</Typography>
                <Typography>
                    <RoomIcon className={classes.icon} color='secondary' />
                    {user.credentials.location}
                </Typography>
                <Link href={user.credentials.website} target='_blank' >
                    <LanguageIcon className={classes.icon} color='secondary' />
                    {user.credentials.website}
                </Link>
                <Typography>
                    <CalendarTodayIcon className={classes.icon} color='secondary' />
                    Joined on {dayjs(user.credentials.created).format('MMM YYYY')}
                </Typography>
            </div>
        </div>
    )
}

export default Profile