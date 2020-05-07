'use strict';

const MongoClient = require("mongodb");


const uri = "mongodb+srv://user:user@cluster0-mvu0f.mongodb.net/test?retryWrites=true&w=majority";

let map = [];

MongoClient.connect(uri, (err, client) => {
    const collection = client.db('gardendb').collection('map')
	collection.findOne((err, mapString) => {
            if (err) {
                res.send("Error in GET req.");
            } else {
				console.log(mapString)
				map = mapString
            }
        });
})

return map

