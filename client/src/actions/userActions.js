import axios from 'axios';
import jwtDecode from 'jwt-decode';

export const updateUser = (userDispatch) => {
    axios.get('/users').then(response => userDispatch({
        type: 'SET_USER',
        payload: response.data
    }))
        .catch(err => console.log(err));
}

export const validateUser = (user, userDispatch, axios) => {
    const token = localStorage.idToken;
    if (!token || jwtDecode(token).exp * 1000 < Date.now()) {
        userDispatch({ type: 'SET_UNAUTHENTICATED' });
        window.location.href = '/auth';
    }
    else {
        if (!axios.defaults.headers.common.authToken) axios.defaults.headers.common.authToken = token;
        if (!user.authenticated) userDispatch({ type: 'SET_AUTHENTICATED' });
    }
}

export const getOtherUserDetails = (username, userDispatch) => {
    axios.get(`/users/${username.replace(/\s/g, '%20')}`)
    .then(response => {
        userDispatch({
            type: 'SET_OTHER_USER',
            payload: response.data.credentials
        });
    })
}

export const freeOtherUserDetails = (userDispatch) => {
    userDispatch({ type: 'FREE_OTHER_USER' });
}

export const markAsRead = (ids, userDispatch) => {
    console.log('Marking notif as read');
    axios.post('/notifications', ids)
    .then(() => {
        userDispatch({ type: 'MARK_NOTIF_READ' });
    })
    .catch(err => console.log(err));
}