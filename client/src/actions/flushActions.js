import axios from 'axios';

export const getAllFlushes = (dispatch) => {
    axios.get('/flushes')
    .then(response => dispatch({
        type: 'SET_ALL_FLUSHES',
        payload: response.data
    }))
    .catch(err => console.log(err));
}