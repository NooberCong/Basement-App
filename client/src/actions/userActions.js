import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { getAllFlushes } from '../actions/flushActions';
import { isEmpty } from '../util/validators';

export const updateUser = (dispatch) => {
    axios.get('/users').then(response => dispatch({
        type: 'SET_USER',
        payload: response.data
    }))
    .catch(err => console.log(err));
}

export const validateUser = (userDispatch, flushDispatch, user, flushData, axios) => {
    const token = localStorage.idToken;
    if (!token || jwtDecode(token).exp * 1000 < Date.now()) {
        userDispatch({ type: 'SET_UNAUTHENTICATED' });
        window.location.href = '/auth';
    }
    else {
        axios.defaults.headers.common.authToken = token;
        if(isEmpty(user.credentials)) updateUser(userDispatch);
        if(!flushData.all.length) getAllFlushes(flushDispatch);
    }
}