import React from 'react';


import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
    container: {
        width: '100%',
        height: 'auto',
    },
    text: {
        fontSize: 24,
        fontFamily: 'sans-serif',
        textAlign: 'center'
    }
}));

const Development = ({ setTab }) => {
    setTab('Feature in development')
    const classes = useStyles();
    return (
        <div className={classes.container}>
            <img src="https://sourceforge.net/articles/wp-content/uploads/2018/08/mobile-app-development-concept.jpg" style={{ width: '100%', height: 'auto' }} alt="" />
            <Typography className={classes.text}>Development In Progress</Typography>
            <Typography className={classes.text}>Check back later!</Typography>
        </div>
    )
}

export default Development;