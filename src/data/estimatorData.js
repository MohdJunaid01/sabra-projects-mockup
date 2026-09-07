// Budget Estimator & Consultation Options for Sabra Projects

export const PROJECT_TYPES = [
  {
    id: 'full-kitchen',
    name: 'Full Kitchen Renovation',
    tagline: 'Complete transformation of cabinetry, benchtops, services & layout',
    baseCost: 38000,
    timeframe: '6–8 weeks'
  },
  {
    id: 'new-build',
    name: 'New Build Joinery',
    tagline: 'Architectural joinery built to architectural specifications',
    baseCost: 44000,
    timeframe: '8–10 weeks'
  },
  {
    id: 'kitchen-butler',
    name: "Kitchen & Butler's Pantry",
    tagline: 'Dual-zone culinary workspace with secondary prep joinery',
    baseCost: 56000,
    timeframe: '8–12 weeks'
  },
  {
    id: 'compact-luxury',
    name: 'Apartment & Compact Luxury',
    tagline: 'High-density precision joinery with integrated European appliances',
    baseCost: 32000,
    timeframe: '4–6 weeks'
  }
];

export const SIZES = [
  {
    id: 'compact',
    name: 'Compact / Galley',
    dimension: 'Under 12 m²',
    description: 'Single-wall or streamlined galley layout with maximized vertical storage',
    multiplier: 0.85
  },
  {
    id: 'medium',
    name: 'Mid-Sized / L-Shape',
    dimension: '12 – 20 m²',
    description: 'Open-plan L-shape or straight run with integrated 2.4m central island',
    multiplier: 1.0
  },
  {
    id: 'large',
    name: 'Expansive Architectural',
    dimension: '20 m² +',
    description: 'Statement 3.2m+ cantilevered stone island, tall appliance bank & display units',
    multiplier: 1.35
  }
];

export const FINISH_LEVELS = [
  {
    id: 'refined',
    name: 'Refined Standard',
    description: 'High-durability matte polyurethane, 20mm engineered stone, Blum soft-close',
    multiplier: 1.0
  },
  {
    id: 'premium',
    name: 'Premium Architectural',
    description: 'Natural oak timber veneer accents, 40mm mitred stone slab, architectural hardware',
    multiplier: 1.22
  },
  {
    id: 'bespoke',
    name: 'Bespoke Luxury',
    description: 'Full custom smoked oak veneers, imported Calacatta marble, integrated LED channels',
    multiplier: 1.48
  }
];

export const OPTIONAL_FEATURES = [
  {
    id: 'island',
    name: 'Waterfall Island Ends',
    description: 'Continuous stone book-matched waterfall returns down both sides',
    cost: 5800
  },
  {
    id: 'stone-splashback',
    name: 'Full-Height Stone Splashback',
    description: 'Seamless floor-to-ceiling slab backing matching the benchtop surface',
    cost: 4600
  },
  {
    id: 'integrated-appliances',
    name: 'Fully Integrated Appliance Fronts',
    description: 'Concealed fridge/freezer and dishwasher panels flush with cabinetry',
    cost: 3900
  },
  {
    id: 'custom-storage',
    name: 'Custom Internal Organisation & Larder',
    description: 'Tandembox pull-out inner drawers, spice inserts & servo-drive electronic touch opening',
    cost: 4800
  },
  {
    id: 'led-lighting',
    name: 'Concealed LED Architectural Shadowline',
    description: 'Recessed warm 2700K extrusion along plinths, under-cabinet and island overhang',
    cost: 2600
  }
];

export const SYDNEY_SUBURBS = [
  { name: 'Mosman', region: 'Lower North Shore' },
  { name: 'Paddington', region: 'Eastern Suburbs' },
  { name: 'Bellevue Hill', region: 'Eastern Suburbs' },
  { name: 'Double Bay', region: 'Eastern Suburbs' },
  { name: 'Vaucluse', region: 'Eastern Suburbs' },
  { name: 'Woollahra', region: 'Eastern Suburbs' },
  { name: 'Balmain', region: 'Inner West' },
  { name: 'Surry Hills', region: 'City & Inner East' },
  { name: 'Manly', region: 'Northern Beaches' },
  { name: 'Neutral Bay', region: 'Lower North Shore' },
  { name: 'Cronulla', region: 'Sutherland Shire' },
  { name: 'Hunters Hill', region: 'Lower North Shore' }
];

export const TIMELINES = [
  { id: 'immediate', label: 'Immediately', subtext: 'Plans ready / construction imminent' },
  { id: '1-3-months', label: '1 – 3 Months', subtext: 'Finalising plans & contractor selection' },
  { id: '3-6-months', label: '3 – 6 Months', subtext: 'Early architectural & design phase' },
  { id: 'exploring', label: 'Just Exploring', subtext: 'Benchmarking ideas & investment budgets' }
];

export const AVAILABLE_SLOTS = [
  { day: 'Thursday, 12 Oct', time: '10:00 AM AEST', type: 'Design Studio Visit' },
  { day: 'Thursday, 12 Oct', time: '2:30 PM AEST', type: 'Virtual Video Session' },
  { day: 'Friday, 13 Oct', time: '11:00 AM AEST', type: 'On-Site Architectural Review' },
  { day: 'Friday, 13 Oct', time: '3:00 PM AEST', type: 'Design Studio Visit' },
  { day: 'Monday, 16 Oct', time: '9:30 AM AEST', type: 'Virtual Video Session' },
  { day: 'Tuesday, 17 Oct', time: '1:30 PM AEST', type: 'Design Studio Visit' }
];

// Central Deterministic Pricing Model
export const PRICING = {
  projectSize: {
    compact: 22000,
    small: 22000,
    medium: 35000,
    large: 50000
  },

  finishLevel: {
    essential: 0,
    refined: 0,
    standard: 0,
    premium: 5000,
    luxury: 12000,
    bespoke: 12000
  },

  cabinetMaterial: {
    // Timber
    'natural-oak': 3500,
    'smoked-oak': 4000,
    'white-oak': 3500,
    'american-oak': 3500,
    'walnut': 5000,
    'dark-walnut': 5000,
    'black-ash': 4500,
    'natural-ash': 3500,
    'tasmanian-oak': 3500,
    'spotted-gum': 4000,
    'blackwood': 4500,
    'ironbark': 4500,
    'driftwood': 3500,
    'aged-oak': 4000,
    'charred-timber': 4500,
    'bleached-oak': 3500,
    // Painted / Lacquer / Veneer
    'pure-matte-white': 2500,
    'warm-alabaster': 2500,
    'chalk-bone': 2500,
    'fluted-profile': 3500,
    'cashmere-grey': 2500,
    'olive-drab': 2500,
    'raw-concrete': 3000,
    'cast-terrazzo': 3500,
    'premium-lacquer': 4500,
    standard: 0
  },

  benchtop: {
    calacatta: 6500,
    travertine: 3500,
    charcoal: 3500,
    concrete: 0,
    standard: 0
  },

  hardware: {
    black: 1500,
    steel: 1500,
    'brushed-brass': 3000,
    handleless: 3000,
    standard: 0
  },

  features: {
    island: 5000,
    'integrated-appliances': 7000,
    'custom-storage': 2500,
    'feature-lighting': 1800,
    'led-lighting': 1800,
    'stone-splashback': 4600
  }
};

// Deterministic calculateEstimate function consuming existing configuration
export function calculateEstimate(configuration = {}) {
  const sizeKey = configuration.size || 'medium';
  const finishKey = configuration.finishLevel || 'premium';
  const materialKey = configuration.cabinetFinish || 'smoked-oak';
  const benchtopKey = configuration.benchtop || 'calacatta';
  const hardwareKey = configuration.hardware || 'brushed-brass';
  const featuresList = configuration.features || [];

  // Base price from project size
  const basePrice = PRICING.projectSize[sizeKey] ?? PRICING.projectSize.medium;

  // Finish level addon
  const finishAddon = PRICING.finishLevel[finishKey] ?? PRICING.finishLevel.premium;

  // Material addon
  const materialAddon = PRICING.cabinetMaterial[materialKey] ?? 3500;

  // Benchtop addon
  const benchtopAddon = PRICING.benchtop[benchtopKey] ?? 3500;

  // Hardware addon
  const hardwareAddon = PRICING.hardware[hardwareKey] ?? 1500;

  // Features total
  let featuresTotal = 0;
  const featureBreakdowns = [];

  featuresList.forEach(feat => {
    const cost = PRICING.features[feat] ?? 0;
    if (cost > 0) {
      featuresTotal += cost;
      let featLabel = 'Optional Feature';
      if (feat === 'island') featLabel = 'Waterfall Island Ends';
      else if (feat === 'integrated-appliances') featLabel = 'Integrated Appliances';
      else if (feat === 'custom-storage') featLabel = 'Custom Storage';
      else if (feat === 'led-lighting' || feat === 'feature-lighting') featLabel = 'Feature Architectural Lighting';
      else if (feat === 'stone-splashback') featLabel = 'Stone Splashback';

      featureBreakdowns.push({
        label: featLabel,
        amount: cost,
        formatted: `+$${(cost / 1000).toFixed(1)}K`
      });
    }
  });

  const midpoint = basePrice + finishAddon + materialAddon + benchtopAddon + hardwareAddon + featuresTotal;

  // Deterministic range calculation: low ~ -6%, high ~ +8%, rounded to nearest $1,000
  const low = Math.round((midpoint * 0.93) / 1000) * 1000;
  const high = Math.max(low + 3000, Math.round((midpoint * 1.07) / 1000) * 1000);

  // Human-readable labels for breakdown
  let sizeLabel = 'Medium';
  if (sizeKey === 'compact' || sizeKey === 'small') sizeLabel = 'Compact';
  else if (sizeKey === 'large') sizeLabel = 'Large';

  let finishLabel = 'Premium';
  if (finishKey === 'essential' || finishKey === 'refined') finishLabel = 'Essential Standard';
  else if (finishKey === 'luxury' || finishKey === 'bespoke') finishLabel = 'Bespoke Luxury';

  let matName = materialKey.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  if (materialKey === 'natural-oak') matName = 'Natural Oak';
  if (materialKey === 'smoked-oak') matName = 'Smoked Oak';
  if (materialKey === 'walnut') matName = 'Walnut';
  if (materialKey === 'black-ash') matName = 'Black Ash';

  let benchName = benchtopKey.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  if (benchtopKey === 'calacatta') benchName = 'Calacatta Marble';
  if (benchtopKey === 'travertine') benchName = 'Navona Travertine';
  if (benchtopKey === 'charcoal') benchName = 'Charcoal Slate';
  if (benchtopKey === 'concrete') benchName = 'Architectural Concrete';

  let hwName = hardwareKey.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  if (hardwareKey === 'brushed-brass') hwName = 'Brushed Brass';
  if (hardwareKey === 'black') hwName = 'Matte Black';
  if (hardwareKey === 'steel') hwName = 'Brushed Steel';
  if (hardwareKey === 'handleless') hwName = 'Handleless';

  const breakdown = [
    {
      label: 'Base project',
      detail: sizeLabel,
      amount: basePrice,
      formatted: `$${(basePrice / 1000).toFixed(0)}K`
    },
    ...(finishAddon > 0 ? [{
      label: 'Finish level',
      detail: finishLabel,
      amount: finishAddon,
      formatted: `+$${(finishAddon / 1000).toFixed(1)}K`
    }] : []),
    {
      label: 'Cabinet material',
      detail: matName,
      amount: materialAddon,
      formatted: `+$${(materialAddon / 1000).toFixed(1)}K`
    },
    {
      label: 'Benchtop',
      detail: benchName,
      amount: benchtopAddon,
      formatted: benchtopAddon > 0 ? `+$${(benchtopAddon / 1000).toFixed(1)}K` : '$0'
    },
    {
      label: 'Hardware',
      detail: hwName,
      amount: hardwareAddon,
      formatted: `+$${(hardwareAddon / 1000).toFixed(1)}K`
    },
    ...featureBreakdowns
  ];

  return {
    midpoint,
    low,
    high,
    breakdown,
    formattedRange: `$${Math.round(low / 1000)}K — $${Math.round(high / 1000)}K AUD`
  };
}

// Keep backwards-compatible calculateBudgetRange delegating cleanly to calculateEstimate
export function calculateBudgetRange(params = {}) {
  const est = calculateEstimate({
    projectType: params.projectType,
    size: params.size,
    finishLevel: params.finishLevel,
    features: params.features,
    cabinetFinish: params.cabinetFinish,
    benchtop: params.benchtop,
    hardware: params.hardware
  });

  return {
    base: est.midpoint,
    featuresTotal: est.breakdown.filter(b => !['Base project', 'Finish level', 'Cabinet material', 'Benchtop', 'Hardware'].includes(b.label)).reduce((a, c) => a + c.amount, 0),
    estimatedTotal: est.midpoint,
    min: est.low,
    max: est.high,
    formattedRange: est.formattedRange
  };
}
