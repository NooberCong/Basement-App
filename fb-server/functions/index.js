const functions = require('firebase-functions');
const app = require('express')();
const dbauth = require('./utils/auth');

//Handlers
const { getAllFlushes,
    likeFlush,
    unlikeFlush,
    getFlush,
    postFlush,
    postComment,
    editFlush,
    deleteFlush,
    uploadFlushPhoto,
    getComments } = require('./handlers/flushes');
const { signup,
    signin,
    uploadImage,
    updateUserDetails,
    getUserDetails,
    getOwnDetails,
    markNotifAsRead } = require('./handlers/users');
const { triggerLikeNotif,
        triggerCommentNotif,
        triggerUserImageChange,
        triggerDelNotif,
        triggerFlushDelete } = require('./utils/triggerers');

//Routes
app.get('/flushes', getAllFlushes);
app.get('/flushes/:flushID', getFlush);
app.get('/flushes/:flushID/comment', getComments);
app.post('/flushes', dbauth, postFlush);
app.post('/flushes/image', dbauth, uploadFlushPhoto);
app.post('/flushes/:flushID/comment', dbauth, postComment);
app.post('/flushes/:flushID/like', dbauth, likeFlush);
app.post('/flushes/:flushID/unlike', dbauth, unlikeFlush);
app.patch('/flushes/:flushID', dbauth, editFlush);
app.delete('/flushes/:flushID', dbauth, deleteFlush);

app.get('/users', dbauth, getOwnDetails);
app.post('/users', dbauth, updateUserDetails);
app.get('/users/:username', getUserDetails);
app.post('/signup', signup);
app.post('/signin', signin);
app.post('/users/image', dbauth, uploadImage);
app.post('/notifications', dbauth, markNotifAsRead);

exports.api = functions.region('asia-east2').https.onRequest(app);
//Function triggerers
exports.OnLike = functions.region('asia-east2').firestore.document('likes/{id}').onCreate(triggerLikeNotif);
exports.OnComment = functions.region('asia-east2').firestore.document('comments/{id}').onCreate(triggerCommentNotif);
exports.OnUnlike = functions.region('asia-east2').firestore.document('likes/{id}').onDelete(triggerDelNotif);
exports.onUserImageChange = functions.region('asia-east2').firestore.document('users/{id}').onUpdate(triggerUserImageChange);
exports.onFlushDelete = functions.region('asia-east2').firestore.document('flushes/{id}').onDelete(triggerFlushDelete);
