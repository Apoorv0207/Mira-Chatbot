const path = require("path");

// ──────────────────────────────────────────────
//  PUT YOUR 3 JSON FILES IN:  server/data/
//  • property_basics.json
//  • property_characteristics.json
//  • property_images.json
// ──────────────────────────────────────────────

let mergedProperties = null; // cached after first load

function loadAndMerge() {
  if (mergedProperties) return mergedProperties; // return cache

  const basics = require(path.join(__dirname, "../data/property_basics.json"));
  const characteristics = require(path.join(__dirname, "../data/property_characteristics.json"));
  const images = require(path.join(__dirname, "../data/property_images.json"));

  // Build lookup maps for O(1) joins
  const charMap = {};
  characteristics.forEach((c) => (charMap[c.id] = c));

  const imgMap = {};
  images.forEach((i) => (imgMap[i.id] = i));

  // Merge all three by id
  mergedProperties = basics.map((b) => ({
    ...b,
    ...(charMap[b.id] || {}),
    ...(imgMap[b.id] || {}),
  }));

  console.log(`✅ Merged ${mergedProperties.length} properties from 3 JSON sources`);
  return mergedProperties;
}

/**
 * Filter merged properties based on user preferences
 * @param {Object} filters - { location, minBudget, maxBudget, bedrooms, bathrooms, amenities }
 */
function filterProperties(filters = {}) {
  const all = loadAndMerge();
  const { location, minBudget, maxBudget, bedrooms, bathrooms, amenities } = filters;

  return all.filter((p) => {
    // Location match (case-insensitive partial)
    if (location && !p.location?.toLowerCase().includes(location.toLowerCase())) return false;

    // Budget range
    if (minBudget && p.price < minBudget) return false;
    if (maxBudget && p.price > maxBudget) return false;

    // Bedrooms (exact or "at least")
    if (bedrooms && p.bedrooms < bedrooms) return false;

    // Bathrooms
    if (bathrooms && p.bathrooms < bathrooms) return false;

    // Amenities (match any requested)
    if (amenities?.length && p.amenities) {
      const hasAll = amenities.every((a) =>
        p.amenities.map((x) => x.toLowerCase()).includes(a.toLowerCase())
      );
      if (!hasAll) return false;
    }

    return true;
  });
}

module.exports = { loadAndMerge, filterProperties };
