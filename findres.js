const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const port = 3000;
console.log("p started")
const uri = 'mongodb+srv://gvijaya5:fourthtask2@cluster0.7d3djjw.mongodb.net/?retryWrites=true&w=majority';


app.use(express.json());
app.use(cors());
app.post('/api/selectedAirbnb', async (req, res) => {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  client.connect()
  console.log("Connected client")
  try {
    console.log("inside the 1st api");
    const { name, suburb, id } = req.body;
    console.log(req.body)
    let query = {};
    delete(selectedAirbnb)
    if (name && !suburb) {
      query.name = name;
    }

    let selectedAirbnb = await client.db('sample_airbnb').collection('listingsAndReviews').find(query).toArray();
    
    if (name && suburb) {
      query.name = name;
      query.address = {}
      query.address.suburb = suburb;
      console.log(query)
      selectedAirbnb = await client.db('sample_airbnb').collection('listingsAndReviews').find(query).toArray();
      if (selectedAirbnb.length === 0) {
        console.log("NONE")
        res.json({ response: 3, message: 'No matching Airbnb found.' });
        return;}
      
      if (selectedAirbnb.length > 1 ) {
        console.log("Multiple matching Airbnbs found.")
        res.json({ response: 2, message: 'Multiple matching Airbnbs found enter the airbnb id as well.' });
        return;
    }}

    if (name && id) {
      query.id = id;
      selectedAirbnb = await client.db('sample_airbnb').collection('listingsAndReviews').find(query).toArray();
      
      if (selectedAirbnb.length === 0) {
        console.log("NONE")
        res.json({ response: 3, message: 'No matching Airbnb found.' });
        return;
    }}

    if (selectedAirbnb.length === 0) {
      console.log("NONE")
      res.json({ response: 3, message: 'No matching Airbnb found.' });
      return;
    }
    if (selectedAirbnb.length >1) {
      console.log("Multiple")
      res.json({ response: 1, message: 'Multiple Airbnb found enter the suburb as well' });
      return;
    }



    const selectedAirbnbItem = selectedAirbnb[0];
    const latitude = selectedAirbnbItem.address.location.coordinates[1];
    const longitude = selectedAirbnbItem.address.location.coordinates[0];

    // Do something with latitude and longitude

    res.json({ response: 4, latitude,longitude });

  } catch (error) {
    console.error(error);
    res.status(500).json({ response: -1, error: 'Internal Server Error' });
  } finally {
    console.log("cloding client")
    client.close();
  }
});


  app.use(express.json());

  app.post('/api/restaurants', async (req, res) => {
    let client; // Declare the client variable outside the try block
  
    try {
      const { latitude, longitude } = req.body;
      const uri = 'mongodb+srv://gvijaya5:fourthtask2@cluster0.7d3djjw.mongodb.net/?retryWrites=true&w=majority';
      console.log(latitude, longitude);
      client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
      await client.connect(); // Wait for the connection to be established
      console.log("Connected client");
  
      const db = client.db('sample_restaurants');
      const collection = db.collection('restaurants');
      collection.createIndex({ 'address.coord': '2dsphere' });
  
      const query = {
        'address.coord': {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude]
            },
            $maxDistance: 3 * 1609.34, // Maximum distance in meters (e.g., 5000 meters = 5 km)
          },
        },
      };
      console.log(query)
      const restaurants = await collection.find(query).toArray(); // Wait for the query execution to complete
      console.log(restaurants);
      res.json(restaurants);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      if (client) {
        client.close(); // Close the connection if the client is defined
      }
    }
  });
  
  
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });