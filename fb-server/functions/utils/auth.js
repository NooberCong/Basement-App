const { admin, db } = require('../utils/admin');

module.exports = async (req, res, next) => {
    try {
        if (!req.headers.authtoken.startsWith('Bearer ')) {
            return res.status(403).json({message: 'Unauthorized'});
        }
        let token = req.headers.authtoken.split(' ')[1];
        const decodedData = await admin.auth().verifyIdToken(token);
        req.user = decodedData;
        const userData = await db.collection('users')
                     .where('userId', '==', req.user.uid)
                     .limit(1)
                     .get();
        req.user.username = userData.docs[0].data().username;
        req.user.imageUrl = userData.docs[0].data().imageUrl;
        return next();
    }
    catch (err) {
        console.error(err);
        res.status(403).json({message: 'Invalid token'});
    }
}