export type DiseaseDetail = {
  code: string;
  name: string;
  category: "Structural" | "Chromatic" | "Mixed / Chromatic" | "Global";
  landmark: string;
  overview: string;
  visualSigns: string[];
  streamPreference: string;
  recommendations: string;
};

export const DISEASE_DATABASE: Record<string, DiseaseDetail> = {
  DR: {
    code: "DR",
    name: "Diabetic Retinopathy",
    category: "Structural",
    landmark: "Retinal Microvasculature (Capillaries & Posterior Pole)",
    overview:
      "A progressive microvascular complication of diabetes mellitus resulting from prolonged hyperglycemia. It causes damage to retinal capillary walls, retinal ischemia, vascular permeability, and fluid leakage.",
    visualSigns: [
      "Microaneurysms (tiny red sac-like vascular dilations)",
      "Intraretinal dot and blot hemorrhages",
      "Hard exudates (yellowish lipid deposits with sharp borders)",
      "Cotton wool spots (nerve fiber layer microinfarctions)",
      "Neovascularization (in proliferative stage)",
    ],
    streamPreference:
      "Structural / Ben Graham stream (high-pass filtering amplifies discrete microvascular lesion boundaries).",
    recommendations:
      "Perform comprehensive dilated fundus examination, optimize glycemic control (HbA1c), conduct OCT for macular edema, and refer to a retina specialist for laser photocoagulation or intravitreal anti-VEGF therapy if severe.",
  },
  ARMD: {
    code: "ARMD",
    name: "Age-Related Macular Degeneration",
    category: "Mixed / Chromatic",
    landmark: "Macula Lutea & Retinal Pigment Epithelium (RPE)",
    overview:
      "A chronic, progressive degenerative disease of the central retina (macula) affecting central high-acuity vision, primarily impacting elderly populations.",
    visualSigns: [
      "Confluent soft and hard drusen deposits in the macula",
      "Retinal Pigment Epithelium (RPE) hyperpigmentation and depigmentation",
      "Geographic atrophy of the RPE and choriocapillaris (Dry ARMD)",
      "Choroidal neovascularization (CNV) with subretinal fluid/hemorrhage (Wet ARMD)",
    ],
    streamPreference:
      "Colour-preserving stream (retaining real chromatic yellow-orange hue statistics is vital for identifying drusen and depigmentation).",
    recommendations:
      "Conduct macular OCT, initiate self-monitoring with an Amsler grid, recommend AREDS2 nutritional supplements for intermediate stage, and refer urgently for intravitreal anti-VEGF injections if exudative (wet) ARMD is suspected.",
  },
  DN: {
    code: "DN",
    name: "Retinal Drusen (Drusenoid Lesions)",
    category: "Structural",
    landmark: "Sub-RPE Basement Membrane & Bruch's Membrane",
    overview:
      "Extracellular metabolic waste accumulation beneath the Retinal Pigment Epithelium (RPE). Drusen represent early risk indicators for macular degeneration and systemic metabolic stress.",
    visualSigns: [
      "Hard drusen: Small (<63 μm), discrete nodular yellow deposits with well-defined edges",
      "Soft drusen: Larger (>125 μm), pale yellow mound-like lesions with fuzzy, confluent margins",
      "Calcified drusen: Glistening, white-yellow crystalline sub-RPE spots",
    ],
    streamPreference:
      "Structural / Ben Graham stream (high contrast edge detection pinpoints discrete lesion margins).",
    recommendations:
      "Establish baseline macular OCT imaging, monitor annually for progression toward geographic atrophy or neovascularization, and counsel patient on lifestyle risk reduction (smoking cessation, UV protection).",
  },
  MYA: {
    code: "MYA",
    name: "Pathologic Myopia (Myopic Maculopathy)",
    category: "Mixed / Chromatic",
    landmark: "Posterior Pole, Peripapillary Region & Sclera",
    overview:
      "High refractive error (axial length >26 mm or >-6.00 D) leading to mechanical stretching, thinning, and structural elongation of the sclera, choroid, and retina.",
    visualSigns: [
      "Temporal myopic crescent around the optic disc",
      "Posterior staphyloma (outpocketing of the posterior sclera)",
      "Lacquer cracks (fine linear ruptures in Bruch's membrane)",
      "Diffuse chorioretinal atrophy and macular tessellation",
      "Fuchs spot (pigmented macular scar post-hemorrhage)",
    ],
    streamPreference:
      "Colour-preserving stream (preserves delicate depigmentation and subtle macular atrophy hues).",
    recommendations:
      "Perform annual dilated peripheral retinal examination for lattice degeneration or tears, conduct baseline OCT, and advise immediate consultation if sudden floaters or flashes occur.",
  },
  BRVO: {
    code: "BRVO",
    name: "Branch Retinal Vein Occlusion",
    category: "Structural",
    landmark: "Retinal Venous Branch Arcades (commonly Superior Temporal)",
    overview:
      "Vascular occlusion caused by thrombus formation at an arteriovenous (AV) crossing, where a rigid arteriole compresses the underlying retinal branch vein.",
    visualSigns: [
      "Sectoral flame-shaped intraretinal hemorrhages",
      "Dilated, engorged, and tortuous retinal branch vein upstream of crossing",
      "Macular edema and cotton wool spots restricted to the affected quadrant",
    ],
    streamPreference:
      "Structural / Ben Graham stream (highlights flame hemorrhages and sharp vascular tortuosity).",
    recommendations:
      "Perform macular OCT and fundus fluorescein angiography (FFA), conduct systemic arterial hypertension and cardiovascular risk evaluation, and treat persistent macular edema with intravitreal anti-VEGF or steroid injections.",
  },
  TSLN: {
    code: "TSLN",
    name: "Tessellation (Fundus Tigroid)",
    category: "Chromatic",
    landmark: "Diffuse Retinal Pigment Epithelium (RPE) & Underlying Choroid",
    overview:
      "An anatomical structural variation where thin, hypopigmented Retinal Pigment Epithelium allows large orange-brown choroidal blood vessels to show through clearly in a striped pattern.",
    visualSigns: [
      "Tigroid or striped pattern of choroidal blood vessels across the posterior pole",
      "Prominent choroidal vascular outline visible through thin RPE layer",
      "Absence of focal edema, hemorrhages, or exudative lesions",
    ],
    streamPreference:
      "Ben Graham stream (amplifies choroidal vessel edge striations and textural contrast).",
    recommendations:
      "Differentiate from pathological chorioretinal atrophy; routine optometric monitoring without urgent therapeutic intervention unless accompanied by high axial myopia.",
  },
  ODC: {
    code: "ODC",
    name: "Optic Disc Cupping",
    category: "Structural",
    landmark: "Optic Nerve Head (ONH) & Optic Cup",
    overview:
      "Progressive structural excavation and enlargement of the central optic cup relative to the total optic disc diameter, reflecting axonal loss of retinal ganglion cells.",
    visualSigns: [
      "Vertical Cup-to-Disc Ratio (CDR) exceeding 0.5 – 0.6",
      "Inter-ocular CDR asymmetry greater than 0.2",
      "Focal neuroretinal rim thinning or notching (breaching the ISNT rule)",
      "Nasal displacement and bayoneting of retinal vessels at the cup rim",
    ],
    streamPreference:
      "Colour-preserving stream (highlights subtle disc paleness and cup cup-to-disc boundary contrast).",
    recommendations:
      "Conduct formal glaucoma evaluation including intraocular pressure (IOP) measurement, corneal pachymetry, OCT of the retinal nerve fiber layer (RNFL), and visual field perimetry.",
  },
  Cataract: {
    code: "Cataract",
    name: "Ocular Media Opacity / Cataract",
    category: "Global",
    landmark: "Crystalline Lens (Anterior Segment)",
    overview:
      "Progressive opacification and clouding of the eye's crystalline lens, degrading optical clarity and causing generalized image blur, low contrast, and yellow-brown hue shift across the fundus photograph.",
    visualSigns: [
      "Global image blur and diffuse optical haze",
      "Attenuation of fine vascular detail and diminished foveal reflex",
      "Yellow-brown nuclear color cast across the entire photograph",
    ],
    streamPreference:
      "Balanced across both streams (global optical haze affects structural contrast and colour cast).",
    recommendations:
      "Slit-lamp biomicroscopic evaluation for lens grading, visual acuity testing, and elective phacoemulsification with intraocular lens (IOL) implantation if visual function is impaired.",
  },
  Glaucoma: {
    code: "Glaucoma",
    name: "Optic Neuropathy / Glaucoma",
    category: "Structural",
    landmark: "Optic Nerve Head, Neuroretinal Rim & Nerve Fiber Layer (RNFL)",
    overview:
      "A group of progressive optic neuropathies characterized by irreversible retinal ganglion cell degeneration, structural optic disc cupping, and characteristic visual field loss.",
    visualSigns: [
      "Pathological enlargement of the optic cup and neuroretinal rim thinning",
      "Flame-shaped disc margin microhemorrhages (Drance hemorrhages)",
      "Retinal Nerve Fiber Layer (RNFL) wedge-shaped structural defects",
      "Peripapillary atrophy (Zone beta PPA)",
    ],
    streamPreference:
      "Structural / Ben Graham stream (pinpoints nerve fiber layer defects and disc boundary geometry).",
    recommendations:
      "Urgent glaucoma specialist evaluation: intraocular pressure (IOP) tonometry, gonioscopy, OCT RNFL thickness analysis, visual field testing, and initiation of topical hypotensive drops or laser trabeculoplasty.",
  },
  Normal: {
    code: "Normal",
    name: "Normal Retinal Fundus",
    category: "Global",
    landmark: "Entire Posterior Pole (Disc, Macula, Vessels, RPE)",
    overview:
      "Healthy, uncompromised retinal anatomical structure exhibiting normal vessel architecture, clear optic nerve head boundaries, healthy macula, and uniform RPE pigmentation.",
    visualSigns: [
      "Sharp, well-defined optic disc margins with healthy orange-pink neuroretinal rim",
      "Normal Cup-to-Disc Ratio (CDR < 0.4)",
      "Clear, dark macula lutea with bright central foveal reflex",
      "Smooth, tapering retinal artery and vein arcades without crossing changes",
      "Uniform background RPE pigmentation",
    ],
    streamPreference:
      "Standard healthy baseline across both streams.",
    recommendations:
      "Reassure patient; recommend routine preventative eye care and comprehensive eye examinations every 1–2 years.",
  },
};
