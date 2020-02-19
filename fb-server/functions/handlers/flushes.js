const { admin, db } = require('../utils/admin');
const BusBoy = require('busboy');
const config = require('../utils/config');

exports.getAllFlushes = async (req, res) => {
    try {
        let data = await db.collection('flushes');
        if (req.query.user) data = data.where('user', '==', req.query.user);
        data = data.orderBy('created', 'desc');
        if(req.query.from) {
            const lastDoc = await db.doc(`/flushes/${req.query.from}`).get();
            data = data.startAfter(lastDoc);
        }
        data = await data.limit(10).get();
        let flushes = [];
        data.forEach(doc => {
            const flush = doc.data();
            flush.flushID = doc.id;
            flushes.push(flush);
        });
        await Promise.all(flushes.map(async flush => {
            const likeData = await db.collection('likes').where('username', '==', req.user.username).where('flushID', '==', flush.flushID).where('type', '==', 'flushLike').limit(1).get();
            if (!likeData.empty) flush.likedByUser = true;
            const commentData = await db.collection('comments')
                .orderBy('created', 'asc')
                .where('flushID', '==', flush.flushID)
                .get();
            flush.comments = [];
            commentData.forEach(doc => {
                let comment = doc.data();
                comment.commentID = doc.id;
                comment.likedByUser = false;
                flush.comments.push(comment);
            });
            await Promise.all(flush.comments.map(async (comment, index) => {
                flush.comments[index].replies = [];
                const likeData = await db.collection('likes').where('username', '==', req.user.username).where('flushID', '==', comment.flushID).where('commentID', '==', comment.commentID).limit(1).get();
                if (!likeData.empty) flush.comments[index].likedByUser = true;
            }));
        }));
        return res.json(flushes);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Could not fetch flushes' });
    }
}

exports.postFlush = async (req, res) => {
    try {
        const newFlush = {
            user: req.user.username,
            text: req.body.text,
            imageUrl: req.user.imageUrl,
            photoUrl: req.body.photoUrl,
            created: new Date().toISOString(),
            likeCount: 0,
            commentCount: 0
        }
        const doc = await db.collection('flushes').add(newFlush);
        const resFLush = newFlush;
        resFLush.flushID = doc.id;
        return res.json(resFLush);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Could not post flush' });
    }
}

exports.getFlush = async (req, res) => {
    try {
        let flush = {};
        const doc = await db.doc(`/flushes/${req.params.flushID}`).get();
        if (!doc.exists) {
            return res.status(400).json({ message: 'Flush does not exist' });
        }
        flush = doc.data();
        flush.flushID = doc.id;
        const commentData = await db.collection('comments')
            .orderBy('created', 'asc')
            .where('flushID', '==', flush.flushID)
            .get();
        flush.comments = [];
        commentData.forEach(doc => {
            let comment = doc.data();
            comment.commentID = doc.id;
            flush.comments.push(comment);
        });
        return res.json(flush);
    }

    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Could not fetch data from db' });
    };
}



exports.postComment = async (req, res) => {
    try {
        if (!req.body.text) return res.status(400).json({ message: 'Comment must not be empty' });
        const doc = await db.doc(`/flushes/${req.params.flushID}`).get();
        if (!doc.exists) res.status(404).json({ message: 'Flush does not exist' });
        const newComment = {
            username: req.user.username,
            text: req.body.text,
            flushID: req.params.flushID,
            imageUrl: req.user.imageUrl,
            likeCount: 0,
            replyCount: 0,
            created: new Date().toISOString()
        };
        const commentDoc = await db.collection('comments').add(newComment);
        await db.doc(`/flushes/${req.params.flushID}`).update({ commentCount: doc.data().commentCount + 1 });
        return res.json({ ...newComment, commentID: commentDoc.id });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Could not post a comment' });
    }
}

exports.likeFlush = async (req, res) => {
    try {
        let flushData;
        const flushDoc = await db.doc(`/flushes/${req.params.flushID}`).get();
        if (!flushDoc.exists) return res.status(400).json({ message: 'FLush does not exist' });
        const likeData = await db.collection('likes').where('username', '==', req.user.username).where('flushID', '==', req.params.flushID).limit(1).get();
        if (!likeData.empty) return res.status(400).json({ message: `User ${req.user.username} already liked this flush` });
        flushData = flushDoc.data();
        flushData.flushID = req.params.flushID;
        await db.collection('likes').add({ flushID: req.params.flushID, imageUrl: req.user.imageUrl, username: req.user.username, type: 'flushLike' });
        flushData.likeCount++;
        await db.doc(`/flushes/${req.params.flushID}`).update({ likeCount: flushData.likeCount });
        return res.json(flushData);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Could not like flush' });
    }
}

exports.unlikeFlush = async (req, res) => {
    try {
        let flushData;
        const flushDoc = await db.doc(`/flushes/${req.params.flushID}`).get();
        if (!flushDoc.exists) return res.status(400).json({ message: 'FLush does not exist' });
        const likeData = await db.collection('likes').where('username', '==', req.user.username).where('flushID', '==', req.params.flushID).limit(1).get();
        if (likeData.empty) return res.status(400).json({ message: `User ${req.user.username} has not liked this flush` });
        flushData = flushDoc.data();
        flushData.flushID = req.params.flushID;
        await likeData.docs[0].ref.delete();
        flushData.likeCount--;
        await db.doc(`/flushes/${req.params.flushID}`).update({ likeCount: flushData.likeCount });
        return res.json(flushData);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Could not unlike flush' });
    }
}

exports.deleteFlush = async (req, res) => {
    try {
        const doc = await db.doc(`/flushes/${req.params.flushID}`).get();
        if (!doc.exists) return res.status(404).json({ message: 'Flush does not exist' });
        if (doc.data().user !== req.user.username) return res.status(403).json({ message: 'You are not authorized to delete this flush' });
        await doc.ref.delete();
        return res.json({ message: 'Flush deleted' });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Could not delete flush' });
    }
}

exports.uploadFlushPhoto = async (req, res) => {
    const fs = require('fs');
    const os = require('os');
    const path = require('path');
    const busboy = new BusBoy({ headers: req.headers });
    let imageMtype, imageFPath, imageFName;
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        if (mimetype != 'image/jpeg' && mimetype != 'image/png') {
            return res.status(400).json({ message: 'Invalid file format, file must be an image' });
        }
        imageMtype = mimetype;
        const imageExt = filename.split('.')[filename.split('.').length - 1];
        imageFName = `${Math.round(Math.random() * 1000000)}.${imageExt}`;
        imageFPath = path.join(os.tmpdir(), imageFName);
        file.pipe(fs.createWriteStream(imageFPath));

    });
    busboy.on('finish', async () => {
        try {
            await admin.storage().bucket().upload(imageFPath, {
                resumable: false,
                metadata: {
                    metadata: {
                        contentType: imageMtype
                    }
                }
            });
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFName}?alt=media`;
            return res.status(201).json({ imageUrl });
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Could not upload photo' });
        }
    });
    busboy.end(req.rawBody);
}

exports.updateFlush = async (req, res) => {
    try {
        const doc = await db.doc(`/flushes/${req.params.flushID}`).get();
        if (doc.data().user !== req.user.username) return res.status(403).json({ message: 'Not authorized' });
        else if (!req.body.text.trim() && !req.body.photoUrl.trim()) return res.status(400).json({ message: 'Cannot make a flush empty' });
        await db.doc(`/flushes/${req.params.flushID}`).update(req.body);
        return res.json({ message: 'Flush successfully updated' });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Could not update flush' });
    }
}


exports.deleteComment = async (req, res) => {
    try {
        const doc = await db.doc(`/comments/${req.params.commentID}`).get();
        if (doc.data().username !== req.user.username) return res.status(403).json({ message: 'Unauthorized' });
        await doc.ref.delete();
        const flushDoc = await db.doc(`/flushes/${doc.data().flushID}`).get();
        if (flushDoc.exists) await flushDoc.ref.update({ commentCount: flushDoc.data().commentCount - 1 });
        return res.json({ message: 'Comment deleted' });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Could not delete comment' });
    }
}

exports.updateComment = async (req, res) => {
    try {
        const doc = await db.doc(`/comments/${req.params.commentID}`).get();
        if (!doc.exists) return res.status(404).json({ message: 'Comment not found' });
        const comment = doc.data();
        comment.text = req.body.text;
        await doc.ref.update(req.body);
        return res.json(comment);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Could not update comment' });
    }
}

exports.likeComment = async (req, res) => {
    try {
        const commentDoc = await db.doc(`/comments/${req.params.commentID}`).get();
        if (!commentDoc.exists) return res.status(404).json({ message: 'Comment not found' });
        const likeData = await db.collection('likes').where('commentID', '==', req.params.commentID).where('username', '==', req.user.username).where('type', '==', 'commentLike').limit(1).get();
        if (!likeData.empty) return res.status(400).json({ message: 'Comment already liked' });
        await db.collection('likes').add({
            flushID: commentDoc.data().flushID,
            username: req.user.username,
            commentID: commentDoc.id,
            imageUrl: req.user.imageUrl,
            type: 'commentLike'
        });
        const comment = commentDoc.data();
        comment.commentID = commentDoc.id;
        comment.likeCount++;
        await commentDoc.ref.update({ likeCount: comment.likeCount });
        return res.json(comment);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Could not like comment' });
    }
}

exports.unlikeComment = async (req, res) => {
    try {
        const commentDoc = await db.doc(`/comments/${req.params.commentID}`).get();
        if (!commentDoc.exists) return res.status(404).json({ message: 'Comment not found' });
        const likeData = await db.collection('likes').where('commentID', '==', req.params.commentID).where('username', '==', req.user.username).where('type', '==', 'commentLike').limit(1).get();
        if (likeData.empty) return res.status(400).json({ message: 'Comment was not liked' });
        await likeData.docs[0].ref.delete();
        const comment = commentDoc.data();
        comment.commentID = commentDoc.id;
        comment.likeCount--;
        await commentDoc.ref.update({ likeCount: comment.likeCount });
        return res.json(comment);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Could not like comment' });
    }
}

exports.replyComment = async (req, res) => {
    try {
        const commentDoc = await db.doc(`/comments/${req.params.commentID}`).get();
        if (!commentDoc.exists) return res.status(404).json({ message: 'Comment Not Found' });
        const reply = {
            text: req.body.text,
            commentID: req.params.commentID,
            username: req.user.username,
            imageUrl: req.user.imageUrl,
            likeCount: 0,
            created: new Date().toISOString()
        }
        await commentDoc.ref.update({ replyCount: commentDoc.data().replyCount + 1 });
        const replyDoc = await db.collection('replies').add(reply);
        reply.replyID = replyDoc.id;
        return res.json(reply);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Could not reply to comment' });
    }
}

exports.getAllReplies = async (req, res) => {
    try {
        const commentDoc = await db.doc(`/comments/${req.params.commentID}`).get();
        if (!commentDoc.exists) return res.status(404).json({ message: 'Comment Not Found' });
        const replies = [];
        const replyData = await db.collection('replies').where('commentID', '==', req.params.commentID).orderBy('created', 'asc').get();
        replyData.forEach(doc => {
            let reply = doc.data();
            reply.replyID = doc.id;
            replies.push(reply);
        });
        await Promise.all(replies.map(async reply => {
            const likeData = await db.collection('likes').where('type', '==', 'replyLike').where('commentID', '==', reply.commentID).where('replyID', '==', reply.replyID).where('username', '==', req.user.username).limit(1).get();
            if (!likeData.empty) reply.likedByUser = true;
        }));
        return res.json(replies);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Could not fetch replies' });
    }
}

exports.likeReply = async (req, res) => {
    const replyDoc = await db.doc(`/replies/${req.params.replyID}`).get();
    if (!replyDoc.exists) return res.status(404).json({ message: 'Reply not found' });
    const likeData = await db.collection('likes').where('type', '==', 'replyLike').where('commentID', '==', req.params.commentID).where('replyID', '==', req.params.replyID).where('username', '==', req.user.username).limit(1).get();
    if (!likeData.empty) return res.status(400).json({ message: 'Reply already liked' });
    await db.collection('likes').add({
        commentID: req.params.commentID,
        username: req.user.username,
        replyID: req.params.replyID,
        imageUrl: req.user.imageUrl,
        type: 'replyLike'
    });
    const reply = replyDoc.data();
    reply.likeCount++;
    reply.replyID = replyDoc.id;
    await replyDoc.ref.update({ likeCount: reply.likeCount });
    return res.json(reply);
}

exports.unlikeReply = async (req, res) => {
    const replyDoc = await db.doc(`/replies/${req.params.replyID}`).get();
    if (!replyDoc.exists) return res.status(404).json({ message: 'Reply not found' });
    const likeData = await db.collection('likes').where('type', '==', 'replyLike').where('commentID', '==', req.params.commentID).where('replyID', '==', req.params.replyID).where('username', '==', req.user.username).limit(1).get();
    if (likeData.empty) return res.status(400).json({ message: 'Reply not liked' });
    await likeData.docs[0].ref.delete();
    const reply = replyDoc.data();
    reply.likeCount--;
    reply.replyID = replyDoc.id;
    await replyDoc.ref.update({ likeCount: reply.likeCount });
    return res.json(reply);
}

exports.deleteReply = async (req, res) => {
    try {
        const replyDoc = await db.doc(`/replies/${req.params.replyID}`).get();
        if (replyDoc.data().username !== req.user.username) return res.status(403).json({ message: 'Unauthorized' });
        await replyDoc.ref.delete();
        const commentDoc = await db.doc(`/comments/${replyDoc.data().commentID}`).get();
        if (commentDoc.exists) await commentDoc.ref.update( {replyCount: commentDoc.data().replyCount - 1 });
        return res.json({ message: 'Reply deleted' });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json(({ message: 'Could not delete reply' }));
    }
}

exports.updateReply = async (req, res) => {
    try {
        const replyDoc = await db.doc(`/replies/${req.params.replyID}`).get();
        if (!replyDoc.exists) return res.status(404).json({ message: 'Reply not found' });
        else if (!replyDoc.data().username === req.user.username) return res.status(403).json({ message: 'Unauthorized' });
        const reply = replyDoc.data();
        reply.text = req.body.text;
        await replyDoc.ref.update(req.body);
        return res.json(reply);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not update reply' });
    }
}