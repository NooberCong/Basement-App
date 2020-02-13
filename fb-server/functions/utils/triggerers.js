const { db } = require('./admin');

exports.triggerLikeNotif = async (snapshot) => {
    try {
        const doc = await db.doc(`/flushes/${snapshot.data().flushID}`).get();
        if (!doc.exists || doc.data().user === snapshot.data().username) return;
        const notif = {
            from: snapshot.data().username,
            to: doc.data().user,
            read: false,
            type: 'like',
            flushID: doc.id,
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

exports.triggerCommentNotif = async (snapshot) => {
    try {
        const doc = await db.doc(`/flushes/${snapshot.data().flushID}`).get();
        if (!doc.exists || doc.data().user === snapshot.data().username) return;
        const notif = {
            from: snapshot.data().username,
            to: doc.data().user,
            read: false,
            type: 'comment',
            flushID: doc.id,
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
            const batch = db.batch();
            const flushData = await db.collection('flushes').where('user', '==', change.before.data().username).get();
            flushData.forEach(doc => {
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
        const commentData = await db.collection('comments').where('flushID', '==', flushID).get();
        const likeData = await db.collection('likes').where('flushID', '==', flushID).get();
        const notifData = await db.collection('notifications').where('flushID', '==', flushID).get();
        const batch = db.batch();
        commentData.forEach(doc => {batch.delete(doc.ref)});
        likeData.forEach(doc => {batch.delete(doc.ref)});
        notifData.forEach(doc => {batch.delete(doc.ref)});
        return await batch.commit();
    }
    catch (err) {
        return console.error(err);
    }
}