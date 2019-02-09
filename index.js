const express = require('express');
const basicAuth = require('express-basic-auth');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const db = require('./db')
const collection = 'games';
const router = express.Router();

app.use(bodyParser.json());
app.use('/', router);
app.use(express.static('public'));
app.use('/edit', basicAuth({
    users: { 'admin': 'admin' },
    challenge: true,
    realm: 'ofthemadgod',
}))


console.clear();
console.log('Setup done!')

db.connect((err) => {
    if (err) {
        console.log('Cannot connect to DB!');
        process.exit(1);
    } else {
        app.listen(3000, () => {
            console.log('Connected to DB!');
            console.log('Listening on 3000!');
        });
    }
})

router.get('/', (req, res, next) => {
    next();
})

app.get('/edit', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'edit.html'));
});

app.post('/edit/newgame', (req, res) => {
    let result;

    try {
        result = db.getDB().collection(collection).insertOne(req.body);
    } catch (e) {
        console.log(e);
        res.json(e);
    } finally {
        res.json(result);
    }
});

app.post('/edit/editgame', (req, res) => {
    let result;

    try {
        result = db.getDB().collection(collection).replaceOne({ "_id": db.getPrimaryKey(req.body._id) }, {
            "name": req.body.name,
            "originalPlatform": req.body.originalPlatform,
            "fiveStarRating": req.body.fiveStarRating,
            "review": req.body.review,
        });
    } catch (e) {
        console.log(e);
        res.json(e);
    } finally {
        res.json(result);
    }
});

app.post('/edit/delgame', (req, res) => {
    let result;

    try {
        result = db.getDB().collection(collection).deleteOne({ "_id": db.getPrimaryKey(req.body.id) });
    } catch (e) {
        console.log(e);
        res.json(e);
    } finally {
        res.json(result);
    }
});

app.post('/game', (req, res) => {
    db.getDB().collection(collection).find({ _id: db.getPrimaryKey(req.body._id) }).toArray((err, docs) => {
        if (err) {
            console.log(err);
        } else {
            res.json(docs);
        }
    });
});

app.get('/games', (req, res) => {
    db.getDB().collection(collection).find({}).toArray((err, docs) => {
        if (err) {
            console.log(err);
        } else {
            res.json(docs);
        }
    });
});