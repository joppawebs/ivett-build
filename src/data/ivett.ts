/**
 * Ivett Design and Build — the content shared by all three mockups.
 *
 * All three directions present the same facts in different clothes, so the
 * copy, figures and images live here once. Anything a direction words
 * differently stays in that direction's page file.
 *
 * Figures are from the client's own material (Twiga Lodge, Charters Yard, the
 * Loughborough University monitoring study). Nothing here is invented.
 */
import cyHero from '../assets/cy-hero.jpg';
import twiga from '../assets/twiga-2.jpg';
import sysFoundation from '../assets/sys-foundation.jpg';
import sysIcf from '../assets/sys-icf.jpg';
import sysSteel from '../assets/sys-steel.jpg';
import sysFloor from '../assets/sys-floor.jpg';
import sysStairs from '../assets/sys-stairs.jpg';
import sysRoof from '../assets/sys-roof.jpg';
import svcDrawings from '../assets/svc-drawings.png';
import svcBim from '../assets/svc-bim.png';
import steelInstall from '../assets/steel-install.jpg';
import sectionRaft from '../assets/section-raft.png';
import sectionHollowcore from '../assets/section-hollowcore.png';
import sectionRoof from '../assets/section-roof.jpg';

export const COMPANY = {
  legalName: 'Ivett Design and Build Ltd',
  established: '2018',
  base: 'Farnham, Surrey',
  addressLines: ['Blandings Farm, Wrecclesham Hill', 'Farnham, Surrey GU10 4JU'],
  phone: '01252 967328',
  phoneHref: 'tel:01252967328',
  salesEmail: 'info@ivettbuild.com',
  financeEmail: 'accounts@ivettbuild.com',
  companyNo: '11309208',
  vatNo: '316 7805 92',
  instagram: 'https://www.instagram.com/ivettbuild',
} as const;

export const INSURANCE = [
  { label: "Employers' liability", value: '£10,000,000', short: "£10m employers' liability" },
  { label: 'Public & product liability', value: '£2,000,000', short: '£2m public liability' },
  { label: 'Professional indemnity', value: '£1,000,000', short: '£1m professional indemnity' },
] as const;

/** The about copy, taken from the client's existing site (lightly corrected). */
export const ABOUT_PARAGRAPHS = [
  'Ivett Design and Build Ltd is a family-run contractor based in Surrey, with a focus on delivering well-considered structural solutions for residential and commercial projects.',
  'Our approach is grounded in practical site experience. We place a strong emphasis on buildability, coordination and long-term performance, ensuring that projects are not only well designed but also delivered efficiently on site.',
  'Having worked across design, supply, manufacture and construction, we bring a broad understanding of different materials and systems. This allows us to take a measured approach to each project, selecting construction methods based on what will perform best in practice rather than following a fixed formula.',
  'We advocate a fabric-first approach to construction, focusing on the structure and thermal envelope to deliver buildings that are efficient, robust and designed to perform over time.',
] as const;

/**
 * Professional services. The third description is a placeholder: the client's
 * live site duplicates the 3D-modelling text here, so the real copy is still
 * outstanding (see the draft email).
 *
 * `crop` anchors the band these are squared off to on the cards. The BIM
 * cutaway holds its top edge so the roof stays whole — there's white margin
 * above it, so nothing is sliced. The other two centre: the drawings flat-lay
 * is busy everywhere, and the steel photo has its beam and workers mid-frame.
 */
export const SERVICES = [
  {
    n: '01',
    name: 'Structural design & coordination',
    image: svcDrawings,
    alt: 'Structural design and coordination drawings',
    long: 'Working with your professional team, we provide design coordination and construction detailing to support project teams and ensure buildable, well-resolved solutions. Risks are identified early and details developed so they translate effectively on site.',
    short: 'Design coordination and construction detailing with your professional team. Risks identified early; details resolved so they translate to site.',
    navNote: 'Detailing alongside your professional team',
    crop: 'centre',
    placeholder: '',
  },
  {
    n: '02',
    name: '3D modelling & BIM coordination',
    image: svcBim,
    alt: 'A 3D BIM model showing coordinated structural information',
    long: 'By modelling key elements of the structure, we identify potential clashes, refine details and ensure that design information translates effectively into construction on site.',
    short: 'Key structural elements modelled to find clashes, refine junctions and confirm buildability before work starts.',
    navNote: 'Clash detection and buildability',
    crop: 'top',
    placeholder: '',
  },
  {
    n: '03',
    name: 'Construction & project management',
    image: steelInstall,
    alt: 'Structural steel being installed on site',
    long: 'Programme, procurement and site management of the structural package, or of the whole project under a design and build contract.',
    short: 'Programme, procurement and site management of the structural package, or the whole project under design and build.',
    navNote: 'Programme, procurement, site',
    crop: 'centre',
    /** Flagged in the mockups so the client knows this copy is still to come. */
    placeholder: '[Copy to be confirmed with James]',
  },
] as const;

/**
 * The six structural systems, foundation-up ordering.
 *
 * `crop` is where to anchor the crop when a photo is squared off to the 3:2
 * card. Most of these are already 3:2 and never move; the floor and roof shots
 * are 4:3, and centring them slices the crane chains off the top while keeping
 * mud at the bottom — so those two hold their top edge.
 */
export const SYSTEMS = [
  {
    n: '01',
    id: 'foundations',
    name: 'Foundations',
    image: sysFoundation,
    alt: 'Insulated raft foundation system',
    long: 'Insulated raft foundations, piled systems and ground beams, tailored to the structural requirements and ground conditions of each project.',
    short: 'Insulated raft, piled systems and ground beams to suit ground conditions and the structure above.',
    navNote: 'Insulated raft, piled, ground beams',
    crop: 'centre',
  },
  {
    n: '02',
    id: 'icf-walls',
    name: 'ICF walls',
    image: sysIcf,
    alt: 'Insulated Concrete Formwork wall system',
    long: 'Reinforced concrete structure combined with high thermal performance: a robust, airtight envelope with long-term durability.',
    short: 'Reinforced concrete core within EPS formwork: structure, insulation and airtightness in one operation.',
    navNote: 'Reinforced core, EPS formwork',
    crop: 'centre',
  },
  {
    n: '03',
    id: 'steel-frame',
    name: 'Steel frame',
    image: sysSteel,
    alt: 'Structural steelwork integrated with ICF walls',
    long: 'Beams, columns and support systems, designed, supplied and installed alongside walls, floors and roof.',
    short: 'Beams, columns and supports designed, supplied and installed with the structural package.',
    navNote: 'Beams, columns, supports',
    crop: 'centre',
  },
  {
    n: '04',
    id: 'floors',
    name: 'Floors',
    image: sysFloor,
    alt: 'Precast hollowcore floor system',
    long: 'Precast hollowcore, in-situ concrete and engineered timber, coordinated with steelwork and walls for a robust working platform.',
    short: 'Precast hollowcore, in-situ concrete and engineered timber, coordinated with walls and steel.',
    navNote: 'Hollowcore, in-situ, timber',
    crop: 'top',
  },
  {
    n: '05',
    id: 'stairs',
    name: 'Stairs and landings',
    image: sysStairs,
    alt: 'Structural stair and landing systems',
    long: 'Metal, timber, precast and in-situ stair systems, integrated with the floor and steel packages.',
    short: 'Metal, timber, precast and in-situ stairs integrated with floor and steel packages.',
    navNote: 'Precast, steel, timber',
    crop: 'centre',
  },
  {
    n: '06',
    id: 'roof',
    name: 'Roof',
    image: sysRoof,
    alt: 'High-performance roof system',
    long: 'Traditional cut roofs, engineered timber and panelised SIP solutions, designed for a range of insulation materials and finishes.',
    short: 'Cut roofs, engineered timber and panelised SIP systems, including timber-free insulated panels.',
    navNote: 'Cut, engineered, SIP',
    crop: 'top',
  },
] as const;

export const SYSTEMS_INTRO =
  'We deliver coordinated structural systems tailored to each project, combining foundations, walls, floors, structural steel and roof structures into a complete and buildable solution, accommodating a range of insulation types, structural configurations and external finishes.';

/** The two completed case studies. */
export const PROJECTS = [
  {
    id: 'charters-yard',
    name: 'Charters Yard',
    kicker: 'Commercial · Guildford',
    image: cyHero,
    alt: 'Charters Yard, a sustainable commercial headquarters in Guildford',
    summary:
      'Purpose-built sustainable headquarters · EPC A4 · 0.82 air tightness',
    short:
      'Design and build contractor for a riverside headquarters. RC frame, CLT, zinc, TABS and ground-source heating.',
    long: 'Design and build contractor for a purpose-built riverside headquarters. Reinforced concrete frame and CLT, zinc cladding, thermally activated structure, ground-source heating and 50% GGBS concrete.',
    figures: ['EPC A4', '0.82 air tightness'],
    stack: ['EPC A4', '0.82 air'],
    navNote: 'Commercial headquarters, Guildford',
  },
  {
    id: 'twiga-lodge',
    name: 'Twiga Lodge',
    kicker: 'Residential · Surrey',
    image: twiga,
    alt: 'Twiga Lodge, a high-performance ICF home in Surrey',
    summary: 'Passivhaus-principles ICF home · EPC 94A · 0.9 t CO₂ a year',
    short:
      'Full structural shell: insulated raft, ICF walls, hollowcore floor, timber-free SIP roof. Holds 20–23 °C in winter on one radiator.',
    long: 'Every layer of the package on one house: insulated raft, ICF walls, hollowcore floor, precast stairs and a timber-free SIP roof. Monitored in occupation for eighteen months by Loughborough University.',
    figures: ['EPC 94A', '0.11 wall U-value'],
    stack: ['EPC 94A', 'U 0.11'],
    navNote: 'ICF home, EPC 94A, Surrey',
  },
] as const;

/**
 * The build-up, roof-down, for Mockup 3's interactive panel. Each layer pairs a
 * system with the as-built detail from Twiga Lodge.
 */
export const BUILD_UP = [
  {
    id: 'roof',
    n: '06',
    name: 'Roof',
    spec: 'Timber-free deep-section SIP panel',
    value: '300 mm EPS',
    tag: 'PBS SIP ROOF · SECTION AT EAVES AND RIDGE',
    image: sectionRoof,
    alt: 'Section drawing of a PBS SIP roof panel',
    desc: '300 mm structural-grade EPS core with 250 mm galvanised PFC channels along each edge. Panels span ridge beam to ICF wall head in one piece; no trusses, purlins or rafters.',
  },
  {
    id: 'stairs',
    n: '05',
    name: 'Stairs and landings',
    spec: 'Precast, in-situ, steel or timber',
    value: 'Offsite',
    tag: 'PRECAST STAIR · INSTALLED WITH THE FLOOR LIFT',
    image: sysStairs,
    alt: 'Structural stair and landing systems',
    desc: 'Stair flights and landings manufactured off site and craned in with the hollowcore floor, giving safe access between levels from the first day of the superstructure.',
  },
  {
    id: 'floor',
    n: '04',
    name: 'Floors',
    spec: 'Precast hollowcore, 9 m span, installed in a day',
    value: '250 mm',
    tag: 'HOLLOWCORE BEARING ON ICF · SECTION',
    image: sectionHollowcore,
    alt: 'Section drawing of a hollowcore floor bearing on an ICF wall',
    desc: '250 mm precast hollowcore planks bearing 100 mm minimum onto the ICF concrete core, giving an immediate working platform and future layout flexibility.',
  },
  {
    id: 'steel',
    n: '03',
    name: 'Steel frame',
    spec: 'Beams, columns and supports',
    value: 'Coordinated',
    tag: 'STRUCTURAL STEEL · INSTALLED WITH THE SHELL',
    image: sysSteel,
    alt: 'Structural steelwork integrated with ICF walls',
    desc: 'Steel elements designed, supplied and installed as part of the package, coordinated with wall, floor and roof so bearings and connections are resolved before site.',
  },
  {
    id: 'walls',
    n: '02',
    name: 'ICF walls',
    spec: '200 mm EPS out / 150 mm RC core / 100 mm EPS in',
    value: 'U 0.11',
    tag: 'ICF WALL · EPS FORMWORK AND REINFORCED CORE',
    image: sysIcf,
    alt: 'Insulated Concrete Formwork wall system',
    desc: 'Interlocking EPS formwork filled with reinforced concrete: the structure, insulation and airtightness line in one operation. 471 mm overall at Twiga Lodge for a U-value of 0.11 W/m²K.',
  },
  {
    id: 'foundation',
    n: '01',
    name: 'Foundations',
    spec: 'Insulated raft, no separate footings',
    value: 'U 0.10',
    tag: 'INSULATED RAFT HYBRID · SECTION',
    image: sectionRaft,
    alt: 'Section drawing of an insulated raft hybrid foundation',
    desc: '350 mm high-compressive-strength EPS under a reinforced slab, with the ICF wall bearing directly on the raft edge for thermal continuity from ground to wall.',
  },
] as const;

/** The navigation shared by all three mockups. */
export const NAV_ITEMS = [
  { key: 'about', label: 'About', href: '#about' },
  {
    key: 'services',
    label: 'Services',
    href: '#services',
    children: SERVICES.map((s) => ({ label: s.name, href: '#services', note: s.navNote })),
  },
  {
    key: 'systems',
    label: 'Systems',
    href: '#systems',
    children: SYSTEMS.map((s) => ({ label: s.name, href: '#systems', note: s.navNote })),
  },
  {
    key: 'projects',
    label: 'Projects',
    href: '#projects',
    children: PROJECTS.map((p) => ({ label: p.name, href: '#projects', note: p.navNote })),
  },
  { key: 'contact', label: 'Contact', href: '#contact' },
] as const;

export type NavItem = (typeof NAV_ITEMS)[number];
