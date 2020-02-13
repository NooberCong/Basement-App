import React, { useState } from 'react';
import axios from 'axios';
import { Route } from 'react-router-dom';
import { useUser } from '../context/userContext';
import { useFlush } from '../context/flushContext';

//Actions
import { updateUser, validateUser } from '../actions/userActions';

//Components
import FlushSection from '../components/FlushSection.component';
import Drawer from '../components/Drawer.component';
import AppBar from '../components/AppBar.component';
import Profile from '../components/Profile.component';

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
    const [user, userDispatch] = useUser();
    const [flushData, flushDispatch] = useFlush();

    //Check for user validation
    validateUser(userDispatch, flushDispatch, user, flushData, axios);
    

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar toggleMobile={() => setMobile(!mobile)} />
            <Drawer mobile={mobile} toggleMobile={() => setMobile(!mobile)} />
            <Grid container className={classes.content}>
                <Grid item xs={12} sm={6}>
                    <Route path='/Profile'>
                        <Profile user={user} updateUser={() => updateUser()} setUnauthenticated={() => userDispatch({ type: 'SET_UNAUTHENTICATED' })} />
                    </Route>
                    <Route exact path='/'>
                        <FlushSection data={flushData.all} user={user} />
                    </Route>
                </Grid>
                <Grid item xs={12} sm={6}></Grid>
            </Grid>

        </div>
    )
}

export default Home
