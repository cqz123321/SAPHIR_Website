/*
  Figures shown on the Figures page, grouped by research area.

  Figures grouped by research area. Only use figures you are
  allowed to reuse: either from an open-access paper under CC BY (reuse with
  credit), or supplied by the authors themselves. The page shows the caption,
  the paper it comes from and the licence / credit line.

  `image` is the local file in src/assets/figures/. `source` is where it is
  downloaded from — scripts/fetch-figures.mjs fetches any missing image before
  `npm run dev` / `npm run build`. To add your own figure, put the image file in
  src/assets/figures/ and add an entry here (source is then optional).
*/

export interface SiteFigure {
  image: string;
  source?: string;
  area: "soft-robotics" | "tactile-sensing" | "autonomy" | "medical" | "assistive" | "field";
  caption: string;
  paper: { title: string; authors: string; venue: string; year: number; doi?: string; url?: string };
  license: string; // e.g. "CC BY 4.0", or a credit line such as "Courtesy of the authors"
  licenseUrl?: string;
}

const CC_BY = { license: "CC BY 4.0", licenseUrl: "https://creativecommons.org/licenses/by/4.0/" };

const AUTHORS = { license: "Courtesy of the authors" };

export const FIGURES: SiteFigure[] = [
  {
    image: "mack-2025-eversion-robot.png",
    source: "https://mdpi-res.com/jmmp/jmmp-09-00223/article_deploy/html/images/jmmp-09-00223-g001.png",
    area: "soft-robotics",
    caption: "An eversion robot, constructed using our novel fabrication method, in action. Both the main channel of the eversion robot and the navigation PAMs are inflated. The robot everts under an obstacle, curving against gravity.",
    paper: { title: "Efficient Manufacturing of Steerable Eversion Robots with Integrated Pneumatic Artificial Muscles", authors: "Mack T, Suulker C, Dawood AB, Althoefer K", venue: "Journal of Manufacturing and Materials Processing", year: 2025, doi: "10.3390/jmmp9070223" },
    ...CC_BY,
  },
  {
    image: "kashef-2026-multi-vine.png",
    area: "soft-robotics",
    caption: "Left: the multi-vine system — two vine robots with soft caps, and a working channel anchored to the caps through which tools are delivered. Right: how it moves — both vines grow forward while the channel is released; locking the channel and pressurising one vine turns the robot left or right.",
    paper: { title: "A Multi-Vine Soft Robot Enabling Accessible Working Channel and Steering", authors: "Kashef R, Suulker C, Sheikhsofla M, Althoefer K", venue: "Hamlyn Symposium on Medical Robotics", year: 2026, doi: "10.48550/arxiv.2609.03758" },
    ...CC_BY,
  },
  {
    image: "suulker-2026-colon-eversion.jpg",
    source: "https://arxiv.org/html/2601.12523v1/Figures/Fig1V3.jpg",
    area: "soft-robotics",
    caption: "(a) Concept of an eversion robot with constrictive bands navigating a colon-like environment. (b) A standard eversion robot getting stuck at a sharp bend. (c) The proposed robot with integrated constrictive bands navigating the same bend. (d) Detail of the constrictive bands.",
    paper: { title: "Enabling High-Curvature Navigation in Eversion Robots through Buckle-Inducing Constrictive Bands", authors: "Suulker C, Haimus MA, Mack T, Sheikhsofla M, Dei NN, Kashef R, et al., Althoefer K", venue: "arXiv preprint", year: 2026, doi: "10.48550/arxiv.2601.12523" },
    ...CC_BY,
  },
  {
    image: "suulker-2024-soft-cap-squeeze.jpg",
    source: "https://arxiv.org/html/2401.07855v1/Figures/squ.jpg",
    area: "soft-robotics",
    caption: "An eversion robot with a soft cap and a camera attached to it, squeezing through a narrow opening.",
    paper: { title: "Deformable Tip Mount for Soft Growing Eversion Robots", authors: "Suulker C, Skach S, Kaleel D, Abrar T, Murtaza Z, Suulker D, Althoefer K", venue: "arXiv preprint", year: 2024, doi: "10.48550/arxiv.2401.07855" },
    ...CC_BY,
  },
  {
    image: "suulker-2024-assistive-glove.png",
    source: "https://arxiv.org/html/2408.07834v1/Figures/Glove.png",
    area: "soft-robotics",
    caption: "The soft robotic glove prototype: (a) closing and opening the hand, (b) grasp assistance, (c) lifting an iron (1.3 kg) without a hand in it.",
    paper: { title: "Assistive Soft Robotic Glove with Ruffles Enhanced Textile Actuators", authors: "Suulker C, Althoefer K", venue: "arXiv preprint", year: 2024, doi: "10.48550/arxiv.2408.07834" },
    ...CC_BY,
  },
  {
    image: "suulker-2022-fabric-exoskeleton.jpg",
    source: "https://arxiv.org/html/2212.07206v1/Figures/L.JPG",
    area: "soft-robotics",
    caption: "The fabric soft hand exoskeleton “in action”, grasping and releasing a phone and an iron.",
    paper: { title: "A Fabric Soft Robotic Exoskeleton with Novel Elastic Band Integrated Actuators for Hand Rehabilitation", authors: "Suulker C, Skach S, Althoefer K", venue: "arXiv preprint", year: 2022, doi: "10.48550/arxiv.2212.07206" },
    ...CC_BY,
  },
  {
    image: "suulker-2023-elastic-bands.jpg",
    source: "https://arxiv.org/html/2305.17720v1/Figures/Ruffles3.jpg",
    area: "soft-robotics",
    caption: "A textile actuator before and after integrating elastic bands.",
    paper: { title: "Integrating Elastic Bands to Enhance Performance for Textile Robotics", authors: "Suulker C, Skach S, Althoefer K", venue: "arXiv preprint", year: 2023, doi: "10.48550/arxiv.2305.17720" },
    ...CC_BY,
  },
  {
    image: "mack-2023-soft-gripper.jpg",
    source: "https://arxiv.org/html/2307.13657v1/figs/pictures/printedFingers.jpg",
    area: "soft-robotics",
    caption: "A soft robotic gripper with an active palm for in-hand object reorientation, using soft, 3D printed fingers.",
    paper: { title: "A Soft Robotic Gripper with Active Palm for In-Hand Object Reorientation", authors: "Mack T, Zhang K, Althoefer K", venue: "arXiv preprint", year: 2023, doi: "10.48550/arxiv.2307.13657" },
    ...CC_BY,
  },
  {
    image: "chen-2026-chick-robot-arenas.png",
    area: "soft-robotics",
    caption: "The four experimental arenas. A chick can approach a breathing soft interface or a still one, placed (a) horizontally, (b) horizontally with faceplates, (c) horizontally with faceplates and heating pads, and (d) vertically with small faceplates and heating pads. Water and food sit between the two.",
    paper: { title: "A Soft Robotic Interface for Chick-Robot Affective Interactions", authors: "Chen J, Mielke A, Althoefer K, Versace E", venue: "arXiv preprint", year: 2026, doi: "10.48550/arxiv.2604.08443" },
    ...AUTHORS,
  },
  {
    image: "cong-2026-layered-eskin.png",
    area: "tactile-sensing",
    caption: "Exploded view of the layered e-skin: a superficial FSR layer on top, a compliant spacer in the middle, and a deep FSR layer underneath.",
    paper: { title: "Layered e-skin for Shear Sensing", authors: "Cong Q, Devillard A, Dawood AB, Zhang X, Fan W, Dei NN, Suulker C, Althoefer K, Burdet E, Zhang D", venue: "arXiv preprint", year: 2026, doi: "10.48550/arxiv.2609.22493" },
    ...AUTHORS,
  },
  {
    image: "dawood-2022-optical-tomography-skin.png",
    area: "tactile-sensing",
    caption: "The optical tomography-inspired soft skin sensor. Light sources and detectors arranged around the edge of the soft skin are used to estimate where, and how hard, the skin is being pressed, in real time.",
    paper: { title: "Real-Time Pressure Estimation and Localisation with Optical Tomography-inspired Soft Skin Sensors", authors: "Dawood AB, Denoun B, Althoefer K", venue: "IEEE International Conference on Soft Robotics (RoboSoft)", year: 2022, doi: "10.1109/robosoft54090.2022.9762066" },
    ...AUTHORS,
  },
  {
    image: "dawood-2023-capacitive-eskin-setup.jpg",
    area: "tactile-sensing",
    caption: "(a) The soft capacitive e-skin clamped in its stretching mechanism. (b) Data acquisition: the skin's terminals are read through multiplexers and a CAV 424 converter into an ADC.",
    paper: { title: "Learning Decoupled Multi-touch Force Estimation, Localization and Stretch for Soft Capacitive E-skin", authors: "Dawood AB, Coppola C, Althoefer K", venue: "IEEE International Conference on Robotics and Automation (ICRA)", year: 2023, doi: "10.1109/icra48891.2023.10160961", url: "https://arxiv.org/abs/2303.05936" },
    ...CC_BY,
  },
  {
    image: "dawood-2024-palpation-sensor.webp",
    source: "https://www.frontiersin.org/files/Articles/1489884/xml-images/frobt-11-1489884-g001.webp",
    area: "tactile-sensing",
    caption: "The abraded optical fibre-based dynamic range force sensor for tissue palpation, with the optoelectronic system and a pneumatic inlet.",
    paper: { title: "Abraded optical fibre-based dynamic range force sensor for tissue palpation", authors: "Dawood AB, Chavali VK, Mack T, Zhang Z, Godaba H, Angelmahr M, Althoefer K", venue: "Frontiers in Robotics and AI", year: 2024, doi: "10.3389/frobt.2024.1489884" },
    ...CC_BY,
  },
  {
    image: "dawood-2024-variable-stiffness-setup.png",
    source: "https://arxiv.org/html/2412.10239v1/experimental_setup.png",
    area: "tactile-sensing",
    caption: "The experimental setup for the variable stiffness force sensor: a modified CNC milling machine with an ATI Mini40 force sensor, a syringe pump and a Keyence optical unit.",
    paper: { title: "Variable Stiffness & Dynamic Force Sensor for Tissue Palpation", authors: "Dawood AB, Zhang Z, Angelmahr M, Arezzo A, Althoefer K", venue: "Lecture Notes in Computer Science", year: 2024, doi: "10.1007/978-3-031-72059-8_25", url: "https://arxiv.org/abs/2412.10239" },
    ...CC_BY,
  },
  {
    image: "zhang-2025-stiffness-map.png",
    source: "https://mdpi-res.com/sensors/sensors-25-06915/article_deploy/html/images/sensors-25-06915-g007.png",
    area: "tactile-sensing",
    caption: "Stiffness mapping: (a) a phantom simulating tissue anomalies, with numbered indentation positions; (b) the sensor foil mounted on a robot arm; (c) light attenuation at each position, separating two stiffness levels; (d) the interpolated stiffness map; (e) the map overlaid on the phantom.",
    paper: { title: "Flexible Sensor Foil Based on Polymer Optical Waveguide for Haptic Assessment", authors: "Zhang Z, Dawood AB, Violakis G, Abdalwareth A, Flachenecker G, Polygerinos P, Althoefer K, Angelmahr M, Schade W", venue: "Sensors", year: 2025, doi: "10.3390/s25226915" },
    ...CC_BY,
  },
  {
    image: "al-dubooni-2024-hybrid-eversion.jpg",
    source: "https://arxiv.org/html/2404.13135v2/Pictures_1.jpg",
    area: "field",
    caption: "The hybrid continuum-eversion robot for nuclear environments: selective tip steering enabled by a rigid-component robotic structure (a, b), and the tip design without its nylon sleeve (c).",
    paper: { title: "Hybrid Continuum-Eversion Robot: Precise Navigation and Decontamination in Nuclear Environments using Vine Robot", authors: "Al-Dubooni M, Wong C, Althoefer K", venue: "IEEE/RSJ International Conference on Intelligent Robots and Systems (IROS)", year: 2024, doi: "10.1109/iros58592.2024.10801985", url: "https://arxiv.org/abs/2404.13135" },
    ...CC_BY,
  },

  {
    image: "mack-2023-radiation-pipes.jpg",
    source: "https://arxiv.org/html/2307.10084v1/figs/setup_numbered.jpeg",
    area: "field",
    caption: "55 mm pipes that can be taken apart and rearranged for the robot to traverse, mapping the positions of magnets that imitate radiation sources. 1, 3: the two magnets, encased in black plastic. 2: the constriction.",
    paper: { title: "Eversion Robots for Mapping Radiation in Pipes", authors: "Mack T, Al-Dubooni M, Althoefer K", venue: "arXiv preprint", year: 2023, doi: "10.48550/arxiv.2307.10084" },
    ...CC_BY,
  },
];
