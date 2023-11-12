const express = require("express");
const db = require("../src/database");
const axios = require("../src/axios");
const logger = require("../src/log");
const listings = require("../src/listings");

const router = express.Router();

module.exports = router;

collection = db.collection("houses");

//Get all Method
router.post("/getAll", async (req, res) => {
    const source = req.body || {};

    const page = parseInt(source.p) || 1;
    const perPage = parseInt(source.perPage) || 20;
    const start = perPage * (page - 1);

    const aggregationChain = [
        {
            $facet: {
                listings: [{ $skip: start }, { $limit: perPage }],
                total: [{ $count: "count" }],
            },
        },
    ];

    const filter = listings.createFilter(source);
    aggregationChain.unshift(...filter);

    if (source.municipalities) {
        aggregationChain.unshift({
            $match: {
                "locality.id": {
                    $in: source.municipalities
                        .split(",")
                        .map((a) => parseInt(a))
                        .map((a) => (a === 0 ? null : a)),
                },
            },
        });
    }

    const aggregationResult = await collection.aggregate(aggregationChain).next();


    const result = {
        listings: aggregationResult.listings,
        count: aggregationResult.total[0]?.count ?? 0,
        chain: aggregationChain,
    };

    res.json(result);
});


router.get("/listing/:listingId", async (req, res) => {

    const query = {
         id: req.params.listingId 
    };

    const result = await collection.findOne(query);


    res.json(result);
 }
);

router.get("/municipalities", async (req, res) => {
    const aggregationChain = listings.createFilter(req.query);
    aggregationChain.push({
        $group: {
            _id: "$locality.id",
            name: { $first: "$locality.name" },
            count: { $count: {} },
        },
    });

    if (req.query.ranges) {
        const ranges = [];
        for (const range of req.query.ranges) {
            const [min, max] = range.split("-").map((a) => parseInt(a));
            const obj = {};
            if (min) obj.$gte = min;
            if (max) obj.$lte = max;
            if (min || max) ranges.push({ count: obj });
        }
        if (ranges.length > 1) aggregationChain.push({ $match: { $or: ranges } });
        else aggregationChain.push({ $match: ranges[0] });
    }

    const result = await (await collection.aggregate(aggregationChain)).toArray();

    res.json(result);
});

router.get("/suggest", (req, res) => {
    axios
        .get("https://www.sreality.cz/api/cs/v2/suggest", {
            params: {
                ...req.query,
            },
            headers: {
                Host: "www.sreality.cz",
            },
        })
        .then((response) => {
            res.json(response.data);
        })
        .catch((error) => {
            logger.error(error);
        });
});
