import axios from 'axios';

export const getAllFlushes = (flushDispatch) => {
    axios.get('/flushes')
        .then(response => flushDispatch({
            type: 'SET_ALL_FLUSHES',
            payload: response.data
        }))
        .catch(err => console.log(err));
}

export const getUserFlushes = (username, flushDispatch) => {
    if (!username) return;
    axios.get(`/flushes?user=${username.replace(/\s/g, '%20')}`)
    .then(response => {
        flushDispatch({
            type: 'SET_USER_FLUSHES',
            payload: response.data
        });
    })
    .catch(err => console.log(err));
}

export const likeFlush = (id, flushDispatch) => {
    axios.post(`/flushes/${id}/like`)
        .then(response => {
            flushDispatch({
                type: 'LIKE_FLUSH',
                payload: response.data
            });
        })
        .catch(err => console.log(err));
}

export const unlikeFlush = (id, flushDispatch) => {
    axios.post(`/flushes/${id}/unlike`)
        .then(response => {
            flushDispatch({
                type: 'UNLIKE_FLUSH',
                payload: response.data
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
            flushDispatch({
                type: 'POST_FLUSH',
                payload: response.data
            });
        })
        .catch(err => console.log(err));
}

export const updateFlush = async (data, flushDispatch, flushID) => {
    const updates = {};
    if (data.text) updates.text = data.text;
    if (typeof data.file !== "string") {
        if (data.file) {
            const uploadResult = await uploadImage(data.file);
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
                payload: { updates, flushID }
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

export const postComment = async (comment, flushID, flushDispatch, user) => {
    try {
        await axios.post(`/flushes/${flushID}/comment`, comment)
        .then(response => {
            flushDispatch({
                type: 'POST_COMMENT',
                payload: { flushID, comment: response.data }
            });
        })
        .catch(err => console.log(err));
    }
    catch (err) {
        console.log(err);
    }
}

export const deleteComment = (commentID, flushID, flushDispatch) => {
    axios.delete(`/comments/${commentID}`)
        .then(() => {
            flushDispatch({
                type: 'DELETE_COMMENT',
                payload: { commentID, flushID }
            });
        })
        .catch(err => console.log(err));
}

export const updateComment = (commentID, flushID, updates, flushDispatch) => {
    axios.patch(`/comments/${commentID}`, updates)
        .then(response => {
            flushDispatch({
                type: 'UPDATE_COMMENT',
                payload: { comment: response.data, flushID, commentID }
            });
        })
        .catch(err => console.log(err));
}

export const likeComment = (commentID, flushDispatch) => {
    axios.post(`/comments/${commentID}/like`)
        .then((response) => {
            flushDispatch({
                type: 'LIKE_COMMENT',
                payload: response.data
            });
        })
        .catch(err => console.log(err));
}

export const unlikeComment = (commentID, flushDispatch) => {
    axios.post(`/comments/${commentID}/unlike`)
        .then((response) => {
            flushDispatch({
                type: 'UNLIKE_COMMENT',
                payload: response.data
            });
        })
        .catch(err => console.log(err));
}

export const replyComment = (text, commentID, flushID, flushDispatch) => {
    axios.post(`/comments/${commentID}/reply`, { text })
        .then(response => {
            flushDispatch({
                type: 'REPLY_COMMENT',
                payload: { commentID, flushID, reply: response.data }
            });
        })
        .catch(err => console.log(err));
}

export const getReplies = (commentID, flushID, flushDispatch) => {
    axios.get(`/comments/${commentID}/replies`)
        .then(response => {
            flushDispatch({
                type: 'SET_REPLIES',
                payload: { replies: response.data, commentID, flushID }
            });
        })
}

export const likeReply = (commentID, replyID, flushID, flushDispatch) => {
    axios.post(`/comments/${commentID}/replies/${replyID}/like`)
    .then(response => {
        flushDispatch({
            type: 'LIKE_REPLY',
            payload: {flushID, reply: response.data}
        });
    })
    .catch(err => console.log(err));
}

export const unlikeReply = (commentID, replyID, flushID, flushDispatch) => {
    axios.post(`/comments/${commentID}/replies/${replyID}/unlike`)
    .then(response => {
        flushDispatch({
            type: 'UNLIKE_REPLY',
            payload: {flushID, reply: response.data}
        });
    })
    .catch(err => console.log(err));
}

export const deleteReply = (commentID, replyID, flushID, flushDispatch) => {
    axios.delete(`/replies/${replyID}`)
    .then(() => {
        flushDispatch({
            type: 'DELETE_REPLY',
            payload: {flushID, commentID, replyID}
        });
    })
    .catch(err => console.log(err));
}

export const updateReply = (replyID, commentID, flushID, updates, flushDispatch) => {
    axios.patch(`/replies/${replyID}`, updates)
    .then(response => {
        flushDispatch({
            type: 'UPDATE_REPLY',
            payload: {flushID, commentID, replyID, reply: response.data}
        });
    })
    .catch(err => console.log(err));
}

export const freeUserFlushes = (flushDispatch) => {
    flushDispatch({type: 'FREE_USER_FLUSHES'});
}