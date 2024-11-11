const express = require('express');
const app = express();
const port = process.env.PORT || 3001;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const routes = require('./routes/routes');
app.use('/api', routes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

