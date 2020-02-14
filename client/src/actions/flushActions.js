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
    if (image && typeof image !== "string") {
        const uploadResult = await uploadImage(image);
        if (uploadResult) photoUrl = uploadResult;
    }
    axios.post('/flushes', { text, photoUrl })
    .then(response => {
        flushDispatch( {
            type: 'POST_FLUSH',
            payload: response.data });
    })
    .catch(err => console.log(err));
}

export const updateFlush = async (data, flushDispatch, flushID) => {
    const updates = {};
    if (data.text) updates.text = data.text;
    if (typeof data.file !== "string") {
        if (data.file) {
            const uploadResult =  await uploadImage(data.file);
            if (uploadResult) updates.photoUrl = uploadResult;
        }
    }
    else {
        if (!data.file) updates.photoUrl = '';
    }
    axios.patch(`/flushes/${flushID}`, updates)
    .then(() => {
        flushDispatch({
            type: 'UPDATE_FLUSH',
            payload: {updates, flushID}
        });
    })
    .catch(err => console.log(err));
}

const uploadImage = async (file) => {
    try {
        const formData = new FormData();
        formData.append('image', file, file.name);
        const response = await axios.post('/flushes/image', formData);
        return response.data.imageUrl;
    }
    catch (err) {
        console.log(err);
        return false;
    }
}