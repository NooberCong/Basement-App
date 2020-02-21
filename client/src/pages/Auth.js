import React, { useState } from 'react';
import { validateSignIn, validateSignUp } from '../util/validators';
import { useHistory } from 'react-router-dom';
import axios from 'axios';


//Context
import { useUser } from '../context/userContext';

//Mui
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                Basement App
      </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const useStyles = makeStyles(theme => ({
    root: {
        height: '100vh',
    },
    image: {
        backgroundImage: 'url(https://source.unsplash.com/random)',
        backgroundRepeat: 'no-repeat',
        backgroundColor:
            theme.palette.type === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    paper: {
        margin: '78px 32px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: `#f0f0f0`,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        position: 'relative',
        margin: theme.spacing(3, 0, 2),
    },
    loading: {
        position: 'absolute'
    },
    nameGrid: {
        justifyContent: 'space-between'
    }
}));

const Auth = () => {
    //Hooks
    const history = useHistory();
    const classes = useStyles();
    const userDispatch = useUser()[1];

    //States
    const [action, setAction] = useState('Sign In');
    const [fName, setFName] = useState('');
    const [lName, setLName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cfPassword, setCfPassword] = useState('');
    const [authError, setAE] = useState('');
    const [helperEmail, setHE] = useState('');
    const [helperPassword, setHP] = useState('');
    const [loading, setLoading] = useState(false);

    //Handlers
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (action !== 'Sign In' && password !== cfPassword) return;
        const { value, error } = action === 'Sign In'? await validateSignIn(email, password): await validateSignUp(fName + ' ' + lName, email, password, cfPassword);
        if (error) {
            if (error.toString().match(/username/)) setAE('Please enter a valid name');
            else setAE('');
            if (error.toString().match(/email/)) setHE('Please enter a valid email');
            else setHE('');
            if (error.toString().match(/password/)) setHP('Password must contain at least one uppercase character and one number');
            else setHP('');
        }
        else {
            try {
                setLoading(true);
                const response = await axios.post(`/${action.toLowerCase().replace(/\s/g, '')}`, value);
                const token = `Bearer ${response.data.token}`;
                localStorage.setItem('idToken', token);
                axios.defaults.headers.common.authToken = token;
                userDispatch({type: 'SET_AUTHENTICATED'});
                history.push('/');
            }
            catch (err) {
                setLoading(false);
                setAE('Invalid Email or Password');
                console.log(err);
            }
        }
    }
    return (
        <Grid container component="main" className={classes.root}>
            <CssBaseline />
            <Grid item xs={false} sm={4} md={7} className={classes.image} />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <div className={classes.paper}>
                    <Typography component="h1" variant="h3">
                        {action}
                    </Typography>
                    <form className={classes.form} noValidate onSubmit={handleSubmit}>
                        {action === 'Sign Up' &&
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="fname"
                                    name="firstName"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                value={fName}
                                onChange={(e) => setFName(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="lname"
                                    value={lName}
                                    onChange={(e) => setLName(e.target.value)}
                                />
                            </Grid>
                        </Grid>}

                        <TextField
                            error={helperEmail ? true : false}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            helperText={helperEmail}
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            error={helperPassword ? true : false}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            helperText={helperPassword}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {action === 'Sign Up' &&
                        <TextField
                        error={(cfPassword && cfPassword !== password)? true: false}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="cf-password"
                        label="Confirm Password"
                        type="password"
                        id="cf-password"
                        autoComplete="cf-password"
                        helperText={cfPassword && cfPassword !== password? 'Password does not match': ''}
                        value={cfPassword}
                        onChange={(e) => setCfPassword(e.target.value)}
                        />}
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        />
                        {authError &&
                            <Typography variant='body1' color='error'>
                                {authError}
                            </Typography>}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={loading ? true : false}
                            className={classes.submit}
                        >
                            {loading && <CircularProgress color='primary' className={classes.loading} />}
                            {action}
                        </Button>
                        <Grid container>
                            {action === 'Sign In' &&
                            <Grid item xs>
                                <Link style={{cursor: 'pointer'}} variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>}
                            <Grid item >
                                <Link style={{cursor: 'pointer'}} variant="body2" onClick={(e) => {setAction(action=== 'Sign In'? 'Sign Up': 'Sign In')}}>
                                    {action === 'Sign In'? "Don't have an account? Sign Up": "Already have an account? Sign In"}
                                </Link>
                            </Grid>
                        </Grid>
                        <Box mt={action === 'Sign In'? 5: 1}>
                            <Copyright />
                        </Box>
                    </form>
                </div>
            </Grid>
        </Grid>
    );
}
export default Auth