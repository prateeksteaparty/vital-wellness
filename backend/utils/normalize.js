const DIET_MAP = {
  "vegetarian": "veg",
  "non-vegetarian": "nonveg",
  "vegan": "vegan",
  "eggetarian": "eggetarian",
  "veg": "veg",
  "nonveg": "nonveg"
};

exports.normalizeDiet = (diet) => {
  if (!diet) return null;
  return DIET_MAP[diet.toLowerCase()] || null;
};
