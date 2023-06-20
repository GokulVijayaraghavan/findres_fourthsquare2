import React, { useState, useEffect } from 'react';
import { Card, Container, Form, Button } from 'react-bootstrap';

function App() {
  const [airbnbName, setAirbnbName] = useState('');
  const [suburb, setSuburb] = useState('');
  const [inputId, setInputId] = useState('');
  const [response, setResponse] = useState(0);
  const [restaurants, setRestaurants] = useState([]);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [visibleCount, setVisibleCount] = useState(10);

  const loadMoreRestaurants = () => {
    setVisibleCount((prevCount) => prevCount + 10);
  };

  useEffect(() => {
    if (response === 4) {
      console.log(latitude, longitude);
      fetch('http://localhost:3000/api/restaurants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latitude, longitude }), // Send latitude and longitude
      })
        .then((response) => response.json())
        .then((data) => setRestaurants(data))
        .catch((error) => console.log('Error:', error));
      console.log(restaurants);
    }
  }, [response]);

  const handleAirbnbNameSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/selectedAirbnb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: airbnbName }),
      });

      // Handle the response from the backend
      const data = await response.json();
      setResponse(data.response);
      setLatitude(data.latitude); // Set latitude from response
      setLongitude(data.longitude); // Set longitude from response
      console.log(data);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const handleSuburbSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/selectedAirbnb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: airbnbName, suburb }),
      });

      // Handle the response from the backend
      const data = await response.json();
      setResponse(data.response);
      setLatitude(data.latitude); // Set latitude from response
      setLongitude(data.longitude); // Set longitude from response
      console.log(data);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const handleInputIdSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/selectedAirbnb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: airbnbName, suburb, id: inputId }),
      });

      // Handle the response from the backend
      const data = await response.json();
      setResponse(data.response);
      setLatitude(data.latitude); // Set latitude from response
      setLongitude(data.longitude); // Set longitude from response
      console.log(data);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const resetForm = () => {
    setAirbnbName('');
    setSuburb('');
    setInputId('');
    setResponse(0);
    setRestaurants([]);
    setLatitude(0);
    setLongitude(0);
  };

  const handleOk = () => {
    resetForm();
    alert('No matching Airbnb found.');
  };

  return (
    <div className="App">
      <Container className="d-flex align-items-center justify-content-center mx-auto my-auto">
        {/* <body className="App-header"> */}
          {response === 0 && (
            <div className="d-flex text-center mx-auto my-auto">
              <Form onSubmit={handleAirbnbNameSubmit}>
                <h3>Find the restaurants near your location</h3>
                <Form.Group controlId="airbnbName">
                  <Form.Label>Airbnb Name:</Form.Label>
                  <Form.Control
                    type="text"
                    value={airbnbName}
                    onChange={(e) => setAirbnbName(e.target.value)}
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Form>
            </div>
          )}

          {response === 1 && (
            <div className="text-center">
              <p>Please enter the suburb so that we can locate the exact Airbnb location.</p>
              <Form onSubmit={handleSuburbSubmit}>
                <Form.Group controlId="suburb">
                  <Form.Label>Suburb:</Form.Label>
                  <Form.Control
                    type="text"
                    value={suburb}
                    onChange={(e) => setSuburb(e.target.value)}
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Form>
              <Button variant="secondary" onClick={resetForm}>
                Go back
              </Button>
            </div>
          )}

          {response === 2 && (
            <div className="text-center">
              <Form onSubmit={handleInputIdSubmit}>
                <Form.Group controlId="inputId">
                  <Form.Label>Input ID:</Form.Label>
                  <Form.Control
                    type="text"
                    value={inputId}
                    onChange={(e) => setInputId(e.target.value)}
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Form>
              <Button variant="secondary" onClick={resetForm}>
                Go back
              </Button>
            </div>
          )}

          {response === 3 && (
            <div className="text-center">
              <p>There is no Airbnb for the given input.</p>
              <Button variant="primary" onClick={handleOk}>
                OK
              </Button>
            </div>
          )}

          {response === 4 && (
            <div>
              <h1>Restaurants</h1>

              <div>
                {restaurants.slice(0, visibleCount).map((restaurant) => (
                  <div key={restaurant._id} className="restaurant-box">
                    <Card
                      style={{ width: '40rem', borderWidth: '2px', borderColor: 'gray' }}
                      bg="light"
                      text="dark"
                      className="mb-4"
                    >
                      <Card.Body>
                        <Card.Header style={{ backgroundColor: 'lightblue' }} className="text-black font-40px d-flex justify-content-between text-center">
                          <span>{restaurant.name}</span>
                          <span>{restaurant.distance}</span>
                        </Card.Header>
                        <Card.Text>
                          Cuisine: {restaurant.cuisine}
                        </Card.Text>
                        <Card.Text>
                          Address: {restaurant.address.building} {restaurant.address.street}, {restaurant.address.zipcode}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </div>
                ))}
              </div>

              <div className="text-center mt-10">
                {visibleCount < restaurants.length && (
                  <Button variant="primary" onClick={loadMoreRestaurants}>
                    Load More
                  </Button>
                )}
                <Button variant="secondary" onClick={resetForm} className="ms-2">
                  Go back
                </Button>
              </div>
            </div>
          )}
        {/* </body> */}
      </Container>
    </div>
  );
}

export default App;
