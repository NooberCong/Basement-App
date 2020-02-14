import axios from 'axios';

export const getAllFlushes = (dispatch) => {
    axios.get('/flushes')
    .then(response => dispatch({
        type: 'SET_ALL_FLUSHES',
        payload: response.data
    }))
    .catch(err => console.log(err));
}

export const likeFlush = (id, userDispatch, flushDispatch) => {
    axios.post(`/flushes/${id}/like`)
    .then(response => {
        flushDispatch({
            type: 'LIKE_FLUSH',
            payload: response.data
        });
        userDispatch({
            type: 'LIKE_FLUSH',
            payload: id
        });
    })
    .catch(err => console.log(err));
}

export const unlikeFlush = (id, userDispatch, flushDispatch) => {
    axios.post(`/flushes/${id}/unlike`)
    .then(response => {
        flushDispatch({
            type: 'UNLIKE_FLUSH',
            payload: response.data
        });
        userDispatch({
            type: 'UNLIKE_FLUSH',
            payload: id
        });
    })
    .catch(err => console.log(err));
}

export const deleteFlush = (flushID, userDispatch, flushDispatch) => {
    axios.delete(`/flushes/${flushID}`)
    .then(() => {
        flushDispatch({
            type: 'DELETE_FLUSH',
            payload: flushID
        });
        userDispatch({
            type: 'DELETE_FLUSH',
            payload: flushID
        });
    })
    .catch(err => console.log(err));
}

export const postFlush = async (text, flushDispatch, image) => {
    let photoUrl = '';
    if (image) {
        try {
            const formData = new FormData();
            formData.append('image', image, image.name);
            const response = await axios.post('/flushes/image', formData);
            photoUrl = response.data.imageUrl;
        }
        catch (err) {
            console.log(err);
        }
    }
    axios.post('/flushes', { text, photoUrl })
    .then(response => {
        flushDispatch( {
            type: 'POST_FLUSH',
            payload: response.data });
    })
    .catch(err => console.log(err));
}