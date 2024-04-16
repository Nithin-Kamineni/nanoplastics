#install.packages(c('mrgsolve','zoo','patchwork','FME'))
library(plumber)
library(jsonlite)
library(mrgsolve)    # Needed for Loading mrgsolve code into r via mcode from the 'mrgsolve' pckage
library(magrittr)    # The pipe, %>% , comes from the magrittr package by Stefan Milton Bache
library(ggplot2)     # Needed for plot
library(gridExtra)   # Arrange plots in to one figure
library(FME)         # Package for MCMC simulation and model fitting
library(minpack.lm)  # Package for model fitting
library(reshape)     # Package for melt function to reshape the table
library(tidyr)       # R-package for tidy messy data
library(tidyverse)   # R-package for tidy messy data
library(jsonlite)

## Set the working directory to the script's directory
#script_dir <- dirname(rstudioapi::getSourceEditorContext()$path)
#setwd(script_dir)

PBPK.code <-'
$PROB
## Microplastics (MPs) PBPK model for male mouse
- Author    : Chi-Yun Chen
- Advisor   : Zhoumeng Lin
- Date      : February 12, 2024
- Strucutre : Lung, Spleen, Liver, GI tract, Kidney, Brain, Rest of body, Blood

$PARAM @annotated
// #+ Body weight and fraction of blood flow to tissues
BW     : 0.02      : kg,       body weight                       ; Calculated from Keinänen et al., 2021
QCC    : 16.5      : L/h/kg^0.75, Cardiac output; Value obtained ; Brown et al., 1997, Cardiac Output (L/min) = 0.275*(BW)^0.75
QLuC   : 1         : % of QCC, Fraction of blood flow to lung    ; Brown et al., 1997, 
QSC    : 0.011     : % of QCC, Fraction of blood flow to spleen  ; Davis and Morris, 1993, Table III
QLC    : 0.161     : % of QCC, Fraction of blood flow to liver   ; Brown et al., 1997, Table 23
QGIC   : 0.141     : % of QCC, Fraction of blood flow to GI tract; Lee et al., 2009
QKC    : 0.091     : % of QCC, Fraction of blood flow to kidney  ; Brown et al., 1997, Table 23
QBRC   : 0.033     : % of QCC, Fraction of blood flow to brain   ; Brown et al., 1997, Table 23

// #+ Fraction of volume of tissues out of body weight
VLuC   : 0.007     : % of BW,  Fraction of volume of lung        ; Brown et al., 1997, Table 21, 4
VGIC   : 0.042     : % of BW,  Fraction of volume of GI          ; Brown et al., 1997, Table 21
VLC    : 0.055     : % of BW,  Fraction of volume of liver       ; Brown et al., 1997, Table 21
VKC    : 0.017     : % of BW,  Fraction of volume of kidney      ; Brown et al., 1997, Table 21
VSC    : 0.005     : % of BW,  Fraction of volume of spleen      ; Davis and Morris (1993), Table I
VBRC   : 0.017     : % of BW,  Fraction of volume of brain       ; Brown et al., 1997, Table 21
VBC    : 0.049     : % of BW,  Fraction of volume of blood       ; Brown et al., 1997, Table 21

// #+ Fraction of blood volume in tissues
BVLu   : 0.50      : % of VLu, Fraction of blood volume in lung  ; Brown et al., 1997, Table 30
BVGI   : 0.03      : % of VGI, Fraction of blood volume in GI    ; Calculated from Abuqayyas et al., 2012, Table 6
BVL    : 0.31      : % of VL,  Fraction of blood volume in liver ; Brown et al., 1997, Table 30
BVK    : 0.24      : % of VLK, Fraction of blood volume in kidney; Brown et al., 1997, Table 30
BVS    : 0.17      : % of VLS, Fraction of blood volume in spleen; Brown et al., 1997, Table 30
BVBR   : 0.03      : % of VLS, Fraction of blood volume in brain ; Brown et al., 1997, Table 30
BVR    : 0.04      : % of VR,  Fraction of blood volume in rest of body; Brown et al., 1997, Assumed the same as muscle

// #+ Partition coefficient
PLu    : 0.15      : Unitless, Partition coefficient of Lung     ; Lin et al., 2016
PGI    : 0.15      : Unitless, Partition coefficient of GI       ; Lin et al., 2016
PL     : 0.08      : Unitless, Partition coefficient of Liver    ; Lin et al., 2016
PK     : 0.15      : Unitless, Partition coefficient of Kidney   ; Lin et al., 2016
PS     : 0.15      : Unitless, Partition coefficient of Spleen   ; Lin et al., 2016
PBR    : 0.15      : Unitless, Partition coefficient of Brain    ; Lin et al., 2016
PR     : 0.15      : Unitless, Partition coefficient of Rest of body; Lin et al., 2016

// #+ Membrane-limited permeability
PALuC  : 0.001     : Unitless, Membrane-limited permeability coefficient of Lung         ; Lin et al., 2016
PAGIC  : 0.001     : Unitless, Membrane-limited permeability coefficient of GI           ; Lin et al., 2016
PALC   : 0.001     : Unitless, Membrane-limited permeability coefficient of Liver        ; Lin et al., 2016
PAKC   : 0.001     : Unitless, Membrane-limited permeability coefficient of Kidney       ; Lin et al., 2016 
PASC   : 0.001     : Unitless, Membrane-limited permeability coefficient of Spleen       ; Lin et al., 2016
PABRC  : 0.000001  : Unitless, Membrane-limited permeability coefficient of Brain        ; Lin et al., 2016
PARC   : 0.000001  : Unitless, Membrane-limited permeability coefficient of Rest of body ; Lin et al., 2016

// #+ Endocytic parameters in spleen; Chou et al., 2023_Table S2
KSRESrelease       : 0.09     : 1/h,      Release rate constant of phagocytic cells
KSRESmax           : 10       : 1/h,      Maximum uptake rate constant of phagocytic cells
KSRES50            : 24       : h,        Time reaching half maximum uptake rate
KSRESn             : 0.5      : Unitless, Hill coefficient, (unitless)
ASREScap           : 150      : ug/g,     tissue, Uptake capacity per tissue weight

// #+ Endocytic parameters in lung
KLuRESrelease     : 0.002    : 1/h,      Release rate constant of phagocytic cells
KLuRESmax         : 0.01     : 1/h,      Maximum uptake rate constant of phagocytic cells
KLuRES50          : 48       : h,        Time reaching half maximum uptake rate
KLuRESn           : 5        : Unitless, Hill coefficient, (unitless)
ALuREScap         : 89       : ug/g,     tissue, Uptake capacity per tissue weight

// #+ Endocytic parameters in kidney
KKRESrelease       : 0.0075   : 1/h,      Release rate constant of phagocytic cells
KKRESmax           : 0.5      : 1/h,      Maximum uptake rate constant of phagocytic cells
KKRES50            : 24       : h,        Time reaching half maximum uptake rate
KKRESn             : 0.5      : Unitless, Hill coefficient, (unitless)
AKREScap           : 330      : ug/g,     tissue, Uptake capacity per tissue weight

// #+ Endocytic parameters in liver
KLRESrelease       : 0.02     : 1/h,      Release rate constant of phagocytic cells 
KLRESmax           : 20       : 1/h,      Maximum uptake rate constant of phagocytic cells
KLRES50            : 24       : h,        Time reaching half maximum uptake rate
KLRESn             : 0.5      : Unitless, Hill coefficient, (unitless)
ALREScap           : 195      : ug/g,     tissue, Uptake capacity per tissue weight 

// #+ Uptake and elimination parameters
KGIb               : 5.41e-3  : 1/h, Absorption rate of GI tract
Kfeces             : 0.141    : 1/h, Fecal clearance
KbileC             : 0.00003  : L/h/kg^0.75, Biliary clearance
KurineC            : 0.00003  : L/h/kg^0.75, Urinary clearance

// #+ Albumin-binding parameters
KD                 : 206.15    : mg/L, Equilibrium dissociation constant      ; Anozie et al., 2020
N                  : 1         : Binding sites                      ; Ju et al., 2020
Calb               : 0.035     : mg/L, Albumin concentration        ; Maclaren and Petras, 1976
Mwalb              : 66500     : g/mol, Molecular weight of albumin ; Byrne et al., 2018
MwPS               : 191600    : g/mol, Molecular weight of PS      ; Liu et al., 2021

$MAIN
// #+ Blood flow to tissues (L/h)
double QC     = QCC*pow(BW,0.75);
double QGI    = QC*QGIC;
double QL     = QC*QLC;
double QK     = QC*QKC;
double QBR    = QC*QBRC;
double QS     = QC*QSC;
double QR     = QC*(1 - QGIC - QLC - QKC - QSC - QBRC);
double QBal   = QC - (QGI + QL + QK + QS + QBR + QR);

// #+ Tissue volumes (L; kg)
double VLu    = BW*VLuC;
double VGI    = BW*VGIC;
double VL     = BW*VLC;
double VK     = BW*VKC;
double VS     = BW*VSC;
double VBR    = BW*VBRC;
double VB     = BW*VBC;
double VR     = BW*(1 - VLuC - VGIC - VLC - VKC - VSC - VBRC - VBC);   
double VBal   = BW - (VLu + VGI + VL + VK + VS + VBR + VR + VB);

// #+ Tissue volumes for different compartments (L)
double VLub   = VLu*BVLu;  
double VLut   = VLu-VLub;  
double VGIb   = VGI*BVGI;  
double VGIt   = VGI-VGIb;  
double VLb    = VL*BVL;    
double VLt    = VL-VLb;    
double VKb    = VK*BVK;    
double VKt    = VK-VKb;    
double VSb    = VS*BVS;    
double VSt    = VS-VSb;
double VBRb   = VBR*BVBR;    
double VBRt   = VBR-VBRb;
double VRb    = VR*BVR;    
double VRt    = VR-VRb;    

// #+ Permeability coefficient-surface area cross-product (L/h)
double PALu   = PALuC*QC;  
double PAGI   = PAGIC*QGI; 
double PAL    = PALC*QL; 
double PAK    = PAKC*QK; 
double PAS    = PASC*QS;
double PABR   = PABRC*QBR;
double PAR    = PARC*QR; 

// #+ Endocytosis rate (1/h)
double KSRESUP     = KSRESmax*(1-(ASRES/(ASREScap*VS)));
double KKRESUP     = KKRESmax*(1-(AKRES/(AKREScap*VK)));
double KLuRESUP    = KLuRESmax*(1-(ALuRES/(ALuREScap*VLu)));
double KLRESUP     = KLRESmax*(1-(ALRES/(ALREScap*VL)));

// #+ Biliary excretion 
double Kbile       = KbileC*pow(BW, 0.75);
double Kurine      = KurineC*pow(BW, 0.75);

// #+ Maximum protein-binding capacity (mg/L)
double Bmax     = Calb*N*MwPS/Mwalb*1000;

// #+ Unbound fraction in blood (-)
double fu      = (KD)/(Bmax+KD);

$INIT @annotated
AA                : 0  : mg, Amount of MPs in arterial blood compartment
AV                : 0  : mg, Amount of MPs in venous blood compartment
ARb               : 0  : mg, Amount of MPs in capillary blood of remaining tissues
ARt               : 0  : mg, Amount of MPs in remaining tissues compartment
ALub              : 0  : mg, Amount of MPs in capillary blood of lung
ALut              : 0  : mg, Amount of MPs in lung compartment
ALuRES            : 0  : mg, Amount of MPs in phagocytic cells of lung
ASb               : 0  : mg, Amount of MPs in capillary blood of spleen
ASt               : 0  : mg, Amount of MPs in spleen compartment
ASRES             : 0  : mg, Amount of MPs in phagocytic cells of spleen
ABRb              : 0  : mg, Amount of MPs in capillary blood of brain
ABRt              : 0  : mg, Amount of MPs in brain compartment
AGIb              : 0  : mg, Amount of MPs in capillary blood of GI
AGIt              : 0  : mg, Amount of MPs in GI tract
ALumen            : 0  : mg, Amount of MPs in GI tract lumen
ALb               : 0  : mg, Amount of MPs in capillary blood of liver
ALt               : 0  : mg, Amount of MPs in liver compartment
ALRES             : 0  : mg, Amount of MPs in phagocytic cells of liver
AKb               : 0  : mg, Amount of MPs in capillary blood of Kidney
AKt               : 0  : mg, Amount of MPs in Kidney
AKRES             : 0  : mg, Amount of NPs in phagocytic cells of Kidney
Aurine            : 0  : mg, Amount of MPs in urinary excretion
Abile             : 0  : mg, Amount of MPs in biliary excretion
Afeces            : 0  : mg, Amount of MPs in feces excretion
Adose             : 0  : mg, Amount of administrated MPs 
AUCB              : 0  : mg/L*h, AUC in blood
AUCLu             : 0  : mg/L*h, AUC in lung
AUCS              : 0  : mg/L*h, AUC in spleen
AUCRt             : 0  : mg/L*h, AUC in rest of tissue
AUCGI             : 0  : mg/L*h, AUC in GI tract
AUCL              : 0  : mg/L*h, AUC in liver
AUCK              : 0  : mg/L*h, AUC in kidney
AUCBR             : 0  : mg/L*h, AUC in brain

$ODE
// #+ Concentrations in the tissues (C) and in the venous plasma leaving each of the tissues (CV) (Unit: mg/L)
// #+ A:arterial blood; V: venous blood compartment; L: Liver; K: Kidney; S: Spleen; 
// #+ GI: GI tract; Lu: lung; BR: Brain; R: rest of tissues

double CA        = AA/(VB*0.2);
double CV        = AV/(VB*0.8);
double CVL       = ALb/VLb;
double CLt       = ALt/VLt;                    
double CVK       = AKb/VKb;
double CKt       = AKt/VKt;
double CVS       = ASb/VSb;
double CSt       = ASt/VSt;
double CVGI      = AGIb/VGIb;
double CGIt      = AGIt/VGIt;
double CVLu      = ALub/VLub;
double CLut      = ALut/VLut;
double CVBR      = ABRb/VBRb;
double CBRt      = ABRt/VBRt;
double CVR       = ARb/VRb; 
double CRt       = ARt/VRt;

// #+ Equation for estimation of the rate of each compartment
double RAA       = QC*CVLu*fu - QC*CA*fu;                                             
double RAV       = QL*CVL*fu + QK*CVK*fu + QR*CVR*fu + QBR*CVBR*fu - QC*CV*fu;
double RARb      = QR*(CA - CVR)*fu - PAR*CVR*fu + (PAR*CRt)/PR;
double RARt      = PAR*CVR*fu - (PAR*CRt)/PR;
double RALub     = QC*(CV - CVLu)*fu - PALu*CVLu*fu + (PALu*CLut)/PLu;
double RALut     = PALu*CVLu*fu - (PALu*CLut)/PLu- (KLuRESUP*ALut - KLuRESrelease*ALuRES);
double RALuRES   = KLuRESUP*ALut - KLuRESrelease*ALuRES;
double RASb      = QS*(CA-CVS)*fu - PAS*CVS*fu + (PAS*CSt)/PS;
double RASt      = PAS*CVS*fu - (PAS*CSt)/PS- KSRESUP*ASt + KSRESrelease*ASRES;
double RASRES    = KSRESUP*ASt-KSRESrelease*ASRES;
double RAGIb     = QGI*(CA-CVGI)*fu - PAGI*CVGI*fu + (PAGI*CGIt)/PGI + KGIb*ALumen;
double RAGIt     = PAGI*CVGI*fu - (PAGI*CGIt)/PGI;
double RALumen   = Kbile*CLt - (Kfeces + KGIb)*ALumen;
double RALb      = QL*(CA-CVL)*fu + QS*CVS*fu + QGI*CVGI*fu - PAL*CVL*fu + (PAL*CLt)/PL - KLRESUP*ALb + KLRESrelease*ALRES;
double RALt      = PAL*CVL*fu - (PAL*CLt)/PL - Kbile*CLt;
double RALRES    = KLRESUP*ALb - KLRESrelease*ALRES;
double RAKb      = QK*(CA-CVK)*fu - PAK*CVK*fu + (PAK*CKt)/PK - Kurine*CVK*fu;
double RAKt      = PAK*CVK*fu - (PAK*CKt)/PK- KKRESUP*AKt + KKRESrelease*AKRES;
double RAKRES    = KKRESUP*AKt-KKRESrelease*AKRES;
double RABRb     = QBR*(CA-CVBR)*fu - PABR*CVBR*fu + (PABR*CBRt)/PBR;
double RABRt     = PABR*CVBR*fu - (PABR*CBRt)/PBR;
double RAurine   = Kurine*CVK*fu;
double RAbile    = Kbile*CLt;
double RAfeces   = Kfeces*ALumen;

// #+ ODE equations for compartments in the male mice
dxdt_AA          = RAA;
dxdt_AV          = RAV;
dxdt_ARb         = RARb;
dxdt_ARt         = RARt;
dxdt_ALut        = RALut;
dxdt_ALub        = RALub;
dxdt_ALuRES      = RALuRES;
dxdt_ASb         = RASb;
dxdt_ASt         = RASt;
dxdt_ASRES       = RASRES;
dxdt_AGIb        = RAGIb;
dxdt_AGIt        = RAGIt;
dxdt_ALumen      = RALumen;
dxdt_ALb         = RALb;
dxdt_ALt         = RALt;
dxdt_ALRES       = RALRES;
dxdt_AKb         = RAKb;
dxdt_AKt         = RAKt;
dxdt_AKRES       = RAKRES;
dxdt_ABRb        = RABRb;
dxdt_ABRt        = RABRt;
dxdt_Aurine      = RAurine;
dxdt_Abile       = RAbile;
dxdt_Afeces      = RAfeces;

// #+ Total amount of MPs in tissues
double ABlood    = AA + AV;
double ALung     = ALut + ALub + ALuRES;
double ASpleen   = ASb + ASt + ASRES;
double ARest     = ARb + ARt;
double AGI       = AGIb + AGIt + ALumen;
double ALiver    = ALb + ALt + ALRES;
double AKidney   = AKb + AKt + AKRES;
double ABrain    = ABRb + ABRt;

// #+ AUC
dxdt_AUCB        = (AA + AV)/VB;
dxdt_AUCLu       = (ALut + ALub + ALuRES)/VLu;
dxdt_AUCS        = (ASb + ASt + ASRES)/VS;
dxdt_AUCRt       = (ARb + ARt)/VR;
dxdt_AUCGI       = (AGIb + AGIt + ALumen)/VGI;
dxdt_AUCL        = (ALb + ALt + ALRES)/VL;
dxdt_AUCK        = (AKb + AKt + AKRES)/VK;
dxdt_AUCBR       = (ABRb + ABRt)/VBR;

// #+ Mass Balance
double Tmass   = ABlood + ALung + AGI + ALiver + ASpleen + AKidney + ARest + ABrain + Aurine + Afeces;
//double BAL     = Adose - Tmass;

$TABLE
// #+ Total concentrations of MPs in Tissues
capture Blood     = ABlood/VB;
capture Lung      = ALung/VLu;
capture GI        = AGI/VGI;
capture Spleen    = ASpleen/VS;
capture Rest      = ARest/VR;
capture Liver     = ALiver/VL;
capture Kidney    = AKidney/VK;
capture Brain     = ABrain/VBR;
capture Urine     = Aurine;
capture Feces     = Afeces;
capture AUC_B     = AUCB;
capture AUC_Lu    = AUCLu;
capture AUC_S     = AUCS;
capture AUC_Rt    = AUCRt;
capture AUC_GI    = AUCGI;
capture AUC_L     = AUCL;
capture AUC_K     = AUCK;
capture AUC_BR    = AUCBR;
'


## Build mrgsolve-based PBPK Model
mod <- mcode ("MPsPBPK.code", PBPK.code)

print("phase 0 starting ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")

## Input data set for model calibration/ oral
# script_dir <- dirname(rstudioapi::getSourceEditorContext()$path)
# Set the working directory to the script's directory
# setwd(script_dir)

print("phase 1 starting ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")

######################################################################################################
Obs.KB220 <-read.csv("input data/KB220.csv")      # KB220 dataset: matrix: Blood (Unit: mg/kg)/Keinänen et al. (2021) 
names(Obs.KB220) = c("Time", "CBlood")

print("phase 2 starting ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")

Obs.KLu220 <-read.csv(file="input data/KLu220.csv")    # KLu220 dataset: matrix: Lung (Unit: mg/kg)/Keinänen et al. (2021) 
names(Obs.KLu220) = c("Time", "CLung")

Obs.KL220 <-read.csv(file="input data/KL220.csv")      # KL220 dataset: matrix: Liver (Unit: mg/kg)/Keinänen et al. (2021) 
names(Obs.KL220) = c("Time", "CLiver")

Obs.KS220 <-read.csv(file="input data/KS220.csv")      # KS220 dataset: matrix: Spleen (Unit: mg/kg)/Keinänen et al. (2021) 
names(Obs.KS220) = c("Time", "CSpleen")

Obs.KK220 <-read.csv(file="input data/KK220.csv")      # KK220 dataset: matrix: Kidney (Unit: mg/kg)/Keinänen et al. (2021) 
names(Obs.KK220) = c("Time", "CKidney")

Obs.KU220 <-read.csv(file="input data/KU220.csv")      # KU220 dataset: matrix: Urine (Unit: mg)/Keinänen et al. (2021) 
names(Obs.KU220) = c("Time", "AUrine")

Obs.KGI220 <-read.csv(file="input data/KGI220.csv")    # KGI220 dataset: matrix: GI tract (Unit: mg)/Keinänen et al. (2021) 
names(Obs.KGI220) = c("Time", "CGI")

Obs.KB20 <-read.csv(file="input data/KB20.csv")      # KB20 dataset: matrix: Blood (Unit: mg/kg)/Keinänen et al. (2021) 
names(Obs.KB20) = c("Time", "CBlood")

Obs.KLu20 <-read.csv(file="input data/KLu20.csv")    # KLu20 dataset: matrix: Lung (Unit: mg/kg)/Keinänen et al. (2021) 
names(Obs.KLu20) = c("Time", "CLung")

Obs.KL20 <-read.csv(file="input data/KL20.csv")      # KL20 dataset: matrix: Liver (Unit: mg/kg)/Keinänen et al. (2021) 
names(Obs.KL20) = c("Time", "CLiver")

Obs.KS20 <-read.csv(file="input data/KS20.csv")      # KS20 dataset: matrix: Spleen (Unit: mg/kg)/Keinänen et al. (2021) 
names(Obs.KS20) = c("Time", "CSpleen")

Obs.KK20 <-read.csv(file="input data/KK20.csv")      # KK20 dataset: matrix: Kidney (Unit: mg/kg)/Keinänen et al. (2021) 
names(Obs.KK20) = c("Time", "CKidney")

Obs.KU20 <-read.csv(file="input data/KU20.csv")      # KU20 dataset: matrix: Urine (Unit: mg)/Keinänen et al. (2021) 
names(Obs.KU20) = c("Time", "AUrine")

Obs.KGI20 <-read.csv(file="input data/KGI20.csv")    # KGI20 dataset: matrix: GI tract (Unit: mg)/Keinänen et al. (2021) 
names(Obs.KGI20) = c("Time", "CGI")

Obs.KS6 <-read.csv(file="input data/KS6.csv")     # KS6 dataset: Spleen 
names(Obs.KS6) = c("Time", "CSpleen")

Obs.KK6 <-read.csv(file="input data/KK6.csv")     # KK6 dataset: Kidney 
names(Obs.KK6) = c("Time", "CKidney")

Obs.KU6 <-read.csv(file="input data/KU6.csv")     # KU6 dataset: Urine 
names(Obs.KU6) = c("Time", "AUrine")

Obs.KB6 <-read.csv(file="input data/KB6.csv")     # KB6 dataset: Blood 
names(Obs.KB6) = c("Time", "CBlood")

Obs.KL6 <-read.csv(file="input data/KL6.csv")     # KL6 dataset: Liver  
names(Obs.KL6) = c("Time", "CLiver")

Obs.KLu6 <-read.csv(file="input data/KLu6.csv")   # KLu6 dataset: Lung  
names(Obs.KLu6) = c("Time", "CLung")

Obs.KGI6 <-read.csv(file="input data/KGI6.csv")   # KGI6 dataset: GI 
names(Obs.KGI6) = c("Time", "CGI")

Obs.KB1 <-read.csv(file="input data/KB1.csv")      # KB1 dataset: matrix: Blood (Unit: mg/kg)/Keinänen et al. (2021) 
names(Obs.KB1) = c("Time", "CBlood")

Obs.KLu1 <-read.csv(file="input data/KLu1.csv")    # KLu1 dataset: matrix: Lung (Unit: mg/kg)/Keinänen et al. (2021) 
names(Obs.KLu1) = c("Time", "CLung")

Obs.KL1 <-read.csv(file="input data/KL1.csv")      # KL1 dataset: matrix: Liver (Unit: mg/kg)/Keinänen et al. (2021) 
names(Obs.KL1) = c("Time", "CLiver")

Obs.KS1 <-read.csv(file="input data/KS1.csv")      # KS1 dataset: matrix: Spleen (Unit: mg/kg)/Keinänen et al. (2021) 
names(Obs.KS1) = c("Time", "CSpleen")

Obs.KK1 <-read.csv(file="input data/KK1.csv")      # KK1 dataset: matrix: Kidney (Unit: mg/kg)/Keinänen et al. (2021) 
names(Obs.KK1) = c("Time", "CKidney")

Obs.KU1 <-read.csv(file="input data/KU1.csv")      # KU1 dataset: matrix: Urine (Unit: mg)/Keinänen et al. (2021) 
names(Obs.KU1) = c("Time", "AUrine")

Obs.KGI1 <-read.csv(file="input data/KGI1.csv")    # KGI1 dataset: matrix: GI tract (Unit: mg)/Keinänen et al. (2021) 
names(Obs.KGI1) = c("Time", "CGI")

print("phase 3 starting ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")

######################################################################################
# Define the prediction function
## Define the prediction function (for least squares fit using levenberg-marquart algorithm)
pred <- function(pars, parDuration, parTreatment, parExposure) {
  
  ## Get out of log domain
  pars %<>% lapply(exp)                 ## return a list of exp (parameters) from log domain
  
  ## Define the event data sets (exposure scenario) [mrgsolve CH3.2]
  tinterval     = 24     # h
  End_time      = parDuration     # day
  
  ## Exposure scenario for Single dose at 0.1 mg
  TDOSE.K       = parTreatment      # Dosing frequency during exposure time
  DOSEoral.K    = parExposure   # mg
  ## Oral exposure route
  ex.K <- ev(ID = 1, amt = DOSEoral.K, ii = tinterval, addl = TDOSE.K-1, 
             cmt = "ALumen", replicate = FALSE) 
  
  ## set up the exposure time
  tsamp.K  = tgrid(0, tinterval*(TDOSE.K-1) + tinterval*End_time, 0.1)
  
  ## Get a prediction
  out.K <- 
    mod %>%                                               # model object
    param(pars) %>%                                       # to update the parameters in the model subject
    Req(Spleen, Kidney, Urine, Blood, Lung, Liver, GI, Brain, Rest, Feces)%>%                             # select model output
    update(atol = 1e-70, maxstep = 50000) %>%
    mrgsim_d(data = ex.K, tgrid = tsamp.K)
  out.K <-cbind.data.frame(Time     = out.K$time/24,     # day
                           CSpleen  = out.K$Spleen,
                           CKidney  = out.K$Kidney,
                           AUrine   = out.K$Urine,
                           CBlood   = out.K$Blood,
                           CLung    = out.K$Lung,
                           CLiver   = out.K$Liver,
                           CGI      = out.K$GI,
                           CBrain   = out.K$Brain,
                           CRest    = out.K$Rest,
                           AFeces   = out.K$Feces)
  
  return(list("out.K"=out.K))
}
#write.csv(df.simKS, file = "Fitting Spleen220_Kein.csv", row.names = FALSE)
#write.csv(df.simKK, file = "Fitting Kidney220_Kein.csv", row.names = FALSE)
#write.csv(df.simKU, file = "Fitting Urine220_Kein.csv", row.names = FALSE)
#write.csv(df.simKLu, file = "Fitting Lung220_Kein.csv", row.names = FALSE)
#write.csv(df.simKL, file = "Fitting Liver220_Kein.csv", row.names = FALSE)
#write.csv(df.simKB, file = "Fitting Blood220_Kein.csv", row.names = FALSE)
#write.csv(df.simKGI, file = "Fitting GI220_Kein.csv", row.names = FALSE)
#write.csv(df.simK, file = "Fitting All220_Kein.csv", row.names = FALSE)
######################################################################################
######################################################################################

#' @filter cors
cors <- function(req, res) {
  
  res$setHeader("Access-Control-Allow-Origin", "*")
  res$setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  if (req$REQUEST_METHOD == "OPTIONS") {
    res$setHeader("Access-Control-Allow-Methods","GET, POST, PUT, DELETE, OPTIONS")
    res$setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
    res$status <- 200 
    return(list())
  } else {
    plumber::forward()
  }
  
}

#* return the input
#* 
#* @get /patrol
function(messg = ""){
  list(messg = paste0("Hi I am listening '", messg, "'"))
}

#* Receive and print a JSON object
#* 
#* @json(digits = 12)
#* @post /model220
function(req) {
  # Get the JSON content from the request
  # print(req$body$BW)
  # print(req$body$scale)
  # print(req$body$concentration)
  # print(req$body$treatment)
  # print(req$body$duration)
  print('edddddddddddddddddddddddddddddddd23')
  
  if(!is.null(req$body$BW)){
    parBW = req$body$BW
  }
  
  if(!is.null(req$body$scale)){
    parScale = req$body$scale
  }
  
  if(!is.null(req$body$concentration)){
    parConcentration = req$body$concentration
  }
  
  if(!is.null(req$body$duration)){
    parDuration = req$body$duration
  }
  
  if(!is.null(req$body$treatment) && req$body$treatment=="double"){
    parTreatment = parDuration
  }
  else{
    parTreatment = 1
  }
  
  ## Cost function (FME) 
  ## Estimate the model residual by modCost function
  MCcost<-function (pars){
    out <- pred (pars)
    cost<- modCost  (model=out$out.K, obs= Obs.KS220, x="Time")
    cost<- modCost  (model=out$out.K, obs= Obs.KK220, x="Time", cost=cost)
    cost<- modCost  (model=out$out.K, obs= Obs.KU220, x="Time", cost=cost)
    cost<- modCost  (model=out$out.K, obs= Obs.KB220, x="Time", cost=cost)
    cost<- modCost  (model=out$out.K, obs= Obs.KL220, x="Time", cost=cost)
    cost<- modCost  (model=out$out.K, obs= Obs.KLu220, x="Time", cost=cost)
    cost<- modCost  (model=out$out.K, obs= Obs.KGI220, x="Time", cost=cost)
    return(cost)
  }
  
  # parDuration = parDuration,
  # parTreatment = parTreatment,
  # parConcentration = parConcentration,
  # parScale = parScale,
  
  #Fitting
  theta.final <- log(c(
    BW     = parBW,       # Body weight
    PLu    = 0.15,       # Partition coefficient     
    PL     = 0.0001,
    PK     = 0.155,
    PS     = 0.15,
    PGI    = 0.15,
    PBR    = 0.15,
    PR     = 0.15,
    PALuC  = 0.001,      # Membrane-limited permeability coefficient 
    PAGIC  = 0.001,
    PALC   = 0.0001,
    PAKC   = 0.01,
    PASC   = 0.002712,
    PABRC  = 0.000001,
    PARC   = 0.006863,
    KSRESrelease  = 0.004523,    #Release rate constant of phagocytic cells
    KLuRESrelease = 0.002,
    KKRESrelease  = 0.018,
    KLRESrelease  = 0.02,
    KSRESmax      = 7.21,        #Maximum uptake rate constant of phagocytic cells
    KLuRESmax     = 0.55, 
    KKRESmax      = 0.5, 
    KLRESmax      = 0.00790, 
    ASREScap      = 150,         #Uptake capacity per tissue weight 
    ALuREScap     = 89,
    AKREScap      = 330,
    ALREScap      = 195,
    KD            = 2880.663,   
    N             = 1,
    KGIb          = 4.052e-5,    #Absorption rate of GI tract (1/h)
    KbileC        = 0.00003,     #Biliary clearance (L/h/kg^0.75)
    Kfeces        = 0.535,       #Fecal clearance (L/h)
    KurineC       = 0.000309     #Urinary clearance (L/h/kg^0.75)
  ))
  Sim.fitK = pred(theta.final, parDuration, parTreatment, parConcentration)$out.K
  
  
  ## Calibration results
  df.simKS   = cbind.data.frame (Time=Sim.fitK$Time, CSpleen=Sim.fitK$CSpleen)
  df.simKK   = cbind.data.frame (Time=Sim.fitK$Time, CKidney=Sim.fitK$CKidney)
  df.simKU   = cbind.data.frame (Time=Sim.fitK$Time, AUrine=Sim.fitK$AUrine)
  df.simKL   = cbind.data.frame (Time=Sim.fitK$Time, CLiver=Sim.fitK$CLiver)
  df.simKLu  = cbind.data.frame (Time=Sim.fitK$Time, CLung =Sim.fitK$CLung)
  df.simKB   = cbind.data.frame (Time=Sim.fitK$Time, CBlood=Sim.fitK$CBlood)
  df.simKGI  = cbind.data.frame (Time=Sim.fitK$Time, CGI=Sim.fitK$CGI)
  df.simK    = cbind.data.frame (Time=Sim.fitK$Time, 
                                 CBrain=Sim.fitK$CBrain, 
                                 CRest =Sim.fitK$CRest,
                                 AFeces=Sim.fitK$AFeces)
  
  # print(df.simKL)
  
  
  data_list <- list(
    df_simKS = df.simKS,
    Obs_KS = Obs.KS220,
    df_simKK = df.simKK,
    Obs_KK = Obs.KK220,
    df_simKU = df.simKU,
    Obs_KU = Obs.KU220,
    df_simKB = df.simKB,
    Obs_KB = Obs.KB220,
    df_simKL = df.simKL,
    Obs_KL = Obs.KL220,
    df_simKLu = df.simKLu,
    Obs_KLu = Obs.KLu220,
    df_simKGI = df.simKGI,
    Obs_KGI = Obs.KGI220
  )
  
  # Convert each dataframe in the list to a list itself for JSON compatibility
  data_list <- lapply(data_list, function(df) as.list(df))
  
  # Create a response object (Note: Plumber automatically converts lists to JSON)
  response <- list(
    message = "220 Data",
    data = data_list
  )
  # print(response)
  return(response)
  
}

##################################################################################

#* Receive and print a JSON object
#* 
#* @json(digits = 12)
#* @post /model20
function(req) {
  
  # Get the JSON content from the request
  #print(req$body)
  print('edddddddddddddddddddddddddddddddd23')
  if(!is.null(req$body$BW)){
    parBW = req$body$BW
  }
  
  if(!is.null(req$body$scale)){
    parScale = req$body$scale
  }
  
  if(!is.null(req$body$concentration)){
    parConcentration = req$body$concentration
  }
  
  if(!is.null(req$body$duration)){
    parDuration = req$body$duration
  }
  
  if(!is.null(req$body$treatment) && req$body$treatment=="double"){
    parTreatment = parDuration
  }
  else{
    parTreatment = 1
  }
  
  ## Cost function (FME) 
  ## Estimate the model residual by modCost function
  ## Cost function (FME) 
  ## Estimate the model residual by modCost function
  MCcost<-function (pars){
    out <- pred (pars)
    cost<- modCost  (model=out$out.K, obs= Obs.KS20, x="Time")
    cost<- modCost  (model=out$out.K, obs= Obs.KK20, x="Time", cost=cost)
    cost<- modCost  (model=out$out.K, obs= Obs.KU20, x="Time", cost=cost)
    cost<- modCost  (model=out$out.K, obs= Obs.KB20, x="Time", cost=cost)
    cost<- modCost  (model=out$out.K, obs= Obs.KL20, x="Time", cost=cost)
    cost<- modCost  (model=out$out.K, obs= Obs.KLu20, x="Time", cost=cost)
    cost<- modCost  (model=out$out.K, obs= Obs.KGI20, x="Time", cost=cost)
    return(cost)
  }
  
  #Fitting
  theta.final <- log(c(
    BW     = 0.02,       # Body weight
    PLu    = 0.15,       # Partition coefficient     
    PL     = 0.0001,
    PK     = 0.15,
    PS     = 0.15,
    PGI    = 0.15,
    PBR    = 0.15,
    PR     = 0.15,
    PALuC  = 0.001,      # Membrane-limited permeability coefficient 
    PAGIC  = 0.001,
    PALC   = 0.001,
    PAKC   = 0.001,
    PASC   = 0.001,
    PABRC  = 0.000001,
    PARC   = 0.001,
    KSRESrelease  = 0.09,      # Release rate constant of phagocytic cells
    KLuRESrelease = 0.002,
    KKRESrelease  = 0.0075,
    KLRESrelease  = 0.02,
    KSRESmax      = 10,        # Maximum uptake rate constant of phagocytic cells
    KLuRESmax     = 0.09287, 
    KKRESmax      = 0.2, 
    KLRESmax      = 0.001, 
    ASREScap      = 150,       # Uptake capacity per tissue weight 
    ALuREScap     = 89,
    AKREScap      = 330,
    ALREScap      = 195,
    KD            = 136.15,   
    N             = 1.3,
    KGIb          = 4.226e-5,    # Absorption rate of GI tract (1/h)
    KbileC        = 0.00003,     # Biliary clearance (L/h/kg^0.75)
    Kfeces        = 0.54765,     # Fecal clearance (L/h)
    KurineC       = 0.0001       # Urinary clearance (L/h/kg^0.75)
  ))
  Sim.fitK = pred(theta.final, parDuration, parTreatment, parConcentration)$out.K
  
  ## Model calibration plot using ggplot2 
  ## Calibration results of exposure scenario K
  df.simKS   = cbind.data.frame (Time=Sim.fitK$Time, CSpleen=Sim.fitK$CSpleen)
  df.simKK   = cbind.data.frame (Time=Sim.fitK$Time, CKidney=Sim.fitK$CKidney)
  df.simKU   = cbind.data.frame (Time=Sim.fitK$Time, AUrine=Sim.fitK$AUrine)
  df.simKL   = cbind.data.frame (Time=Sim.fitK$Time, CLiver=Sim.fitK$CLiver)
  df.simKLu  = cbind.data.frame (Time=Sim.fitK$Time, CLung =Sim.fitK$CLung)
  df.simKB   = cbind.data.frame (Time=Sim.fitK$Time, CBlood=Sim.fitK$CBlood)
  df.simKGI  = cbind.data.frame (Time=Sim.fitK$Time, CGI=Sim.fitK$CGI)
  df.simK    = cbind.data.frame (Time=Sim.fitK$Time, 
                                 CBrain=Sim.fitK$CBrain, 
                                 CRest =Sim.fitK$CRest,
                                 AFeces=Sim.fitK$AFeces)
  
  data_list <- list(
    df_simKS = df.simKS,
    Obs_KS = Obs.KS20,
    df_simKK = df.simKK,
    Obs_KK = Obs.KK20,
    df_simKU = df.simKU,
    Obs_KU = Obs.KU20,
    df_simKB = df.simKB,
    Obs_KB = Obs.KB20,
    df_simKL = df.simKL,
    Obs_KL = Obs.KL20,
    df_simKLu = df.simKLu,
    Obs_KLu = Obs.KLu20,
    df_simKGI = df.simKGI,
    Obs_KGI = Obs.KGI20
  )
  
  # Convert each dataframe in the list to a list itself for JSON compatibility
  data_list <- lapply(data_list, function(df) as.list(df))
  
  # Create a response object (Note: Plumber automatically converts lists to JSON)
  response <- list(
    message = "20 Data",
    data = data_list
  )
  # print(response)
  return(response)
}

##################################################################################

#* Receive and print a JSON object
#* 
#* @json(digits = 12)
#* @post /model6
function(req) {
  # Get the JSON content from the request
  #print(req$body)
  print('edddddddddddddddddddddddddddddddd23')
  if(!is.null(req$body$BW)){
    parBW = req$body$BW
  }
  
  if(!is.null(req$body$scale)){
    parScale = req$body$scale
  }
  
  if(!is.null(req$body$concentration)){
    parConcentration = req$body$concentration
  }
  
  if(!is.null(req$body$duration)){
    parDuration = req$body$duration
  }
  
  if(!is.null(req$body$treatment) && req$body$treatment=="double"){
    parTreatment = parDuration
  }
  else{
    parTreatment = 1
  }
  
  ## Cost function (FME) 
  ## Estimate the model residual by modCost function
  MCcost<-function (pars){
    out <- pred (pars)
    cost<- modCost  (model=out$out.K, obs= Obs.KS6, x="Time")
    cost<- modCost  (model=out$out.K, obs= Obs.KK6, x="Time", cost=cost)
    cost<- modCost  (model=out$out.K, obs= Obs.KU6, x="Time", cost=cost)
    cost<- modCost  (model=out$out.K, obs= Obs.KL6, x="Time", cost=cost)
    cost<- modCost  (model=out$out.K, obs= Obs.KLu6, x="Time", cost=cost)
    cost<- modCost  (model=out$out.K, obs= Obs.KGI6, x="Time", cost=cost)
    cost<- modCost  (model=out$out.K, obs= Obs.KB6, x="Time", cost=cost)
    return(cost)
  }
  
  #Fitting
  theta.final <- log(c(
    BW     = 0.02,       # Body weight
    PLu    = 0.15,       # Partition coefficient     
    PL     = 0.0001,
    PK     = 0.15,
    PS     = 0.15,
    PGI    = 0.15,
    PBR    = 0.15,
    PR     = 0.15,
    PALuC  = 0.001,      # Membrane-limited permeability coefficient 
    PAGIC  = 0.001,
    PALC   = 0.0001,
    PAKC   = 0.00314,
    PASC   = 0.003117,
    PABRC  = 0.000001,
    PARC   = 0.0045,
    KSRESrelease  = 0.001,      #Release rate constant of phagocytic cells: all equal to 0.001
    KLuRESrelease = 0.001,
    KKRESrelease  = 0.001,
    KLRESrelease  = 0.001,
    KSRESmax      = 30.0325,    #Maximum uptake rate constant of phagocytic cells
    KLuRESmax     = 0.56, 
    KKRESmax      = 0.71877, 
    KLRESmax      = 0.006376, 
    ASREScap      = 150,        #Uptake capacity per tissue weight 
    ALuREScap     = 89,
    AKREScap      = 330,
    ALREScap      = 195,
    KD            = 3108.786,   
    N             = 1,
    KGIb          = 5.099e-5,    #Absorption rate of GI tract (1/h)
    KbileC        = 0.00003,     #Biliary clearance (L/h/kg^0.75)
    Kfeces        = 0.50814,     #Fecal clearance (L/h)
    KurineC       = 0.000328     #Urinary clearance (L/h/kg^0.75)
  ))
  Sim.fitK = pred(theta.final, parDuration, parTreatment, parConcentration)$out.K         ## Simulation of exposure scenario K
  
  ## Model calibration results
  df.simKS  = cbind.data.frame (Time=Sim.fitK$Time, CSpleen=Sim.fitK$CSpleen)
  df.simKK  = cbind.data.frame (Time=Sim.fitK$Time, CKidney=Sim.fitK$CKidney)
  df.simKU  = cbind.data.frame (Time=Sim.fitK$Time, AUrine=Sim.fitK$AUrine)
  df.simKL  = cbind.data.frame (Time=Sim.fitK$Time, CLiver=Sim.fitK$CLiver)
  df.simKB  = cbind.data.frame (Time=Sim.fitK$Time, CBlood=Sim.fitK$CBlood)
  df.simKLu = cbind.data.frame (Time=Sim.fitK$Time, CLung=Sim.fitK$CLung)
  df.simKGI = cbind.data.frame (Time=Sim.fitK$Time, CGI=Sim.fitK$CGI)
  df.simK   = cbind.data.frame (Time=Sim.fitK$Time, 
                                CBrain=Sim.fitK$CBrain, 
                                CRest =Sim.fitK$CRest,
                                AFeces=Sim.fitK$AFeces)
  
  
  data_list <- list(
    df_simKS = df.simKS,
    Obs_KS = Obs.KS6,
    df_simKK = df.simKK,
    Obs_KK = Obs.KK6,
    df_simKU = df.simKU,
    Obs_KU = Obs.KU6,
    df_simKB = df.simKB,
    Obs_KB = Obs.KB6,
    df_simKL = df.simKL,
    Obs_KL = Obs.KL6,
    df_simKLu = df.simKLu,
    Obs_KLu = Obs.KLu6,
    df_simKGI = df.simKGI,
    Obs_KGI = Obs.KGI6
  )
  
  # Convert each dataframe in the list to a list itself for JSON compatibility
  data_list <- lapply(data_list, function(df) as.list(df))
  
  # Create a response object (Note: Plumber automatically converts lists to JSON)
  response <- list(
    message = "6 Data",
    data = data_list
  )
  # print(response)
  return(response)
}

##################################################################################

#* Receive and print a JSON object
#* 
#* @json(digits = 12)
#* @post /model1
function(req) {
  # Get the JSON content from the request
  #print(req$body)
  print('edddddddddddddddddddddddddddddddd23')
  if(!is.null(req$body$BW)){
    parBW = req$body$BW
  }
  
  if(!is.null(req$body$scale)){
    parScale = req$body$scale
  }
  
  if(!is.null(req$body$concentration)){
    parConcentration = req$body$concentration
  }
  
  if(!is.null(req$body$duration)){
    parDuration = req$body$duration
  }
  
  if(!is.null(req$body$treatment) && req$body$treatment=="double"){
    parTreatment = parDuration
  }
  else{
    parTreatment = 1
  }
  
  ## Cost function (FME) 
  ## Estimate the model residual by modCost function
  MCcost<-function (pars){
    out <- pred (pars)
    cost<- modCost  (model=out$out.K, obs= Obs.KS1, x="Time")
    cost<- modCost  (model=out$out.K, obs= Obs.KK1, x="Time", cost=cost)
    cost<- modCost  (model=out$out.K, obs= Obs.KU1, x="Time", cost=cost)
    cost<- modCost  (model=out$out.K, obs= Obs.KB1, x="Time", cost=cost)
    cost<- modCost  (model=out$out.K, obs= Obs.KL1, x="Time", cost=cost)
    cost<- modCost  (model=out$out.K, obs= Obs.KLu1, x="Time", cost=cost)
    cost<- modCost  (model=out$out.K, obs= Obs.KGI1, x="Time", cost=cost)
    return(cost)
  }
  
  #Fitting
  theta.final <- log(c(
    BW     = 0.02,       # Body weight
    PLu    = 0.15,       # Partition coefficient     
    PL     = 0.0001,
    PK     = 0.15,
    PS     = 0.15,
    PGI    = 0.15,
    PBR    = 0.15,
    PR     = 0.15,
    PALuC  = 0.001,      # Membrane-limited permeability coefficient 
    PAGIC  = 0.001,
    PALC   = 0.0001,
    PAKC   = 0.001,
    PASC   = 0.00216,
    PABRC  = 0.000001,
    PARC   = 0.004026,
    KSRESrelease  = 0.002937,    #Release rate constant of phagocytic cells: all equal to 0.001
    KLuRESrelease = 0.002,
    KKRESrelease  = 0.0075,
    KLRESrelease  = 0.02,
    KSRESmax      = 19.56,       #Maximum uptake rate constant of phagocytic cells
    KLuRESmax     = 0.30275, 
    KKRESmax      = 0.5, 
    KLRESmax      = 0.001, 
    ASREScap      = 150,         #Uptake capacity per tissue weight 
    ALuREScap     = 100,
    AKREScap      = 330,
    ALREScap      = 195,
    KD            = 3040.88,   
    N             = 1,
    KGIb          = 4.162e-5,    #Absorption rate of GI tract (1/h)
    KbileC        = 0.00003,     #Biliary clearance (L/h/kg^0.75)
    Kfeces        = 0.5045,      #Fecal clearance (L/h)
    KurineC       = 0.000397     #Urinary clearance (L/h/kg^0.75)
  ))
  Sim.fitK = pred(theta.final, parDuration, parTreatment, parConcentration)$out.K
  
  ## Model calibration plot using ggplot2 
  ## Calibration results of exposure scenario K
  df.simKS   = cbind.data.frame (Time=Sim.fitK$Time, CSpleen=Sim.fitK$CSpleen)
  df.simKK   = cbind.data.frame (Time=Sim.fitK$Time, CKidney=Sim.fitK$CKidney)
  df.simKU   = cbind.data.frame (Time=Sim.fitK$Time, AUrine=Sim.fitK$AUrine)
  df.simKL   = cbind.data.frame (Time=Sim.fitK$Time, CLiver=Sim.fitK$CLiver)
  df.simKLu  = cbind.data.frame (Time=Sim.fitK$Time, CLung =Sim.fitK$CLung)
  df.simKB   = cbind.data.frame (Time=Sim.fitK$Time, CBlood=Sim.fitK$CBlood)
  df.simKGI  = cbind.data.frame (Time=Sim.fitK$Time, CGI=Sim.fitK$CGI)
  df.simK    = cbind.data.frame (Time=Sim.fitK$Time, 
                                 CBrain=Sim.fitK$CBrain, 
                                 CRest =Sim.fitK$CRest,
                                 AFeces=Sim.fitK$AFeces)
  
  
  data_list <- list(
    df_simKS = df.simKS,
    Obs_KS = Obs.KS1,
    df_simKK = df.simKK,
    Obs_KK = Obs.KK1,
    df_simKU = df.simKU,
    Obs_KU = Obs.KU1,
    df_simKB = df.simKB,
    Obs_KB = Obs.KB1,
    df_simKL = df.simKL,
    Obs_KL = Obs.KL1,
    df_simKLu = df.simKLu,
    Obs_KLu = Obs.KLu1,
    df_simKGI = df.simKGI,
    Obs_KGI = Obs.KGI1
  )
  
  # Convert each dataframe in the list to a list itself for JSON compatibility
  data_list <- lapply(data_list, function(df) as.list(df))
  
  # Create a response object (Note: Plumber automatically converts lists to JSON)
  response <- list(
    message = "1 Data",
    data = data_list
  )
  # print(response)
  return(response)
}