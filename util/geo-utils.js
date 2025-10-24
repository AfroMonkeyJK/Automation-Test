const regionBounds = {
  europe: {
    lat: [44.0, 50.1],
    lon: [0.0, 15.2]
  },
  asia: {
    lat: [5.0, 77.0],
    lon: [60.0, 180.0]
  },
  america: {
    lat: [-56.0, 71.0],
    lon: [-170.0, -30.0]
  }
};

const biddingZoneCoordinates = {
  '1 Bidding Zone (France)': {
    latitude: '45.844',
    longitude: '-0.808',
    region: 'europe'
  },
  'No Bidding Zone (Austria)': {
    latitude: '47.91341',
    longitude: '14.89598',
    region: 'europe'
  },
  '2 Bidding Zones (Andorra)': {
    latitude: '42.50718',
    longitude: '1.53382',
    region: 'europe'
  }
};

/**
 * Returns random latitude and longitude coordinates for a specified region.
 * The coordinates are generated within predefined bounds for each region.
 * @param {string} region Region for which to generate coordinates (e.g., "europe", "asia", "america").
 * @returns Latitude and Longitude coordinates for the specified region.
 */
function getRandomCoordinates(region) {
  const bounds = regionBounds[region];
  if (!bounds) {
    throw new Error(`Unsupported region: ${region}. Available regions: ${Object.keys(regionBounds).join(', ')}`);
  }
  const lat = (Math.random() * (bounds.lat[1] - bounds.lat[0]) + bounds.lat[0]).toFixed(5);
  const lon = (Math.random() * (bounds.lon[1] - bounds.lon[0]) + bounds.lon[0]).toFixed(5);
  return { latitude: lat, longitude: lon };
}

/**
 * Returns specific coordinates for bidding zone testing
 * @param {string} biddingZone The bidding zone type
 * @returns {Object} Coordinates object with latitude and longitude
 * @throws {Error} If bidding zone is not found
 */
function getBiddingZoneCoordinates(biddingZone) {
  const coordinates = biddingZoneCoordinates[biddingZone];
  if (!coordinates) {
    const availableZones = Object.keys(biddingZoneCoordinates).join(', ');
    throw new Error(`Unknown bidding zone: ${biddingZone}. Available zones: ${availableZones}`);
  }
  return {
    latitude: coordinates.latitude,
    longitude: coordinates.longitude
  };
}

export { getRandomCoordinates, getBiddingZoneCoordinates };
