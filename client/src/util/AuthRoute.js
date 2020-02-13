import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useUser } from '../context/userContext';

const AuthRoute = ({ component: Component, path, ...rest }) => {
    const authenticated = useUser()[0].authenticated;
    return (
        <Route {...rest} render={(props) => authenticated ? <Redirect to='/' /> : <Component {...props} />} />
    )
}

export default AuthRoute;