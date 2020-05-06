'use strict';

const express = require("express");
const MongoClient = require("mongodb");
const port = 4567;
const app = express();
app.use(require("cors")());
app.use(require("body-parser").json({ limit: "50mb" }));


const uri = "mongodb+srv://user:user@cluster0-mvu0f.mongodb.net/test?retryWrites=true&w=majority";

MongoClient.connect(uri, (err, client) => {
    const collection = client.db('gardendb').collection('map')
    app.get("/map", (req, res) => {
        collection.findOne((err, mapString) => {
            if (err) {
                res.send("Error in GET req.");
            } else {
                res.send(mapString);
            }
        });
    });

  app.put("/map", (req, res) => {
    collection.findOne((err, mapString) => {
      if (err) {
        res.send("Error in PUT req.");
      } else {
        collection.updateOne(
          { user: req.params.user }, 
          { $set: {map: req.body.map } }, 
          (err, r) => {
            if (err) {
              console.log("Error in updating database information");
            } else {
			  console.log(req)
              res.send("Updated successfully");
            }
          }
        );
      }
    });
  })
    


    var listener = app.listen(port, () => {
        console.log("Your app is listening on port " + listener.address().port);
    });
    
})

