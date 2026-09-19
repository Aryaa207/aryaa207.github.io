---
{
  "title": "S.A.R.D. surveillance drone",
  "shortTitle": "S.A.R.D. quadcopter",
  "summary": "A solo-built quadcopter connecting custom mechanical hardware, embedded sensing, and an onboard computer-vision payload.",
  "role": "Solo project · hardware, software & integration",
  "period": "2025–2026",
  "order": 0,
  "lenses": [
    "embedded",
    "gnc"
  ],
  "tools": [
    "Python",
    "Raspberry Pi 4B",
    "Arduino",
    "OpenCV",
    "Onshape"
  ],
  "visual": "drone",
  "status": "Case study",
  "source": "Original hardware photographs, poster, bench recordings, Aryaa207/sard-assets source, and author-confirmed ownership and technical limitations (September 2026)",
  "missing": [
    "Measured vibration, detection-distance, and flight-stability test records"
  ],
  "specs": [
    {
      "label": "Project ownership",
      "value": "Solo build"
    },
    {
      "label": "Camera sensor",
      "value": "64 MP Arducam"
    },
    {
      "label": "Airframe wheelbase",
      "value": "500 mm"
    },
    {
      "label": "Onboard compute",
      "value": "Raspberry Pi 4B"
    },
    {
      "label": "Sensor controller",
      "value": "Arduino Nano"
    },
    {
      "label": "Camera mount",
      "value": "3D-printed · 2 axes"
    }
  ]
}
---

## Independent project ownership
I selected and integrated the components, assembled and wired the airframe, developed the sensing and vision software, and designed the two-axis camera mount in Onshape for 3D printing. The work covered mechanical packaging, embedded software, camera hardware, and system integration.

## Subsystem architecture
The KK2.1.5 handles flight stabilization, while the Raspberry Pi 4B runs Python/OpenCV vision software. The project poster specifies an Arduino Nano for sensor acquisition. The separate IMU bench implementation reads the LSM9DS1 directly over Raspberry Pi I²C and sends data to a browser over WebSocket. The bench sensor pipeline is separate from the flight-stabilization controller.

## Camera vibration: intervention and result
Camera jitter was one of the main technical problems. I added rubber dampers to isolate the camera hardware, but the improvement was limited and the vibration problem was not fully resolved.

The next useful measurement would compare recorded image motion with and without the dampers under the same operating conditions. This comparison remains planned work.

## Detection range and stabilization
Long-range detection was difficult, and stabilizing and tuning the drone was also challenging. The bench recordings document a working vision interface and sensor visualization. Repeatable detection-distance and flight-stability measurements remain future work.

## Sensor acquisition
The Python bench application reads acceleration and angular rate from the LSM9DS1, averages 100 stationary gyro samples for startup bias calibration, and streams sensor and attitude values over WebSocket. Separate angle-and-bias filters estimate roll and pitch; yaw is integrated from angular rate. The interactive IMU demonstration uses generated inputs, while the bench video below shows the physical setup.

## Demonstrated outcome
The resulting prototype combines the physical quadcopter, a custom camera mount, embedded sensing, and a computer-vision interface. The photographs and recordings document assembly, bench operation, and the Florida Tech demonstration. The principal remaining work is controlled measurement of vibration, detection performance, and flight stability.
