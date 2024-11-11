const axios = require('axios');

let obstacles = [];

exports.getTruckRoute = async (req, res) => {
    const { origin, destination } = req.body;

    try {
        const waypoints = obstacles.map(obstacle => `via:${obstacle}`).join('|');
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;

        const response = await axios.get(`https://maps.googleapis.com/maps/api/directions/json`, {
            params: {
                origin,
                destination,
                waypoints,
                key: apiKey
            }
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addObstacle = (req, res) => {
    const { obstacle } = req.body;
    obstacles.push(obstacle);
    res.status(200).json({ message: 'Obstacle added successfully', obstacles });
};

exports.getObstacles = (req, res) => {
    res.status(200).json(obstacles);
};
