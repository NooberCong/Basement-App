import React from 'react'

//Mui
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Link } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    brandName: {
        fontFamily: 'Tomorrow',
        fontSize: 64,
        textAlign: 'center',
        [theme.breakpoints.down('xs')]: {
            fontSize: 32
        }
        
    },
    socialMedia: {
        textAlign: 'center',
        fontFamily: 'Tomorrow',
        fontSize: 18,
        marginTop: 16
    }
}));

const Footer = () => {
    const classes = useStyles();
    return (
        <>
            <div className={classes.logo}>
                <Typography className={classes.brandName}>Basement App</Typography>
                <Typography className={classes.brandName}>v0.1.0</Typography>
            </div>
            <div className={classes.socialMedia}>
                <Typography>Created by NooberCong with React</Typography>
                <Typography>Hosted on Firebase</Typography>
                <Typography>Github Repos: <Link>https://github.com/Undying-Hacker/Basement-App</Link></Typography>
            </div>
        </>
    )
}

export default Footer;