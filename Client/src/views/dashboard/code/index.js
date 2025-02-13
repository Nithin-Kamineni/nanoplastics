import React, { useState, useEffect } from 'react';
import {
    Typography,
    Button,
    CircularProgress,
    LinearProgress,
    Box,
    Table,
    TableContainer,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Paper,
    IconButton
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Papa from 'papaparse';
import { useDispatch, useSelector } from 'store';
import { predictHalfLife, resetPredictionData } from 'store/slices/fileinputpredictionSlice';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import {
    ChakraProvider,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Select
} from '@chakra-ui/react';
import { Card, CardHeader, CardBody, Row, Col } from 'reactstrap';
import { CopyBlock, dracula } from 'react-code-blocks';

// ==============================|| SAMPLE PAGE ||============================== //

const codetext = `
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
PLu    : 0.15      : Unitless, Partition coefficient of Lung     ; Lin et al., 2016, Table 1, 100 nm
PGI    : 0.15      : Unitless, Partition coefficient of GI       ; Lin et al., 2016
PL     : 0.08      : Unitless, Partition coefficient of Liver    ; Lin et al., 2016
PK     : 0.15      : Unitless, Partition coefficient of Kidney   ; Lin et al., 2016
PS     : 0.15      : Unitless, Partition coefficient of Spleen   ; Lin et al., 2016
PBR    : 0.15      : Unitless, Partition coefficient of Brain    ; Lin et al., 2016
PR     : 0.15      : Unitless, Partition coefficient of Rest of body; Lin et al., 2016

// #+ Membrane-limited permeability
PALuC  : 0.001     : Unitless, Membrane-limited permeability coefficient of Lung         ; Lin et al., 2016, Table 1, 100 nm
PAGIC  : 0.001     : Unitless, Membrane-limited permeability coefficient of GI           ; Lin et al., 2016
PALC   : 0.001     : Unitless, Membrane-limited permeability coefficient of Liver        ; Lin et al., 2016
PAKC   : 0.001     : Unitless, Membrane-limited permeability coefficient of Kidney       ; Lin et al., 2016 
PASC   : 0.001     : Unitless, Membrane-limited permeability coefficient of Spleen       ; Lin et al., 2016
PABRC  : 0.000001  : Unitless, Membrane-limited permeability coefficient of Brain        ; Lin et al., 2016
PARC   : 0.000001  : Unitless, Membrane-limited permeability coefficient of Rest of body ; Lin et al., 2016

// #+ Endocytic parameters in spleen; Chou et al., 2023_Table S2
KSRESrelease       : 0.003    : 1/h,      Release rate constant of phagocytic cells; Lin et al., 2016
KSRESmax           : 10       : 1/h,      Maximum uptake rate constant of phagocytic cells; Lin et al., 2016
ASREScap           : 200      : ug/g,     tissue, Uptake capacity per tissue weight

// #+ Endocytic parameters in lung
KLuRESrelease     : 0.005     : 1/h,      Release rate constant of phagocytic cells; Lin et al., 2016
KLuRESmax         : 0.1       : 1/h,      Maximum uptake rate constant of phagocytic cells; Lin et al., 2016
ALuREScap         : 15        : ug/g,     tissue, Uptake capacity per tissue weight

// #+ Endocytic parameters in kidney
KKRESrelease       : 0.01     : 1/h,      Release rate constant of phagocytic cells; Lin et al., 2016
KKRESmax           : 0.1      : 1/h,      Maximum uptake rate constant of phagocytic cells; Lin et al., 2016
AKREScap           : 15       : ug/g,     tissue, Uptake capacity per tissue weight

// #+ Endocytic parameters in liver
KLRESrelease       : 0.0075   : 1/h,      Release rate constant of phagocytic cells; Lin et al., 2016 
KLRESmax           : 4        : 1/h,      Maximum uptake rate constant of phagocytic cells; Lin et al., 2016
ALREScap           : 100      : ug/g,     tissue, Uptake capacity per tissue weight 

// #+ Uptake and elimination parameters
KGIb               : 6e-5      : 1/h, Absorption rate of GI tract
Kfeces             : 0.53      : 1/h, Fecal clearance
KbileC             : 0.0012    : L/h/kg^0.75, Biliary clearance; Lin et al., 2016
KurineC            : 0.00012   : L/h/kg^0.75, Urinary clearance; Lin et al., 2016

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
`;

const FileInputPage = () => {
    const dispatch = useDispatch();

    return (
        <ChakraProvider>
            <MainCard title="Code">
                <div className="content">
                    <Row>
                        <Col md="12">
                            <Card className="card-plain">
                                <CardBody>
                                    <div
                                        id="map"
                                        // className="map"
                                        style={{ position: 'relative', overflow: 'hidden' }}
                                    >
                                        <CopyBlock
                                            language="R"
                                            text={codetext}
                                            // showLineNumbers={true}
                                            theme={dracula}
                                            // wrapLines={true}
                                            codeBlock
                                        />
                                        <br />
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </MainCard>
        </ChakraProvider>
    );
};

export default FileInputPage;
