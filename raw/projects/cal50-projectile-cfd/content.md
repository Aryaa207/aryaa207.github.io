---
{
  "title": ".50-caliber projectile CFD",
  "shortTitle": "Supersonic projectile CFD",
  "summary": "A Mach 2.7 external-flow study examining shock structure and aerodynamic behavior in ANSYS Fluent.",
  "role": "CAD & CFD study",
  "period": "February 2026",
  "order": 6,
  "lenses": [
    "cfd"
  ],
  "tools": [
    "ANSYS Fluent",
    "Onshape",
    "SST k–ω"
  ],
  "visual": "flow",
  "status": "Case study",
  "source": "Ansys_Fluent_Simulation_Report.pdf (12 February 2026) and original contour exports",
  "missing": [
    "Reference dimensions/area convention and personal reflection"
  ],
  "specs": [
    {
      "label": "Freestream condition",
      "value": "Mach 2.7 · 300 K"
    },
    {
      "label": "Volume mesh",
      "value": "1,804,197 cells"
    },
    {
      "label": "Recorded iterations",
      "value": "950"
    },
    {
      "label": "Reported drag coefficient",
      "value": "0.4166 · provisional"
    },
    {
      "label": "Solution state",
      "value": "Partially converged"
    }
  ]
}
---

## Supersonic flow analysis
This external-aerodynamics study uses ANSYS Fluent to examine the flow around a .50-caliber projectile geometry. The source package includes the geometry, mesh screenshots, solver report, and original Mach, pressure, velocity, temperature, and pathline exports.

## The computational record
The report records a mixed-cell mesh containing 1,804,197 cells and a steady, density-based implicit SST k–ω calculation. The freestream condition is Mach 2.7 at 300 K. The final saved report is at 950 iterations.

## Reported results
The recorded drag coefficient is 0.4165686. It is a provisional result: the report marks the x- and y-velocity residuals converged, while continuity, z-velocity, energy, and both turbulence equations remain above their listed stopping criteria. The original residual and monitor plots are included below.

The report also gives 718.783 K as an area-weighted total-temperature result. It is not a maximum static temperature. Keeping that distinction matters when comparing it with the temperature contour.

## Flow visualization
The gallery presents several views of the same study: Mach number for the compressible-flow structure, pressure for the spatial loading pattern, temperature for the thermal field, and pathlines for the flow trajectory. Legends and units are preserved, and each image can be enlarged.

## Validation scope
The reference area and length in the export need to be reconciled with the geometry before the drag coefficient is compared against another case. The current material supports a documented methodology study, rather than a fully validated performance result.
