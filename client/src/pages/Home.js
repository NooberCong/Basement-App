import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Route } from 'react-router-dom';
import { useUser } from '../context/userContext';
import { useFlush } from '../context/flushContext';

//Actions
import { updateUser, validateUser } from '../actions/userActions';
import { getAllFlushes } from '../actions/flushActions';

//Components
import FlushSection from '../components/FlushSection.component';
import Drawer from '../components/Drawer.component';
import AppBar from '../components/AppBar.component';
import Profile from '../components/Profile.component';
import OtherProfile from '../components/OtherProfile.component'
import Notifications from '../components/NotifSection.component';
import SpecificFlush from '../components/SpecificFlush.component';
import Footer from '../components/Footer.component';
import Development from '../components/Development.component';

//Mui
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(6, 0, 3, 0),
        [theme.breakpoints.up('sm')]: {
            padding: theme.spacing(8, 0, 3, 0)
        }
    }
}));



const Home = () => {
    const classes = useStyles();
    const [mobile, setMobile] = useState(false);
    const [tab, setTab] = useState(0);
    const [user, userDispatch] = useUser();
    const [flushData, flushDispatch] = useFlush();
    useEffect(() => {
        validateUser(user, userDispatch, axios);
    });

    useEffect(() => {
        const fetchData = () => {
            if (user.authenticated) {
                updateUser(userDispatch);
                getAllFlushes(flushDispatch);
            }
            else setTimeout(fetchData, 500);
        }
        fetchData();
    }, [flushDispatch, user.authenticated, userDispatch]);

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar tab={tab} toggleMobile={() => setMobile(!mobile)} />
            <Drawer unread={user.notifications.filter(notif => !notif.read).length} tab={tab} setTab={setTab} mobile={mobile} toggleMobile={() => setMobile(!mobile)} />
            <Grid container className={classes.content}>
                <Grid item xs={12} sm={6}>
                    <Route path='/Profile'>
                        <Profile tab={tab} flushes={flushData.user} flushDispatch={flushDispatch} setTab={setTab} user={user} updateUser={() => updateUser(userDispatch)} setUnauthenticated={() => userDispatch({ type: 'SET_UNAUTHENTICATED' })} />
                    </Route>
                    <Route path='/users/:username'>
                        <OtherProfile user={user} flushes={flushData.user} userDispatch={userDispatch} flushDispatch={flushDispatch} setTab={setTab} credentials={user.otherCredentials} />
                    </Route>
                    <Route path='/notifications'>
                        <Notifications flushDispatch={flushDispatch} userDispatch={userDispatch} setTab={setTab} data={user.notifications} />
                    </Route>
                    <Route path='/flushes/:flushID'>
                        <SpecificFlush specific={flushData.specific} flushDispatch={flushDispatch} user={user} />
                    </Route>
                    <Route path='/likes'>
                        <Development setTab={setTab} />
                    </Route>
                    <Route path='/messages'>
                        <Development setTab={setTab} />
                    </Route>
                    <Route path='/trending'>
                        <Development setTab={setTab} />
                    </Route>
                    <Route path='/more'>
                        <Development setTab={setTab} />
                    </Route>
                    <Route exact path='/'>
                        <FlushSection setTab={setTab} flushDispatch={flushDispatch} data={flushData.all} user={user} />
                    </Route>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Footer />
                </Grid>
            </Grid>
        </div>
    )
}

export default Home
