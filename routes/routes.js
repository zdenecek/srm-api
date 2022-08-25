const express = require('express');
const db = require('../src/database');

const router = express.Router()

module.exports = router;

collection = db.collection('houses');

//Get all Method
router.get('/getAll', async (req, res) => {

    const page = req.query.p ?? 1;
    const perPage = 50;
    const start = perPage * (page - 1);

    console.log(page)

    const result = collection.find().skip(start).limit(perPage).toArray();

    res.json(await result);
})

//Get by ID Method
router.get('/getOne/:id', async (req, res) => {
    res.json(await collection.findOne({ ID: req.params.id }));
})
