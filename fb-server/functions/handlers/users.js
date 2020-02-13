const config = require('../utils/config');
const firebase = require('firebase');
const BusBoy = require('busboy');
const { admin, db } = require('../utils/admin');
const { handleDetailsUpdate } = require('../utils/proccessors');
firebase.initializeApp(config);
const handleErrorMsg = (code) => code.split('/')[1].replace(/-/g, ' ').split(/\s+/).map(word => word[0].toUpperCase() + word.slice(1)).join(' ');
exports.signup = async (req, res) => {
    try {
        const newUser = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            joined: new Date().toISOString()
        }

        // Checks if username already exists
        const doc = await db.doc(`/users/${newUser.username}`).get();
        if (doc.exists) return res.status(400).json({ message: `Username ${newUser.username} is already taken` })

        //If not creat a new account
        const userCreated = await firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password);
        const token = await userCreated.user.getIdToken();
        const userCredentials = {
            username: newUser.username,
            email: newUser.email,
            created: new Date().toISOString(),
            imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/starter_pic.png?alt=media`,
            userId: userCreated.user.uid
        }
        await db.doc(`/users/${newUser.username}`).set(userCredentials);
        res.status(201).json({ token });
    }
    catch (err) {
        console.error(err);
        res.json({ message: handleErrorMsg(err.code) });
    }
}

exports.signin = async (req, res) => {
    try {
        const data = await firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password);
        const token = await data.user.getIdToken();
        res.json({ token });
    }
    catch (err) {
        console.error(err);
        res.status(400).json({ message: handleErrorMsg(err.code) });
    }
}

exports.uploadImage = (req, res) => {
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
            await db.doc(`/users/${req.user.username}`).update({ imageUrl });
            res.status(201).json({ message: 'Image uploaded successfully' });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ message: handleErrorMsg(err.code) });
        }
    });
    busboy.end(req.rawBody);
}

exports.updateUserDetails = async (req, res) => {
    const updates = handleDetailsUpdate(req.body);
    if (!Object.keys(updates).some(k => updates.hasOwnProperty(k))) return res.status(400).json({ message: 'Nothing to update' });
    try {
        await db.doc(`/users/${req.user.username}`).update(updates);
        res.json({ message: 'User details successfully updated!' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Unable to update user info' });
    }
}

exports.getOwnDetails = async (req, res) => {
    try {
        let userDetails = {};
        const doc = await db.doc(`/users/${req.user.username}`).get();
        if (!doc.exists) {
            res.status(400).json({ message: 'User does not exist' });
        }
        userDetails.credentials = doc.data();
        const LikeData = await db.collection('likes')
            .where('username', '==', req.user.username)
            .get();
        userDetails.likes = [];
        LikeData.forEach(doc => {
            userDetails.likes.push(doc.data());
        });
        const NotifData = await db.collection('notifications')
            .where('to', '==', userDetails.credentials.username)
            .orderBy('created', 'desc')
            .limit(10)
            .get();
        userDetails.notifications = [];
        NotifData.forEach(doc => {
            userDetails.notifications.push(doc.data());
        });
        res.json(userDetails);
    }
    catch (err) {
        console.error(err);
        res.json({ message: err.code });
    }
}

exports.getUserDetails = async (req, res) => {
    try {
        let userDetails = {};
        const doc = await db.doc(`/users/${req.params.username}`).get();
        if (!doc.exists) {
            res.status(400).json({ message: 'User does not exist' });
        }
        userDetails.credentials = doc.data();
        const flushData = await db.collection('flushes').where('user', '==', req.params.username)
            .orderBy('created', 'desc')
            .get();
        userDetails.flushes = [];
        flushData.forEach(doc => {
            const flush = doc.data();
            flush.flushID = doc.id;
            userDetails.flushes.push(flush);
        });
        res.json(userDetails);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.code });
    }
}

exports.markNotifAsRead = async (req, res) => {
    try {
        const batch = db.batch();
        req.body.forEach(notifID => {
            const doc = db.doc(`/notifications/${notifID}`);
            batch.update(doc, { read: true });
        });
        await batch.commit();
        res.json({ message: 'Notifications marked read' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.code });
    }
}