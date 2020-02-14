const { admin, db } = require('../utils/admin');
const BusBoy = require('busboy');
const config = require('../utils/config');

exports.getAllFlushes = async (req, res) => {
    try {
        const data = await db.collection('flushes')
            .orderBy('created', 'desc')
            .get();
        let flushes = [];
        data.forEach(doc => {
            const flush = doc.data();
            flush.flushID = doc.id;
            flushes.push(flush);
        });
        return res.json(flushes);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not fetch flushes' });
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
        res.json(resFLush);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not post flush' });
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
        flush.id = doc.id;
        const commentData = await db.collection('comments')
            .orderBy('created', 'desc')
            .where('flushID', '==', flush.id)
            .get();
        flush.comments = [];
        commentData.forEach(doc => {
            flush.comments.push(doc.data());
        });
        return res.json(flush);
    }

    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not fetch data from db' });
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
            created: new Date().toISOString()
        };
        await db.collection('comments').add(newComment);
        await db.doc(`/flushes/${req.params.flushID}`).update({ commentCount: doc.data().commentCount + 1 });
        res.json({ message: 'Comment posted successfully' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not post a comment' });
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
        await db.collection('likes').add({ flushID: req.params.flushID, username: req.user.username });
        flushData.likeCount++;
        await db.doc(`/flushes/${req.params.flushID}`).update({ likeCount: flushData.likeCount });
        res.json(flushData);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not like flush' });
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
        await db.doc(`/likes/${likeData.docs[0].id}`).delete();
        flushData.likeCount--;
        await db.doc(`/flushes/${req.params.flushID}`).update({ likeCount: flushData.likeCount });
        res.json(flushData);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not unlike flush' });
    }
}

exports.deleteFlush = async (req, res) => {
    try {
        const doc = await db.doc(`/flushes/${req.params.flushID}`).get();
        if (!doc.exists) return res.status(404).json({ message: 'Flush does not exist' });
        if (doc.data().user !== req.user.username) return res.status(403).json({ message: 'You are not authorized to delete this flush' });
        await doc.ref.delete();
        res.json({ message: 'Flush deleted' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not delete flush' });
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
            res.status(201).json({ imageUrl });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Could not upload photo' });
        }
    });
    busboy.end(req.rawBody);
}

exports.editFlush = async (req, res) => {
    try {
        if (!req.body.text.trim() && !req.body.photoUrl.trim()) return res.status(400).json({ message: 'Cannot make a flush empty' });
        await db.doc(`/flushes/${req.params.flushID}`).update(req.body);
        res.json({ message: 'Flush successfully updated' });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Could not update flush' });
    }
}

exports.getComments = async (req, res) => {
    try {
        const data = await db.collection('comments')
            .where('flushID', '==', req.params.flushID)
            .orderBy('created', 'desc')
            .get();
        res.json(data.map(doc => doc.data()))
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not fetch comments' });
    }
}