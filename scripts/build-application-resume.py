from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from pypdf import PdfReader, PdfWriter
import shutil

OUT=Path('output/pdf/aryaa-vijay-resume.pdf')
OUT.parent.mkdir(parents=True,exist_ok=True)
TEMP=Path('tmp/pdfs/resume-render.pdf');TEMP.parent.mkdir(parents=True,exist_ok=True)
c=canvas.Canvas(str(TEMP),pagesize=(612,792),pageCompression=1)
left,right=43,569; y=748
ink=colors.HexColor('#162432');muted=colors.HexColor('#445263');accent=colors.HexColor('#245c72')
styles={
 'body':ParagraphStyle('body',fontName='Helvetica',fontSize=9.4,leading=13.1,textColor=ink),
 'small':ParagraphStyle('small',fontName='Helvetica',fontSize=9,leading=12.2,textColor=muted),
}
def para(text,style='body',indent=0,space=4):
 global y
 p=Paragraph(text,styles[style]);w,h=p.wrap(right-left-indent,1000);p.drawOn(c,left+indent,y-h);y-=h+space

def section(title):
 global y
 y-=9;c.setFont('Helvetica-Bold',10);c.setFillColor(accent);c.drawString(left,y,title.upper());c.setStrokeColor(colors.HexColor('#c3ced5'));c.setLineWidth(.5);c.line(left,y-6,right,y-6);y-=18

def project(title,date):
 global y
 c.setFont('Helvetica-Bold',10);c.setFillColor(ink);c.drawString(left,y-10,title);c.setFont('Helvetica',9);c.setFillColor(muted);c.drawRightString(right,y-10,date);y-=18

def bullet(text):para('• '+text,indent=5,space=3)

c.setFillColor(ink);c.setFont('Helvetica-Bold',24);c.drawString(left,y,'ARYAA VIJAY');y-=23
para('Aerospace Engineering | Hardware Integration, Controls &amp; CFD','small',space=5)
para('<link href="mailto:avijay2024@my.fit.edu" color="#245c72">avijay2024@my.fit.edu</link>  |  <link href="https://github.com/Aryaa207" color="#245c72">github.com/Aryaa207</link>  |  <link href="https://linkedin.com/in/aryaa-vijay" color="#245c72">LinkedIn</link>','small',space=4)
para('<link href="https://aryaa207.github.io/" color="#245c72"><b>Portfolio: aryaa207.github.io</b></link>','small',space=4)
para('Melbourne, FL | U.S. citizen | Available May 2027: full-time or internship','small',space=2)
section('Education')
para('<b>Florida Institute of Technology</b> - B.S. Aerospace Engineering<br/>Expected May 2027 | <b>GPA 3.8 / 4.0</b> | Dean’s List: Fall 2024, Fall 2025',space=4)
para('Coursework: Control Systems, Aerodynamics, Compressible Flow, Fluid Mechanics, Thermodynamics, Aerospace Structural Design, Materials Science, Computational Techniques.','small',space=2)
section('Technical projects')
project('S.A.R.D. Quadcopter & Vision Payload','2025 - 2026')
bullet('Independently integrated a quadcopter platform, flight controller, sensor hardware, and Raspberry Pi 4B vision software using Python and OpenCV.')
bullet('Designed and 3D-printed a two-axis camera mount in Onshape with micro-servo integration; assembled and demonstrated the physical hardware and camera interface.')
bullet('Built an LSM9DS1 acquisition dashboard with startup gyro-bias sampling, roll/pitch estimation, and WebSocket streaming to the browser.')
project('3D Guidance Simulation - PN / APN','April 2026')
bullet('Primary contributor to MATLAB simulation implementation and analysis in a three-person presentation team; compared True and Augmented Proportional Navigation.')
bullet('Developed a randomized evaluation framework and analyzed trajectory and acceleration histories; final code and presentation document a 200-trial ensemble.')
project('Mach 5 External Aerodynamics','January - February 2026')
bullet('Prepared geometry and a 3,389,998-cell tetrahedral mesh for ANSYS Fluent analysis using a density-based solver and SST k-omega turbulence model.')
bullet('Examined Mach and pressure contours to study shock structure and pressure distribution; documented model assumptions and convergence limitations.')
project('Flying-Wing Glider - Project Manager','May 2025')
bullet('Led airfoil selection, Reynolds-number estimation, and glide-ratio prediction in a team of four; created NX CAD and drawings and coordinated fabrication and flight testing.')
section('Research experience')
project('Undergraduate Research Assistant - Florida Tech','Sep 2025 - Apr 2026')
para('<b>Functional Biomaterials Lab</b>','small',space=4)
bullet('Prepared precision chemical solutions and material samples for microscopy and structural characterization; calibrated and operated 3D bioprinting equipment.')
bullet('Maintained laboratory records, recorded testing parameters, and compiled data summaries for senior research staff.')
section('Technical tools')
para('<b>Analysis:</b> MATLAB, Python, ANSYS Fluent, Monte Carlo analysis, data acquisition<br/><b>Design:</b> NX Siemens, Onshape, KiCad, 3D printing<br/><b>Embedded:</b> Raspberry Pi, Arduino, IMU integration, OpenCV, Git, LabVIEW',space=0)
assert y>38, f'Resume overflow: bottom y={y}'
c.save()
reader=PdfReader(TEMP);assert len(reader.pages)==1
writer=PdfWriter();writer.add_page(reader.pages[0]);writer.add_metadata({})
with OUT.open('wb') as f:writer.write(f)
shutil.copyfile(OUT,'public/documents/aryaa-vijay-resume.pdf')
text=PdfReader(OUT).pages[0].extract_text();assert '200-trial' in text and '3.8 / 4.0' in text and '500-trial' not in text
print(f'Created one-page application resume; final content baseline {y:.1f} pt.')
