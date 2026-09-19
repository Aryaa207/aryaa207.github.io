---
{
  "title": "3D guidance simulation",
  "shortTitle": "3D guidance simulation",
  "summary": "A MATLAB comparison of True and Augmented Proportional Navigation, supported by a randomized study and original presentation plots.",
  "role": "Primary contributor · implementation & analysis",
  "period": "April 2026",
  "order": 1,
  "lenses": [
    "gnc"
  ],
  "tools": [
    "MATLAB",
    "Monte Carlo analysis",
    "PN / APN"
  ],
  "visual": "guidance",
  "status": "Case study",
  "source": "Final MATLAB Live Script and slides; author-confirmed primary implementation and analysis role (September 2026)",
  "missing": [],
  "specs": [
    {
      "label": "Presented comparison",
      "value": "200 randomized trials"
    },
    {
      "label": "Model",
      "value": "3D kinematics"
    },
    {
      "label": "Methods compared",
      "value": "True PN / Augmented PN"
    }
  ]
}
---

## Contribution
I was the primary contributor to the MATLAB implementation and analysis. The final presentation was coauthored with Bryce Leighton and Evan McGee. My work covered the simulation framework, randomized comparison, and analysis of the resulting plots.

## Analysis objective
Compare True PN and Augmented PN across varied simulation conditions, rather than drawing a conclusion from a single run. The final code and presentation use a 200-trial ensemble.

## Method
The framework varies geometry, maneuver conditions, and line-of-sight measurement noise. A deterministic trajectory provides a visual example; the randomized ensemble provides the broader comparison. Trajectory, acceleration, and ensemble plots are presented separately so the example is not mistaken for the overall result.

## Reported results
The final presentation reports mean miss distances of 0.44296 m for TPN and 0.4558 m for APN. Mean peak accelerations are 13.423 g and 15.833 g respectively. For this ensemble, the mean position outcomes are similar while the acceleration demand differs.

## Interpretation and limits
These are classroom simulation outputs, not flight-test measurements. The model uses simplified kinematics and idealized acceleration information. The reported means alone do not establish statistical equivalence; the case study does not claim a formal equivalence test or a hardware validation result.
