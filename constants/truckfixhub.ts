export const BRAND = {
  navy: "#09213c",
  blue: "#075fae",
  sky: "#39b9ff",
  yellow: "#ffdb3d",
  red: "#e21f26",
  ink: "#101820",
  muted: "#5d7182",
  canvas: "#f4f7fb",
  card: "#ffffff",
  border: "#d8e2ec",
  success: "#24834a",
} as const;

export const SAFETY_NOTE =
  "A symptom is evidence—not a parts order. Confirm the exact truck application, reproduce the complaint only when safe, measure the system, and use current manufacturer service information for final specifications and repair procedures.";

export type Symptom = {
  slug: string;
  title: string;
  description: string;
  url: string;
};

export type SymptomGroup = {
  id: string;
  title: string;
  description: string;
  icon: string;
  symptoms: Symptom[];
};

const guide = (slug: string) => `https://truckfixhub.com/${slug}.html`;

export const SYMPTOM_GROUPS: SymptomGroup[] = [
  {
    id: "starting",
    title: "Starting & charging",
    description: "First determine whether the engine does not crank, cranks slowly, or cranks normally but does not start.",
    icon: "battery-charging-outline",
    symptoms: [
      { slug: "wont-crank", title: "Truck won't crank", description: "The starter does not turn the engine over.", url: guide("semi-truck-wont-crank") },
      { slug: "cranks-wont-start", title: "Cranks but won't start", description: "The engine turns over but does not start and run.", url: guide("semi-truck-cranks-but-wont-start") },
      { slug: "slow-crank", title: "Slow crank", description: "The starter turns the engine more slowly than usual.", url: guide("semi-truck-slow-crank") },
      { slug: "starter-clicks-wont-crank", title: "Starter clicks but won't crank", description: "Record whether the click is single or repeated and what the dash does.", url: guide("semi-truck-starter-clicks-wont-crank") },
      { slug: "intermittent-starter", title: "Intermittent starter", description: "The starting complaint comes and goes; capture the conditions when it occurs.", url: guide("semi-truck-starter-works-intermittently") },
      { slug: "batteries-not-charging", title: "Batteries not charging", description: "Charging-system symptoms or a low-voltage warning.", url: guide("semi-truck-batteries-not-charging") },
      { slug: "batteries-drain-overnight", title: "Batteries drain overnight", description: "The truck has insufficient battery power after sitting.", url: guide("semi-truck-batteries-drain-overnight") },
    ],
  },
  {
    id: "performance",
    title: "Power, boost & engine",
    description: "Record load, road speed, RPM, smoke, and warning-light conditions.",
    icon: "speedometer-outline",
    symptoms: [
      { slug: "low-power", title: "Low engine power", description: "Reduced power under load or during acceleration.", url: guide("semi-truck-low-power") },
      { slug: "low-boost", title: "Low boost pressure", description: "Compare the reported complaint with boost data and operating conditions.", url: guide("semi-truck-boost-pressure-low") },
      { slug: "boost-leak", title: "Boost / charge-air leak", description: "Possible leak symptoms in the charge-air path.", url: guide("semi-truck-boost-leak") },
      { slug: "turbo-whistle-hiss", title: "Turbo whistle or hiss", description: "Note when the sound occurs and whether power or boost changes too.", url: guide("semi-truck-turbo-whistle-hiss") },
      { slug: "turbo-actuator", title: "Turbo actuator problem", description: "Use fault information and measured system response to guide diagnosis.", url: guide("semi-truck-turbo-actuator-problem") },
      { slug: "rough-idle", title: "Rough idle", description: "Uneven engine operation while idling.", url: guide("semi-truck-rough-idle") },
      { slug: "excessive-smoke", title: "Excessive smoke", description: "Record smoke color, operating condition, and warning lights.", url: guide("semi-truck-excessive-smoke") },
    ],
  },
  {
    id: "aftertreatment",
    title: "DPF, DEF, SCR, regen & derate",
    description: "Aftertreatment systems interact; assess the monitored condition and operating data.",
    icon: "leaf-outline",
    symptoms: [
      { slug: "engine-derate", title: "Engine derate", description: "Reduced-power operation associated with a warning or fault.", url: guide("semi-truck-derate-diagnostic") },
      { slug: "dpf-warning", title: "DPF warning light", description: "A DPF warning needs context from codes and operating data.", url: guide("semi-truck-dpf-warning-light") },
      { slug: "wont-regen", title: "Won't regen", description: "The truck will not complete a requested regeneration.", url: guide("semi-truck-wont-regen") },
      { slug: "high-soot-load", title: "High DPF soot load", description: "Use current service information to evaluate soot-load data.", url: guide("semi-truck-high-dpf-soot-load") },
      { slug: "dpf-differential-pressure", title: "DPF differential pressure", description: "Compare pressure readings with the manufacturer's procedure and conditions.", url: guide("semi-truck-dpf-differential-pressure-problem") },
      { slug: "def-warning", title: "DEF warning light", description: "Review the system warning and related diagnostic information.", url: guide("semi-truck-def-warning-light") },
      { slug: "def-dosing", title: "DEF dosing problem", description: "Follow the current system diagnostic steps before choosing a component.", url: guide("semi-truck-def-dosing-problem") },
      { slug: "nox-sensor-fault", title: "NOx sensor fault", description: "A code identifies a monitored circuit or value—not automatic proof of a failed part.", url: guide("semi-truck-nox-sensor-fault") },
    ],
  },
  {
    id: "cooling",
    title: "Overheating & coolant",
    description: "Note idle, highway, or loaded conditions and whether coolant disappears or changes appearance.",
    icon: "thermometer-outline",
    symptoms: [
      { slug: "overheating", title: "Truck overheating", description: "Temperature rises beyond its normal operating range.", url: guide("semi-truck-overheating") },
      { slug: "coolant-loss", title: "Coolant loss, no visible leak", description: "Coolant level drops without an obvious external leak.", url: guide("semi-truck-coolant-loss-no-visible-leak") },
      { slug: "coolant-pushing-reservoir", title: "Coolant pushing from reservoir", description: "Record when it happens and the temperature and load conditions.", url: guide("semi-truck-coolant-pushing-out-reservoir") },
      { slug: "coolant-temperature-fluctuates", title: "Coolant temperature fluctuates", description: "Note when the reading changes and whether the fan or load changes too.", url: guide("semi-truck-coolant-temperature-fluctuates") },
      { slug: "coolant-in-oil", title: "Coolant in oil", description: "Stop and use the proper inspection and manufacturer procedure.", url: guide("semi-truck-coolant-in-oil") },
      { slug: "oil-in-coolant", title: "Oil in coolant", description: "Record what is visible and seek qualified diagnosis before operation.", url: guide("semi-truck-oil-in-coolant") },
      { slug: "fan-wont-turn-on", title: "Engine fan won't turn on", description: "Cooling fan operation does not match the observed condition.", url: guide("semi-truck-engine-fan-wont-turn-on") },
    ],
  },
  {
    id: "air-brakes",
    title: "Air pressure & brakes",
    description: "Separate air-supply complaints from brake-application complaints.",
    icon: "disc-outline",
    symptoms: [
      { slug: "air-leak", title: "Air leak", description: "Record whether leakage occurs parked, applied, or after shutdown.", url: guide("semi-truck-air-leak") },
      { slug: "slow-air-build", title: "Air builds slowly", description: "The air system takes longer than expected to build pressure.", url: guide("semi-truck-air-pressure-builds-slow") },
      { slug: "air-pressure-drops-fast", title: "Air pressure drops fast", description: "Note pressure readings and whether the truck is parked or in use.", url: guide("semi-truck-air-pressure-drops-fast") },
      { slug: "compressor-not-building", title: "Compressor not building pressure", description: "Air pressure does not build as expected.", url: guide("semi-truck-air-compressor-not-building-pressure") },
      { slug: "air-dryer-purges", title: "Air dryer purges constantly", description: "Record purge timing and system pressure; use current service information.", url: guide("semi-truck-air-dryer-purges-constantly") },
      { slug: "parking-brake-wont-release", title: "Parking brake won't release", description: "Use the manufacturer's safety procedures before inspection.", url: guide("semi-truck-parking-brake-wont-release") },
      { slug: "brake-drag-hot-wheel", title: "Brake drag / hot wheel", description: "A hot wheel is a safety concern; do not touch hot components.", url: guide("semi-truck-brake-drag-hot-wheel") },
    ],
  },
  {
    id: "driveline",
    title: "Vibration, driveline & transmission",
    description: "Determine whether vibration follows engine RPM or road speed and how it changes under load.",
    icon: "settings-outline",
    symptoms: [
      { slug: "shakes-highway-speed", title: "Truck shakes at highway speed", description: "Compare road speed, engine RPM, acceleration, coast, and braking.", url: guide("semi-truck-shakes-at-highway-speed") },
      { slug: "driveshaft-vibration", title: "Driveshaft vibration", description: "Record when the vibration appears and how it changes.", url: guide("semi-truck-driveshaft-vibration") },
      { slug: "u-joint-problem", title: "U-joint problem", description: "Note vibration, clunks, and operating conditions; follow safe inspection procedures.", url: guide("semi-truck-u-joint-problem") },
      { slug: "carrier-bearing-problem", title: "Carrier bearing problem", description: "Record vibration and driveline conditions before inspecting.", url: guide("semi-truck-carrier-bearing-problem") },
      { slug: "transmission-wont-go-into-gear", title: "Transmission won't go into gear", description: "Track gear selection, air/electrical warnings, and operating conditions.", url: guide("semi-truck-transmission-wont-go-into-gear") },
      { slug: "transmission-hard-shift", title: "Transmission shifts hard", description: "Track shift conditions, load, temperature, and related warnings.", url: guide("semi-truck-transmission-shifts-hard") },
      { slug: "clutch-slipping", title: "Clutch slipping", description: "Note load, gear, RPM, and any recent repair history.", url: guide("semi-truck-clutch-slipping") },
    ],
  },
  {
    id: "wheel-steering",
    title: "Wheel end, steering & suspension",
    description: "Heat, looseness, noise, pull, and abnormal tire wear can overlap.",
    icon: "car-outline",
    symptoms: [
      { slug: "hot-hub", title: "Hot hub", description: "A wheel-end temperature concern; follow safe inspection procedures.", url: guide("semi-truck-hot-hub") },
      { slug: "wheel-seal-leaking", title: "Wheel seal keeps leaking", description: "Record which wheel end and any signs of contamination or heat.", url: guide("semi-truck-wheel-seal-keeps-leaking") },
      { slug: "wheel-bearing-noise", title: "Wheel bearing noise", description: "Record which wheel, when the sound occurs, and any heat.", url: guide("semi-truck-wheel-bearing-noise") },
      { slug: "kingpin-play", title: "Kingpin play", description: "Have steering and suspension play assessed using the correct procedure.", url: guide("semi-truck-kingpin-play") },
      { slug: "steering-wanders", title: "Steering wanders", description: "Note speed, road conditions, load, and tire wear.", url: guide("semi-truck-steering-wanders") },
      { slug: "steering-wheel-shakes", title: "Steering wheel shakes", description: "Record road speed, braking, tire condition, and the circumstances.", url: guide("semi-truck-steering-wheel-shakes") },
      { slug: "uneven-steer-tire-wear", title: "Uneven steer tire wear", description: "Inspect the full wheel-end, steering, and suspension context.", url: guide("semi-truck-uneven-steer-tire-wear") },
    ],
  },
];

export const ALL_SYMPTOMS = SYMPTOM_GROUPS.flatMap((group) =>
  group.symptoms.map((symptom) => ({ ...symptom, system: group.title, groupId: group.id })),
);

export const RESOURCE_LINKS = [
  { title: "Visual troubleshooting roadmap", detail: "See how symptoms, systems, parts, and repair references connect.", icon: "git-network-outline", url: "https://truckfixhub.com/semi-truck-visual-roadmap.html" },
  { title: "Complete diagnostic guide", detail: "Follow the full TruckFixHub diagnostic starting point.", icon: "book-outline", url: "https://truckfixhub.com/semi-truck-diagnostic-guide.html" },
  { title: "Diagnostic diagrams", detail: "Visual troubleshooting paths organized by truck system.", icon: "git-branch-outline", url: "https://truckfixhub.com/diagnostic-diagrams.html" },
  { title: "SPN / FMI fault codes", detail: "Understand what a code can—and cannot—tell you.", icon: "warning-outline", url: "https://truckfixhub.com/fault-code-diagram.html" },
  { title: "Electrical troubleshooting", detail: "Power, grounds, wiring, and voltage-drop references.", icon: "flash-outline", url: "https://truckfixhub.com/electrical-diagram.html" },
  { title: "Engine and fuel systems", detail: "No-start, low-power, and engine system paths.", icon: "settings-outline", url: "https://truckfixhub.com/engine-diagram.html" },
  { title: "Emissions & regen", detail: "DPF, DEF, SCR, NOx, and derate diagnostic paths.", icon: "leaf-outline", url: "https://truckfixhub.com/emissions-diagram.html" },
  { title: "Air & brakes", detail: "Air building, leaks, and brake complaints.", icon: "disc-outline", url: "https://truckfixhub.com/air-brake-diagram.html" },
  { title: "Diagnostic checklist", detail: "Organize observations before testing or repair.", icon: "checkbox-outline", url: "https://truckfixhub.com/semi-truck-diagnostic-checklist.html" },
  { title: "Parts visual library", detail: "Identify common heavy-duty truck components.", icon: "construct-outline", url: "https://truckfixhub.com/parts-visual-library.html" },
  { title: "Repair guides", detail: "Browse current TruckFixHub repair references.", icon: "book-outline", url: "https://truckfixhub.com/repair-guides.html" },
  { title: "Used truck inspection", detail: "A structured walkthrough for a used Class 8 truck.", icon: "clipboard-outline", url: "https://truckfixhub.com/used-semi-truck-inspection-checklist.html" },
  { title: "Diesel Dollar gear", detail: "Truck gear and digital tools from TruckFixHub.", icon: "cart-outline", url: "https://truckfixhub.com/best-truck-cab-gear-under-20.html" },
  { title: "Diesel Dollar Store", detail: "Open the current truck-gear collection.", icon: "storefront-outline", url: "https://wj4ds6-1g.myshopify.com/collections/dollar-diesel-store" },
] as const;

export function findSymptom(slug: string) {
  return ALL_SYMPTOMS.find((symptom) => symptom.slug === slug);
}
