const { admin, db } = require('./admin');

exports.triggerLikeNotif = async (snapshot) => {
    try {
        let notif;
        if (snapshot.data().type === 'replyLike') {
            const replyDoc = await db.doc(`/replies/${snapshot.data().replyID}`).get();
            const commentDoc = await db.doc(`/comments/${replyDoc.data().commentID}`).get();
            if (!replyDoc.exists || replyDoc.data().username === snapshot.data().username) return;
            notif = {
                from: snapshot.data().username,
                to: replyDoc.data().username,
                read: false,
                type: 'reply like',
                flushID: commentDoc.data().flushID,
                imageUrl: snapshot.data().imageUrl,
                commentID: commentDoc.id,
                replyID: replyDoc.id,
                created: new Date().toISOString()
            }
        }
        else if (snapshot.data().type === 'commentLike'){
            const commentDoc = await db.doc(`/comments/${snapshot.data().commentID}`).get();
            if (!commentDoc.exists || commentDoc.data().username === snapshot.data().username) return;
            notif = {
                from: snapshot.data().username,
                to: commentDoc.data().username,
                read: false,
                type: 'comment like',
                imageUrl: snapshot.data().imageUrl,
                flushID: commentDoc.data().flushID,
                commentID: commentDoc.id,
                created: new Date().toISOString()
            }
        }
        else {
            const flushDoc = await db.doc(`/flushes/${snapshot.data().flushID}`).get();
            if (!flushDoc.exists || snapshot.data().username === flushDoc.data().user) return;
            notif = {
                from: snapshot.data().username,
                to: flushDoc.data().user,
                read: false,
                type: 'flush like',
                imageUrl: snapshot.data().imageUrl,
                flushID: flushDoc.id,
                created: new Date().toISOString()
            }
        }
        await db.doc(`/notifications/${snapshot.id}`).set(notif);
        return;
    }
    catch (err) {
        console.error(err);
        return;
    }
}

exports.triggerCommentNotif = async (snapshot) => {
    try {
        const flushDoc = await db.doc(`/flushes/${snapshot.data().flushID}`).get();
        if (!flushDoc.exists || flushDoc.data().user === snapshot.data().username) return;
        const notif = {
            from: snapshot.data().username,
            to: flushDoc.data().user,
            read: false,
            type: 'comment',
            flushID: flushDoc.id,
            imageUrl: snapshot.data().imageUrl,
            commentID: snapshot.id,
            created: new Date().toISOString()
        }
        await db.doc(`/notifications/${snapshot.id}`).set(notif);
        return;
    }
    catch (err) {
        console.error(err);
        return;
    }
}

exports.triggerDelNotif = async (snapshot) => {
    try {
        await db.doc(`/notifications/${snapshot.id}`).delete();
        return;
    }
    catch (err) {
        console.error(err);
        return
    }
}

exports.triggerUserImageChange = async (change) => {
    try {
        if (change.before.data().imageUrl !== change.after.data().imageUrl) {
            await admin.storage().bucket().file(change.before.data().imageUrl.slice(77, 87)).delete();
            const batch = db.batch();            
            const flushData = await db.collection('flushes').where('user', '==', change.before.data().username).get();
            const commentData = await db.collection('comments').where('username', '==', change.before.data().username).get();
            const replyData = await db.collection('replies').where('username', '==', change.before.data().username).get();
            const likeData = await db.collection('likes').where('username', '==', change.before.data().username).get();
            const notifData = await db.collection('notifications').where('from', '==', change.before.data().username).get();
            flushData.forEach(doc => {
                batch.update(doc.ref, { imageUrl: change.after.data().imageUrl });
            });
            commentData.forEach(doc => {
                batch.update(doc.ref, { imageUrl: change.after.data().imageUrl });
            });
            replyData.forEach(doc => {
                batch.update(doc.ref, { imageUrl: change.after.data().imageUrl });
            });
            likeData.forEach(doc => {
                batch.update(doc.ref, { imageUrl: change.after.data().imageUrl });
            });
            notifData.forEach(doc => {
                batch.update(doc.ref, { imageUrl: change.after.data().imageUrl });
            });
            return await batch.commit();
        }
        else return;
    }
    catch (err) {
        return console.error(err);
    }
}

exports.triggerFlushDelete = async (snapshot) => {
    try {
        const flushID = snapshot.id;
        if (snapshot.data().photoUrl) await admin.storage().bucket().file(snapshot.data().photoUrl.slice(77, 87)).delete();
        const commentData = await db.collection('comments').where('flushID', '==', flushID).get();
        const likeData = await db.collection('likes').where('flushID', '==', flushID).get();
        const notifData = await db.collection('notifications').where('flushID', '==', flushID).get();
        const batch = db.batch();
        commentData.forEach(doc => { batch.delete(doc.ref) });
        likeData.forEach(doc => { batch.delete(doc.ref) });
        notifData.forEach(doc => { batch.delete(doc.ref) });
        return await batch.commit();
    }
    catch (err) {
        return console.error(err);
    }
}

exports.triggerCommentDelete = async (snapshot) => {
    try {
        const commentID = snapshot.id;
        const likeData = await db.collection('likes').where('type', '==', 'commentLike').where('commentID', '==', commentID).get();
        const notifData = await db.collection('notifications').where('commentID', '==', commentID).get();
        const replyData = await db.collection('replies').where('commentID', '==', commentID).get();
        const batch = db.batch();
        replyData.forEach(doc => { batch.delete(doc.ref) });
        likeData.forEach(doc => { batch.delete(doc.ref) });
        notifData.forEach(doc => { batch.delete(doc.ref) });
        return await batch.commit();
    }
    catch (err) {
        return console.error(err);
    }
}

exports.triggerReplyNotif =  async (snapshot) => {
    const commentDoc = await db.doc(`/comments/${snapshot.data().commentID}`).get();
    if (!commentDoc.exists || commentDoc.data().username === snapshot.data().username) return;
    const notif = {
        from: snapshot.data().username,
        to: commentDoc.data().username,
        type: 'reply',
        read: false,
        replyID: snapshot.id,
        imageUrl: snapshot.data().imageUrl,
        commentID: commentDoc.id,
        flushID: commentDoc.data().flushID,
        created: new Date().toISOString()
    }
    await db.doc(`/notifications/${snapshot.id}`).set(notif);
    return;
}
