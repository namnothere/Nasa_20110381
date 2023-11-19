const http = require('http');
const app = require('./app');
const { loadPlanetsData } = require('./models/planets.model');
const { loadLaunchesData } = require('./models/launches.model');
const { connect } = require('./services/mongo/mongo');

const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

async function startServer() {
  await connect();
  await loadPlanetsData();
  await loadLaunchesData();
};

startServer().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  })
});
