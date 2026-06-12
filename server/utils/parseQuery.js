/**
 * parseQuery.js
 * Extracts structured filters from a plain-English user message.
 * No AI needed — pure regex/keyword extraction.
 * (Swap with NLP/Claude API call for the bonus feature)
 */

const LOCATION_KEYWORDS = [
  "delhi", "mumbai", "bangalore", "bengaluru", "hyderabad", "pune",
  "chennai", "kolkata", "noida", "gurgaon", "gurugram", "ahmedabad",
  "jaipur", "lucknow", "surat", "chandigarh",
];

function parseQuery(message) {
  const text = message.toLowerCase();
  const filters = {};

  // ── Location ──────────────────────────────────
  for (const loc of LOCATION_KEYWORDS) {
    if (text.includes(loc)) {
      filters.location = loc.charAt(0).toUpperCase() + loc.slice(1);
      break;
    }
  }

  // ── Bedrooms ──────────────────────────────────
  // "3 bhk", "3bhk", "3 bedroom", "three bedroom"
  const wordNums = { one: 1, two: 2, three: 3, four: 4, five: 5 };
  let bedroomMatch =
    text.match(/(\d+)\s*(?:bhk|bed(?:room)?s?)/i) ||
    text.match(/(one|two|three|four|five)\s*(?:bhk|bed(?:room)?s?)/i);
  if (bedroomMatch) {
    const raw = bedroomMatch[1];
    filters.bedrooms = isNaN(raw) ? wordNums[raw] : parseInt(raw);
  }

  // ── Budget ────────────────────────────────────
  // Supports: "50 lakhs", "1 crore", "under 80L", "below 2Cr", "50L-1Cr"
  const lakhMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:l(?:akh)?s?)/i);
  const croreMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:cr(?:ore)?s?)/i);

  let budget = null;
  if (croreMatch) budget = parseFloat(croreMatch[1]) * 10000000;
  else if (lakhMatch) budget = parseFloat(lakhMatch[1]) * 100000;

  if (budget) {
    if (/(?:under|below|less than|upto|up to|within)/.test(text)) {
      filters.maxBudget = budget;
    } else if (/(?:above|over|more than|atleast|at least)/.test(text)) {
      filters.minBudget = budget;
    } else {
      // Assume ±20% range around the stated budget
      filters.minBudget = budget * 0.8;
      filters.maxBudget = budget * 1.2;
    }
  }

  // ── Amenities ─────────────────────────────────
  const amenityKeywords = ["gym", "pool", "parking", "garden", "security", "lift", "elevator", "clubhouse"];
  filters.amenities = amenityKeywords.filter((a) => text.includes(a));

  return filters;
}

module.exports = { parseQuery };
