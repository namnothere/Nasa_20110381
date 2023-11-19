const parse = require('csv-parse');
const fs = require('fs');
const planets = require('./planets.mongo');

function isHabitablePlanet(planet) {
  return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6;
}

async function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream('data/kepler_data.csv')
    .pipe(
      parse.parse({
      comment: '#',
      columns: true,
    })
    .on('data', (data) => {
      if (isHabitablePlanet(data)) {
        savePlanet(data);
      }
    })
    .on('error', (err) => {
      console.log(err);
    })
    .on('end', async () => {
      const savedPlanets = (await getAllPlanets());

      savedPlanets.map(pl => {
        console.log(pl.kepler_name);
      })

      console.log(`${savedPlanets.length} habitable planets found!`);
      resolve();
    }));
  });
}

async function getAllPlanets() {
  return await planets.find({});
}

async function savePlanet(planet) {
  try {
    await planets.updateOne({
      kepler_name: planet.kepler_name
    }, {
      kepler_name: planet.kepler_name
    }, {
      upsert: true
    });
  } catch (e) {
    console.log("Couldn't save planet");
    throw new Error(e);
  }
}

module.exports = {
  getAllPlanets,
  loadPlanetsData
}