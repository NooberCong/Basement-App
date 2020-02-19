const functions = require('firebase-functions');
const express = require('express');
const app = express();
const dbauth = require('./utils/auth');

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Handlers
const { getAllFlushes,
    likeFlush,
    unlikeFlush,
    getFlush,
    postFlush,
    postComment,
    updateFlush,
    deleteFlush,
    uploadFlushPhoto,
    deleteComment,
    updateComment,
    likeComment,
    unlikeComment,
    replyComment,
    getAllReplies,
    likeReply,
    unlikeReply,
    deleteReply,
    updateReply } = require('./handlers/flushes');
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
    triggerFlushDelete,
    triggerCommentDelete,
    triggerReplyNotif } = require('./utils/triggerers');

//Routes
app.get('/flushes', dbauth, getAllFlushes);
app.get('/flushes/:flushID', dbauth, getFlush);
app.get('/comments/:commentID/replies', dbauth, getAllReplies);
app.post('/flushes', dbauth, postFlush);
app.post('/flushes/image', dbauth, uploadFlushPhoto);
app.post('/flushes/:flushID/comment', dbauth, postComment);
app.post('/flushes/:flushID/like', dbauth, likeFlush);
app.post('/flushes/:flushID/unlike', dbauth, unlikeFlush);
app.post('/comments/:commentID/like', dbauth, likeComment);
app.post('/comments/:commentID/unlike', dbauth, unlikeComment);
app.post('/comments/:commentID/reply', dbauth, replyComment);
app.post('/comments/:commentID/replies/:replyID/like', dbauth, likeReply);
app.post('/comments/:commentID/replies/:replyID/unlike', dbauth, unlikeReply);
app.patch('/flushes/:flushID', dbauth, updateFlush);
app.patch('/comments/:commentID', dbauth, updateComment);
app.patch('/replies/:replyID', dbauth, updateReply);
app.delete('/replies/:replyID', dbauth, deleteReply);
app.delete('/comments/:commentID', dbauth, deleteComment);
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
exports.onLike = functions.region('asia-east2').firestore.document('likes/{id}').onCreate(triggerLikeNotif);
exports.onComment = functions.region('asia-east2').firestore.document('comments/{id}').onCreate(triggerCommentNotif);
exports.onUnlike = functions.region('asia-east2').firestore.document('likes/{id}').onDelete(triggerDelNotif);
exports.onUserImageChange = functions.region('asia-east2').firestore.document('users/{id}').onUpdate(triggerUserImageChange);
exports.onFlushDelete = functions.region('asia-east2').firestore.document('flushes/{id}').onDelete(triggerFlushDelete);
exports.onCommentDelete = functions.region('asia-east2').firestore.document('comments/{id}').onDelete(triggerCommentDelete);
exports.onReply = functions.region('asia-east2').firestore.document('replies/{id}').onCreate(triggerReplyNotif);
exports.onReplyDelete = functions.region('asia-east2').firestore.document('replies/{id}').onDelete(triggerDelNotif);