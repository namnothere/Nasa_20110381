const launches = require('./launches.mongo');
const planets = require('./planets.mongo');
const axios = require('axios');

const DEFAULT_FLIGHT_NUMBER = 100;
const SPACEX_API = 'https://api.spacexdata.com/v4/launches/query';

async function loadLaunchesData() {

  const firstLaunch = await launches.findOne({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat',
  });

  if (firstLaunch) {
    console.log("Launch data already loaded");
    return;
  } 

  let data = {
    "query": {},
    "options": {
      "populate": [
          {
            "path": "rocket",
            "select": {
                "name": 1
            }
          },
          {
            "path": "payloads",
            "select": {
                "customers": 1
            }
          }
      ],
      "pagination": false
    }
  };

  const response = await axios.post(SPACEX_API, data);
  if (!response.status === 200) {
    console.log("Problem downloading launch data");
    throw new Error("Launch data download failed");
  }

  const launchDocs = response.data.docs;
  const promises = launchDocs.map(async(doc) => {
    const payloads = doc['payloads'];
    const customers = payloads.flatMap((payload) => {
      return payload['customers'];
    });

    const launch = {
      flightNumber: doc['flight_number'],
      mission: doc['name'],
      rocket: doc['rocket']['name'],
      launchDate: doc['date_local'],
      upcoming: doc['upcoming'],
      success: doc['success'],
      customers
    }

    console.log(`${launch.flightNumber} ${launch.mission}`);
    await saveLaunch(launch);
  });

  await Promise.all(promises);
}

async function getLatestFlightNumber() {
  const latest = await launches.findOne()
    .sort('-flightNumber');
  if (!latest) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latest.flightNumber;
}

function existsLaunch(id) {
  return launches.findOne({ flightNumber: id });
}

async function getAllLaunches(skip, limit) {
  return launches.find({})
    .skip(skip)
    .limit(limit);
}

async function addNewLaunch(launch) {

  const planet = await planets.findOne({
    kepler_name: launch.target
  })

  if (!planet) {
    throw new Error('No matching planet found');
  }

  const latestFlightNumber = (await getLatestFlightNumber()) + 1;

  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ['NASA', 'Zero To Mastery'],
    flightNumber: latestFlightNumber
  })
  await saveLaunch(newLaunch);
}

async function saveLaunch(launch) {
  await launches.findOneAndUpdate({
    flightNumber: launch.flightNumber
  }, launch,
  {
    upsert: true
  });
}

async function abortLaunch(id) {
  const aborted = await launches.updateOne({
    flightNumber: id
  }, {
    upcoming: false,
    success: false
  })
  return aborted.modifiedCount === 1;
}

module.exports = {
    loadLaunchesData,
    getAllLaunches,
    addNewLaunch,
    existsLaunch,
    abortLaunch
};