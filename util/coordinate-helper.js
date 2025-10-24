import logger from './logger.js';

/**
 * CoordinateHelper - Handles WTG coordinate generation and positioning
 * to avoid overlapping turbines in layout configurations.
 */
class CoordinateHelper {
  constructor() {
    this.LAT_OFFSET = 0.01; // ~1.1km offset - safe within project area
    this.LON_OFFSET = 0.01; // ~1.1km offset - safe within project area
    this.MAX_WTGS = 20; // Maximum supported WTGs for auto-positioning
  }

  /**
   * Generate offset coordinates for WTG positioning to avoid overlapping.
   * Uses the FIRST row coordinates as base and distributes others around it.
   * Automatically clamps coordinates to stay within valid ranges.
   *
   * Distribution pattern:
   * - WTG 0 (index 0): Base coordinates (no change)
   * - WTGs 1-5 (index 1-5): Positive latitude offsets (+0.01 to +0.05)
   * - WTGs 6-10 (index 6-10): Negative latitude offsets (-0.01 to -0.05)
   * - WTGs 11-15 (index 11-15): Positive longitude offsets (+0.01 to +0.05)
   * - WTGs 16-20 (index 16-20): Negative longitude offsets (-0.01 to -0.05)
   *
   * @param {number} index - WTG index (0-based, 0 = first WTG with base coords)
   * @param {number} baseLat - Base latitude from first row
   * @param {number} baseLon - Base longitude from first row
   * @returns {{lat: string, lon: string}} Adjusted coordinates
   */
  generateWtgCoordinates(index, baseLat, baseLon) {
    if (index >= this.MAX_WTGS) {
      throw new Error(`Maximum ${this.MAX_WTGS} WTGs supported for auto-positioning`);
    }

    // First WTG keeps base coordinates (index 0)
    if (index === 0) {
      logger.debug(`WTG ${index + 1}: Base coordinates - Lat ${baseLat.toFixed(5)}, Lon ${baseLon.toFixed(5)}`);
      return {
        lat: baseLat.toFixed(5),
        lon: baseLon.toFixed(5)
      };
    }

    let latAdjustment = 0;
    let lonAdjustment = 0;

    if (index >= 1 && index <= 5) {
      // WTGs 2-6: Positive latitude offsets
      latAdjustment = this.LAT_OFFSET * index;
    } else if (index >= 6 && index <= 10) {
      // WTGs 7-11: Negative latitude offsets
      latAdjustment = -this.LAT_OFFSET * (index - 5);
    } else if (index >= 11 && index <= 15) {
      // WTGs 12-16: Positive longitude offsets
      lonAdjustment = this.LON_OFFSET * (index - 10);
    } else if (index >= 16 && index <= 19) {
      // WTGs 17-20: Negative longitude offsets
      lonAdjustment = -this.LON_OFFSET * (index - 15);
    }

    // Calculate new coordinates
    let newLat = baseLat + latAdjustment;
    let newLon = baseLon + lonAdjustment;

    // Clamp coordinates to valid ranges to prevent errors
    // Keep 1 degree buffer from absolute limits for safety
    newLat = Math.max(-84, Math.min(84, newLat));
    newLon = Math.max(-179, Math.min(179, newLon));

    const latStr = newLat.toFixed(5);
    const lonStr = newLon.toFixed(5);

    logger.debug(
      `WTG ${index + 1}: Lat ${latStr}, Lon ${lonStr} ` +
        `(offset: lat${latAdjustment >= 0 ? '+' : ''}${latAdjustment.toFixed(3)}, ` +
        `lon${lonAdjustment >= 0 ? '+' : ''}${lonAdjustment.toFixed(3)})`
    );

    return { lat: latStr, lon: lonStr };
  }

  /**
   * Parse coordinate value from input field.
   * Handles various formats and returns float.
   * @param {string} value - Input value to parse
   * @returns {number} Parsed coordinate value
   */
  parseCoordinate(value) {
    const cleaned = value.trim().replace(/[^\d.-]/g, '');
    const parsed = parseFloat(cleaned);

    if (isNaN(parsed)) {
      throw new Error(`Invalid coordinate value: "${value}"`);
    }

    return parsed;
  }

  /**
   * Validate base coordinates are parseable numbers.
   * No range validation needed - coordinates come from valid projects.
   * @param {number} baseLat - Base latitude value
   * @param {number} baseLon - Base longitude value
   */
  validateCoordinates(baseLat, baseLon) {
    if (isNaN(baseLat) || isNaN(baseLon)) {
      throw new Error(`Invalid coordinates: Lat ${baseLat}, Lon ${baseLon}`);
    }
    logger.debug(`✅ Base coordinates: Lat ${baseLat}, Lon ${baseLon}`);
  }
}

export { CoordinateHelper };
