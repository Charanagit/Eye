export type ClinicalReportDetail = {
  code: string;
  name: string;
  icd10: string;
  category: "Structural" | "Chromatic" | "Mixed" | "Global";
  curabilityStatus: "Fully Curable (Reversible)" | "Manageable & Controllable (Chronic)" | "Monitorable & Arrestable" | "Physiological Normal / Benign Variant";
  prognosisSummary: string;
  procedures: {
    title: string;
    description: string;
    type: "Surgical" | "Pharmacological" | "Laser" | "Systemic / Prophylactic";
  }[];
  diagnosticConfirmation: string[];
  systemicManagement: string;
  specialistReferral: string;
};

export const CLINICAL_REPORTS_DATABASE: Record<string, ClinicalReportDetail> = {
  Cataract: {
    code: "Cataract",
    name: "Ocular Media Opacity / Cataract",
    icd10: "H25.9 (Age-Related Cataract, Unspecified) / H26.9",
    category: "Global",
    curabilityStatus: "Fully Curable (Reversible)",
    prognosisSummary:
      "Excellent visual prognosis. Anatomical optical transparency and visual acuity are fully restored post-operatively in the absence of co-existing retinal pathology.",
    procedures: [
      {
        title: "Standard Micro-Incision Phacoemulsification",
        description:
          "Ultrasonic emulsification and aspiration of the opaque crystalline lens nucleus through a 2.2–2.8 mm clear corneal incision.",
        type: "Surgical",
      },
      {
        title: "Intraocular Lens (IOL) Implantation",
        description:
          "Capsular bag placement of a foldable artificial IOL (Monofocal for distance, Toric for corneal astigmatism, or EDOF/Multifocal for presbyopia correction).",
        type: "Surgical",
      },
      {
        title: "Femtosecond Laser-Assisted Cataract Surgery (FLACS)",
        description:
          "Laser-automated capsulotomy, lens fragmentation, and corneal incision creation for enhanced surgical precision.",
        type: "Surgical",
      },
      {
        title: "Post-Operative Topical Pharmacotherapy",
        description:
          "Topical broad-spectrum fluoroquinolone antibiotic (Moxifloxacin 0.5%) + topical corticosteroid (Prednisolone acetate 1%) tapering over 4 weeks.",
        type: "Pharmacological",
      },
    ],
    diagnosticConfirmation: [
      "Slit-lamp biomicroscopy under dilation for lens nucleus & cortex opacity grading (LOCS III scale)",
      "Optical Biometry (IOLMaster / Lenstar) for axial length & keratometry to calculate IOL power",
      "Endothelial cell count (Specular Microscopy) if corneal gutta or endothelial dystrophy is present",
      "Post-op Macular SD-OCT if visual acuity recovery is suboptimal post-surgery",
    ],
    systemicManagement: "Pre-operative blood pressure control and glycemic stabilization. Continue systemic anticoagulants unless advised by operating surgeon.",
    specialistReferral: "Refer to an Ophthalmic Cataract & Anterior Segment Surgeon for elective surgical scheduling.",
  },

  DR: {
    code: "DR",
    name: "Diabetic Retinopathy",
    icd10: "E11.319 (Type 2 Diabetes Mellitus with Unspecified Diabetic Retinopathy) / H36.0",
    category: "Structural",
    curabilityStatus: "Manageable & Controllable (Chronic)",
    prognosisSummary:
      "Progression can be effectively arrested with timely intervention. Vision loss is preventable; established macular edema or ischemic neuropathy requires long-term maintenance therapy.",
    procedures: [
      {
        title: "Intravitreal Anti-VEGF Injections",
        description:
          "Intravitreal administration of Anti-VEGF agents (Aflibercept 2mg/8mg, Faricimab, or Ranibizumab) for Center-Involving Diabetic Macular Edema (CIDME) and neovascularization.",
        type: "Pharmacological",
      },
      {
        title: "Panretinal Photocoagulation (PRP) Laser",
        description:
          "Argon/PASCAL laser ablation of peripheral ischemic retina to regress retinal/disc neovascularization in Proliferative DR (PDR) or severe NPDR.",
        type: "Laser",
      },
      {
        title: "Pars Plana Vitrectomy (PPV)",
        description:
          "23G/25G micro-incision vitrectomy for non-clearing vitreous hemorrhage, tractional retinal detachment (TRD), or persistent premacular fibrovascular membranes.",
        type: "Surgical",
      },
      {
        title: "Intravitreal Corticosteroid Implants",
        description:
          "Sustained-release Dexamethasone 0.7mg implant (Ozurdex) for pseudophakic patients or anti-VEGF non-responders with refractory edema.",
        type: "Pharmacological",
      },
    ],
    diagnosticConfirmation: [
      "Spectral-Domain OCT (SD-OCT) to measure Central Subfield Thickness (CST) and intraretinal fluid (IRF/SRF)",
      "Fundus Fluorescein Angiography (FFA) to delineate macular capillary non-perfusion (ischemia) and leakage points",
      "Widefield Color Fundus Photography for lesion counts & staging (ETDRS criteria)",
    ],
    systemicManagement: "Strict glycemic control (HbA1c target < 7.0%), blood pressure management (< 130/80 mmHg), and serum lipid lowering (statins).",
    specialistReferral: "Urgent referral to a Vitreoretinal Specialist for anti-VEGF loading doses or laser photocoagulation.",
  },

  ARMD: {
    code: "ARMD",
    name: "Age-Related Macular Degeneration",
    icd10: "H35.31 (Non-Exudative Dry ARMD) / H35.32 (Exudative Wet ARMD)",
    category: "Mixed",
    curabilityStatus: "Manageable & Controllable (Chronic)",
    prognosisSummary:
      "Wet (exudative) ARMD responds well to regular intravitreal therapy with vision stabilization in >90% of cases. Dry ARMD requires disease-modifying monitoring to slow geographic atrophy.",
    procedures: [
      {
        title: "Intravitreal Anti-VEGF Pharmacotherapy (Wet ARMD)",
        description:
          "First-line anti-angiogenic intravitreal therapy (Aflibercept, Faricimab, Ranibizumab) on a Treat-and-Extend (T&E) protocol to close Choroidal Neovascular Membranes (CNVM).",
        type: "Pharmacological",
      },
      {
        title: "Intravitreal Complement Inhibitor Therapy (Geographic Atrophy)",
        description:
          "Targeted complement cascade inhibition (Pegcetacoplan / Avacincaptad pegol) to slow RPE cell loss and geographic atrophy lesion enlargement.",
        type: "Pharmacological",
      },
      {
        title: "High-Dose AREDS2 Micronutrient Supplementation",
        description:
          "Oral formulation: Lutein 10mg, Zeaxanthin 2mg, Vitamin C 500mg, Vitamin E 400IU, Zinc 80mg, Copper 2mg for intermediate dry ARMD.",
        type: "Systemic / Prophylactic",
      },
    ],
    diagnosticConfirmation: [
      "High-Resolution Macular SD-OCT (evaluating Subretinal Fluid, Intraretinal Cysts, and Pigment Epithelial Detachments)",
      "OCT-Angiography (OCT-A) to non-invasively map CNVM vascular net architecture",
      "Fundus Autofluorescence (FAF) to quantify areas of hyper/hypo-autofluorescence in Geographic Atrophy",
    ],
    systemicManagement: "Smoking cessation (reduces progression risk by 2-3x), UV protective eyewear, and daily home Amsler Grid monitoring.",
    specialistReferral: "Prompt referral to a Medical Retina Specialist for intravitreal Anti-VEGF loading phase if metamorphosis or fluid is present.",
  },

  Glaucoma: {
    code: "Glaucoma",
    name: "Optic Neuropathy / Glaucoma",
    icd10: "H40.11 (Primary Open-Angle Glaucoma - POAG)",
    category: "Structural",
    curabilityStatus: "Monitorable & Arrestable",
    prognosisSummary:
      "Optic nerve axonal damage is irreversible, but lowering Intraocular Pressure (IOP) to target range effectively arrests visual field decline and preserves functional vision.",
    procedures: [
      {
        title: "Topical Ocular Hypotensive Pharmacotherapy",
        description:
          "First-line prostaglandin analogs (Latanoprost 0.005%, Bimatoprost) to increase uveoscleral outflow, supplemented by beta-blockers or alpha-agonists.",
        type: "Pharmacological",
      },
      {
        title: "Selective Laser Trabeculoplasty (SLT)",
        description:
          "Non-thermal laser application targeting pigmented trabecular meshwork cells to boost aqueous humor drainage (first-line alternative to drops).",
        type: "Laser",
      },
      {
        title: "Minimally Invasive Glaucoma Surgery (MIGS)",
        description:
          "Micro-stent placement (iStent, Hydrus) or canaloplasty to lower IOP with minimal anatomical disruption during phacoemulsification.",
        type: "Surgical",
      },
      {
        title: "Filtering Surgery (Trabeculectomy / Glaucoma Valve)",
        description:
          "Scleral flap guarded filtering surgery with Mitomycin C (MMC) or aqueous shunt valve implantation (Ahmed/Baerveldt) for advanced uncontrolled glaucoma.",
        type: "Surgical",
      },
    ],
    diagnosticConfirmation: [
      "Goldmann Applanation Tonometry (GAT) for baseline & diurnal IOP measurement",
      "SD-OCT Retinal Nerve Fiber Layer (RNFL) & Ganglion Cell Complex (GCC) thickness analysis",
      "Humphrey Visual Field (HVF 24-2 / 30-2 Swedish Interactive Threshold Algorithm perimetry)",
      "Corneal Pachymetry for Central Corneal Thickness (CCT) IOP adjustment & Gonioscopy for angle assessment",
    ],
    systemicManagement: "Avoid nocturnal systemic hypotension. Educate patient on lifelong compliance with topical drop regimen.",
    specialistReferral: "Refer to a Glaucoma Specialist for SLT laser evaluation, target IOP determination, or filtration surgery.",
  },

  BRVO: {
    code: "BRVO",
    name: "Branch Retinal Vein Occlusion",
    icd10: "H34.831 / H34.832 (Branch Retinal Vein Occlusion, Right/Left Eye)",
    category: "Structural",
    curabilityStatus: "Manageable & Controllable (Chronic)",
    prognosisSummary:
      "High visual recovery potential (>80%) if anti-VEGF or steroid therapy is initiated early for macular edema before permanent foveal ischemia occurs.",
    procedures: [
      {
        title: "Intravitreal Anti-VEGF Pharmacotherapy",
        description:
          "Intravitreal injections (Ranibizumab, Aflibercept, Faricimab) to resolve secondary macular edema and suppress ischemia-driven VEGF expression.",
        type: "Pharmacological",
      },
      {
        title: "Intravitreal Corticosteroid Implant (Ozurdex)",
        description:
          "Sustained-release Dexamethasone 0.7mg intravitreal implant for refractory macular edema, offering 4-6 months of therapeutic anti-inflammatory action.",
        type: "Pharmacological",
      },
      {
        title: "Sectoral Macular / Peripheral Laser Photocoagulation",
        description:
          "Sectoral grid laser for chronic macular edema or peripheral scatter laser photocoagulation over ischemic non-perfused sectors to prevent neovascular glaucoma.",
        type: "Laser",
      },
    ],
    diagnosticConfirmation: [
      "SD-OCT for foveal central subfield thickness and intraretinal fluid quantification",
      "Fundus Fluorescein Angiography (FFA) to identify the AV crossing site, non-perfused capillary area, and collateral vessel formation",
    ],
    systemicManagement: "Comprehensive cardiovascular workup: screening for arterial hypertension, hyperlipidemia, diabetes mellitus, hypercoagulability, and obstructive sleep apnea.",
    specialistReferral: "Refer to a Retina Specialist for macular OCT monitoring and intravitreal anti-VEGF injection loading.",
  },

  ODC: {
    code: "ODC",
    name: "Optic Disc Cupping",
    icd10: "H47.23 (Glaucomatous Optic Atrophy) / H40.0 (Glaucoma Suspect)",
    category: "Structural",
    curabilityStatus: "Monitorable & Arrestable",
    prognosisSummary:
      "Represents a structural risk indicator. Prompt identification allows early intervention before permanent functional visual field loss occurs.",
    procedures: [
      {
        title: "Baseline Glaucomatous Diagnostic Workup",
        description:
          "Comprehensive baseline structural and functional assessment to differentiate physiological cupping from early glaucomatous optic neuropathy.",
        type: "Systemic / Prophylactic",
      },
      {
        title: "Prophylactic Ocular Hypotensive Therapy",
        description:
          "Initiating topical prostaglandin analog drops or SLT laser if baseline IOP is elevated (> 21 mmHg) or structural RNFL thinning is confirmed.",
        type: "Pharmacological",
      },
    ],
    diagnosticConfirmation: [
      "Disc Stereophotography or High-Resolution Color ONH Imaging",
      "SD-OCT Optic Nerve Head & RNFL / GCC structural map",
      "Humphrey Visual Field 24-2 SITA-Fast perimetry",
      "Gonioscopy & Central Corneal Thickness Pachymetry",
    ],
    systemicManagement: "Screen for systemic vascular dysregulation, nocturnal hypotension, or sleep apnea.",
    specialistReferral: "Refer to an Ophthalmologist or Glaucoma Specialist for risk stratification and baseline visual field testing.",
  },

  MYA: {
    code: "MYA",
    name: "Pathologic Myopia (Myopic Maculopathy)",
    icd10: "H44.2 (Degenerative Myopia)",
    category: "Mixed",
    curabilityStatus: "Manageable & Controllable (Chronic)",
    prognosisSummary:
      "Myopic choroidal neovascularization responds rapidly to Anti-VEGF injections. Structural tractional changes require close vitreoretinal monitoring.",
    procedures: [
      {
        title: "Intravitreal Anti-VEGF Therapy (Myopic CNV)",
        description:
          "Targeted Anti-VEGF injection for active myopic choroidal neovascular membranes (often requires fewer injections than wet ARMD).",
        type: "Pharmacological",
      },
      {
        title: "Pars Plana Vitrectomy with Fovea-Sparing ILM Peel",
        description:
          "Vitreoretinal surgery for Myopic Traction Maculopathy (MTM), foveoschisis, or myopic macular hole to relieve anteroposterior and tangential traction.",
        type: "Surgical",
      },
      {
        title: "Prophylactic Peripheral Barrier Laser Photocoagulation",
        description:
          "Laser demarcation around peripheral lattice degeneration, asymptomatic retinal breaks, or tears to prevent myopic retinal detachment.",
        type: "Laser",
      },
    ],
    diagnosticConfirmation: [
      "Optical Biometry (Axial length measurement > 26.5 mm)",
      "High-Resolution Macular SD-OCT (evaluating maculoschisis, lacquer cracks, and CNV)",
      "Widefield Fundus Photography to document staphyloma boundaries and peripheral lattice",
    ],
    systemicManagement: "Educate patient on warning signs of retinal detachment (flashes, sudden floaters, curtain-like visual loss). Avoid high-impact trauma.",
    specialistReferral: "Refer to a Vitreoretinal Specialist for macular OCT monitoring and peripheral retinal evaluation.",
  },

  DN: {
    code: "DN",
    name: "Retinal Drusen (Drusenoid Lesions)",
    icd10: "H35.36 (Drusen, Non-Degenerative / Early ARMD)",
    category: "Structural",
    curabilityStatus: "Monitorable & Arrestable",
    prognosisSummary:
      "Favorable visual prognosis in early/intermediate stages. Requires long-term monitoring to prevent progression to geographic atrophy or wet ARMD.",
    procedures: [
      {
        title: "AREDS2 Oral Micronutrient Protocol",
        description:
          "Administration of AREDS2 antioxidant formula for patients with intermediate soft drusen (> 125 μm) or large confluent drusen.",
        type: "Systemic / Prophylactic",
      },
      {
        title: "Daily Amsler Grid Self-Monitoring Protocol",
        description:
          "Patient-directed home screening for new metamorphopsia (line distortion) indicating wet ARMD conversion.",
        type: "Systemic / Prophylactic",
      },
    ],
    diagnosticConfirmation: [
      "Macular SD-OCT to quantify sub-RPE drusen volume and evaluate outer retinal integrity",
      "Fundus Autofluorescence (FAF) to map RPE lipofuscin accumulation",
    ],
    systemicManagement: "Smoking cessation, Mediterranean diet rich in leafy green vegetables and oily fish, UV protection.",
    specialistReferral: "Routine annual comprehensive ophthalmic monitoring unless metamorphopsia develops.",
  },

  TSLN: {
    code: "TSLN",
    name: "Tessellation (Fundus Tigroid)",
    icd10: "H35.9 (Unspecified Retinal Disorder / Benign Physiological Variant)",
    category: "Chromatic",
    curabilityStatus: "Physiological Normal / Benign Variant",
    prognosisSummary:
      "Benign anatomical visual prognosis. No visual acuity loss is directly attributable to un-complicated fundus tessellation.",
    procedures: [
      {
        title: "Patient Reassurance & Refraction Assessment",
        description:
          "Reassure patient regarding benign nature of choroidal vascular visibility through thin RPE layer; perform manifest refraction.",
        type: "Systemic / Prophylactic",
      },
    ],
    diagnosticConfirmation: [
      "Dilated Fundus Biomicroscopy",
      "Optical Biometry / Refraction to assess axial length and exclude high pathologic myopia",
    ],
    systemicManagement: "No specific medical or systemic intervention required.",
    specialistReferral: "No specialist referral necessary unless accompanied by high axial myopia or macular atrophy.",
  },

  Normal: {
    code: "Normal",
    name: "Normal Retinal Fundus",
    icd10: "Z01.00 (Encounter for Examination of Eyes Without Abnormal Findings)",
    category: "Global",
    curabilityStatus: "Physiological Normal / Benign Variant",
    prognosisSummary:
      "Normal anatomical structure with optimal visual prognosis.",
    procedures: [
      {
        title: "Routine Preventative Examination Schedule",
        description:
          "Maintain routine comprehensive eye examinations every 1–2 years based on age and systemic health factors.",
        type: "Systemic / Prophylactic",
      },
    ],
    diagnosticConfirmation: [
      "Standard Color Fundus Photography",
      "Routine Non-Contact Tonometry (IOP)",
    ],
    systemicManagement: "Encourage general cardiovascular health and protective UV eyewear.",
    specialistReferral: "No referral indicated.",
  },
};
