const express = require("express");
const db = require("../src/database");

const router = express.Router();

module.exports = router;

collection = db.collection("houses");

//Get all Method
router.get("/getAll", async (req, res) => {
    const page = parseInt(req.query.p) ?? 1;
    const perPage = parseInt(req.query.perPage) ?? 20;
    const start = perPage * (page - 1);
    const q = req.query.q;


    
    
    const ag = [ { $facet: {
        listings: [{ $skip: start }, { $limit: perPage }],
        total: [{ $count: "count" }],
    }}];
    if (q) {
        ag.unshift({
            $search: {
                index: "default",
                text: {
                    query: q,
                    path: {
                        wildcard: "*",
                    },
                },
            },
        });
    }

    const r = await collection.aggregate(ag).next();

    res.json({
        listings: r.listings,
        count: r.total[0]?.count ?? 0
    });
});

//Get by ID Method
router.get("/getOne/:id", async (req, res) => {
    res.json(await collection.findOne({ ID: req.params.id }));
});
