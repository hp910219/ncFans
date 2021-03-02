import React from 'react';
import { Collapse, Icon, Alert, Tooltip, Tag} from 'antd';
import JYModel from './utils/JYModel';
import {
  jy_form_item, jy_tip,
  get_args,
  post_task,
  string2array, down_file
} from '@/pages/utils/request';
import Button from "antd/lib/button/button";
import Form from "antd/es/form/Form";
const action_name = 'ncFANs-eLnc';
const {Panel} = Collapse;
const getELNcSpecies = ()=>{
  let text = 'Species\tBioSample_Type\tBioSample_Term\n' +
    'Human\tCell\tNeuroblatoma_cell_line\n' +
    'Human\tCell\tResting_Treg\n' +
    'Human\tCell\tneural_crest_line\n' +
    'Human\tCell\tNeuroblastoma_cell\n' +
    'Human\tCell\tTh2\n' +
    'Human\tCell\tMelanoma_Cell\n' +
    'Human\tCell\tT_Lymphocyte\n' +
    'Human\tCell\tHepatocyte\n' +
    'Human\tCell\tMacrophage\n' +
    'Human\tCell\tMyoblast\n' +
    'Human\tCell\tInferior_Temporal_Lobe_Cell\n' +
    'Human\tCell\tLeukemia\n' +
    'Human\tCell\tMesenchymal_Stem_Cell\n' +
    'Human\tCell\tNeurosphere\n' +
    'Human\tCell\tSpermatid\n' +
    'Human\tCell\tbladder_cancer_cell_line_J82\n' +
    'Human\tCell\tFibroblast\n' +
    'Human\tCell\tHippocampus_Middle_Cell\n' +
    'Human\tCell\tMelanocyte\n' +
    'Human\tCell\tEndothelial_Cell\n' +
    'Human\tCell\tNeuroectoderm\n' +
    'Human\tCell\trhabdomyosarcoma\n' +
    'Human\tCell\tPatient_derived_xenograft_cells\n' +
    'Human\tCell\tType_1_innate_lymphoid_cells\n' +
    'Human\tCell\tErythroid_Progenitor_Cell\n' +
    'Human\tCell\tProerythroblast\n' +
    'Human\tCell\tcancer_cells\n' +
    'Human\tCell\tNeural_crest_cell\n' +
    'Human\tCell\tHematopoietic_Stem_Cell\n' +
    'Human\tCell\tNatural_Killer_Cell\n' +
    'Human\tCell\tFree_cell\n' +
    'Human\tCell\tAstrocyte\n' +
    'Human\tCell\tMonocyte\n' +
    'Human\tCell\tNeuron\n' +
    'Human\tCell\thTERT_immortalized_endometriosis_cells\n' +
    'Human\tCell\tSmooth_Muscle_Cell\n' +
    'Human\tCell\tMelanocytic_cell\n' +
    'Human\tCell\tGlial_Cell\n' +
    'Human\tCell\tB_cell_precursor\n' +
    'Human\tCell\tHaematopoietic_Progenitor_Cell\n' +
    'Human\tCell\tEndoderm_Cell\n' +
    'Human\tCell\tStromal_Cell\n' +
    'Human\tCell\tNeuroblastoma_patient_cells\n' +
    'Human\tCell\tProgenitor_Cells\n' +
    'Human\tCell\tPlasma_Cell\n' +
    'Human\tCell\tNeural_Progenitor_Cell\n' +
    'Human\tCell\tCardiomyocyte\n' +
    'Human\tCell\tRetinal_pigment_cell\n' +
    'Human\tCell\tType_3_innate_lympoid_cell\n' +
    'Human\tCell\tBlast_Cells\n' +
    'Human\tCell\tLeukemia_Cell\n' +
    'Human\tCell\tosteosarcoma\n' +
    'Human\tCell\tOsteoblast\n' +
    'Human\tCell\tEpithelium\n' +
    'Human\tCell\tIntermediate\n' +
    'Human\tCell\tDendritic_Cell\n' +
    'Human\tCell\tiPSC\n' +
    'Human\tCell\tSubstantia_Nigra_Cell\n' +
    'Human\tCell\tEmbryonic_Stem_Cell\n' +
    'Human\tCell\tEwing_sacroma\n' +
    'Human\tCell\tGlioblastoma\n' +
    'Human\tCell\tHematopoietic_stem_and_progenitor_cell\n' +
    'Human\tCell\tNeutrophil_cell\n' +
    'Human\tCell\tB_Lymphocyte\n' +
    'Human\tCell\tCortex\n' +
    'Human\tCell\tPlasmablast\n' +
    'Human\tCell\tKeratinocyte\n' +
    'Human\tCell\tActivated_Treg\n' +
    'Human\tCell\tLymphoblastoid\n' +
    'Human\tCell\tTh1\n' +
    'Human\tCell\tAdipocyte\n' +
    'Human\tCell\tNeural_Stem_Cell\n' +
    'Human\tCell\tErythroblast\n' +
    'Human\tCell\tStem_cell\n' +
    'Human\tCell\tTh17\n' +
    'Human\tCell\t697\n' +
    'Human\tCell\t5637\n' +
    'Human\tCell\t7250\n' +
    'Human\tCell\t1015c\n' +
    'Human\tCell\t143B\n' +
    'Human\tCell\t293T\n' +
    'Human\tCell\t293T-Rex\n' +
    'Human\tCell\t501-Mel\n' +
    'Human\tCell\t76NF2V\n' +
    'Human\tCell\t786-O\n' +
    'Human\tCell\t90-8TL\n' +
    'Human\tCell\tA375\n' +
    'Human\tCell\tA-498\n' +
    'Human\tCell\tA549\n' +
    'Human\tCell\tA673\n' +
    'Human\tCell\tAG04450\n' +
    'Human\tCell\tAGS\n' +
    'Human\tCell\tALL-SIL\n' +
    'Human\tCell\tATL-2\n' +
    'Human\tCell\tBE2-C\n' +
    'Human\tCell\tBG01\n' +
    'Human\tCell\tBHY\n' +
    'Human\tCell\tBICR16\n' +
    'Human\tCell\tBICR31\n' +
    'Human\tCell\tBICR6\n' +
    'Human\tCell\tBJ\n' +
    'Human\tCell\tBJEL\n' +
    'Human\tCell\tBJELM\n' +
    'Human\tCell\tBT-16\n' +
    'Human\tCell\tBT-549\n' +
    'Human\tCell\tC4-2B\n' +
    'Human\tCell\tC6661\n' +
    'Human\tCell\tCaco-2\n' +
    'Human\tCell\tCAL33\n' +
    'Human\tCell\tCAL51-MCF7\n' +
    'Human\tCell\tCalu-3\n' +
    'Human\tCell\tCapan-1\n' +
    'Human\tCell\tCCRF-CEM\n' +
    'Human\tCell\tCFPAC-1\n' +
    'Human\tCell\tCHL-1\n' +
    'Human\tCell\tCHP-134\n' +
    'Human\tCell\tCHP-212\n' +
    'Human\tCell\tCJM\n' +
    'Human\tCell\tCLB-Ga\n' +
    'Human\tCell\tCLB-Pe\n' +
    'Human\tCell\tCOLO_679\n' +
    'Human\tCell\tCOLO-205\n' +
    'Human\tCell\tCOLO-320\n' +
    'Human\tCell\tCOLO-741\n' +
    'Human\tCell\tCTR\n' +
    'Human\tCell\tCUTLL1\n' +
    'Human\tCell\tCyT49\n' +
    'Human\tCell\tD283 Med\n' +
    'Human\tCell\tD-341\n' +
    'Human\tCell\tDetroit562\n' +
    'Human\tCell\tDKO1\n' +
    'Human\tCell\tDL23\n' +
    'Human\tCell\tDLD-1\n' +
    'Human\tCell\tDND-41\n' +
    'Human\tCell\tDU145\n' +
    'Human\tCell\tDU-528\n' +
    'Human\tCell\tEBC-1\n' +
    'Human\tCell\tEEC16\n' +
    'Human\tCell\tFT246\n' +
    'Human\tCell\tFT33\n' +
    'Human\tCell\tFU97\n' +
    'Human\tCell\tG-401\n' +
    'Human\tCell\tGI-CA-N\n' +
    'Human\tCell\tGI-ME-N\n' +
    'Human\tCell\tGLC-16\n' +
    'Human\tCell\tGM06990\n' +
    'Human\tCell\tGM10847\n' +
    'Human\tCell\tGM12878\n' +
    'Human\tCell\tGM12890\n' +
    'Human\tCell\tGM12891\n' +
    'Human\tCell\tGM12892\n' +
    'Human\tCell\tGM17942\n' +
    'Human\tCell\tGM18486\n' +
    'Human\tCell\tGM18498\n' +
    'Human\tCell\tGM18499\n' +
    'Human\tCell\tGM18501\n' +
    'Human\tCell\tGM18502\n' +
    'Human\tCell\tGM18504\n' +
    'Human\tCell\tGM18505\n' +
    'Human\tCell\tGM18507\n' +
    'Human\tCell\tGM18508\n' +
    'Human\tCell\tGM18510\n' +
    'Human\tCell\tGM18511\n' +
    'Human\tCell\tGM18516\n' +
    'Human\tCell\tGM18517\n' +
    'Human\tCell\tGM18519\n' +
    'Human\tCell\tGM18520\n' +
    'Human\tCell\tGM18522\n' +
    'Human\tCell\tGM18526\n' +
    'Human\tCell\tGM18852\n' +
    'Human\tCell\tGM18853\n' +
    'Human\tCell\tGM18855\n' +
    'Human\tCell\tGM18856\n' +
    'Human\tCell\tGM18858\n' +
    'Human\tCell\tGM18859\n' +
    'Human\tCell\tGM18861\n' +
    'Human\tCell\tGM18862\n' +
    'Human\tCell\tGM18870\n' +
    'Human\tCell\tGM18907\n' +
    'Human\tCell\tGM18909\n' +
    'Human\tCell\tGM18912\n' +
    'Human\tCell\tGM18913\n' +
    'Human\tCell\tGM18916\n' +
    'Human\tCell\tGM18951\n' +
    'Human\tCell\tGM19092\n' +
    'Human\tCell\tGM19093\n' +
    'Human\tCell\tGM19098\n' +
    'Human\tCell\tGM19099\n' +
    'Human\tCell\tGM19101\n' +
    'Human\tCell\tGM19114\n' +
    'Human\tCell\tGM19116\n' +
    'Human\tCell\tGM19119\n' +
    'Human\tCell\tGM19127\n' +
    'Human\tCell\tGM19130\n' +
    'Human\tCell\tGM19131\n' +
    'Human\tCell\tGM19137\n' +
    'Human\tCell\tGM19138\n' +
    'Human\tCell\tGM19140\n' +
    'Human\tCell\tGM19141\n' +
    'Human\tCell\tGM19143\n' +
    'Human\tCell\tGM19144\n' +
    'Human\tCell\tGM19147\n' +
    'Human\tCell\tGM19152\n' +
    'Human\tCell\tGM19153\n' +
    'Human\tCell\tGM19159\n' +
    'Human\tCell\tGM19160\n' +
    'Human\tCell\tGM19171\n' +
    'Human\tCell\tGM19190\n' +
    'Human\tCell\tGM19193\n' +
    'Human\tCell\tGM19200\n' +
    'Human\tCell\tGM19201\n' +
    'Human\tCell\tGM19203\n' +
    'Human\tCell\tGM19204\n' +
    'Human\tCell\tGM19206\n' +
    'Human\tCell\tGM19207\n' +
    'Human\tCell\tGM19209\n' +
    'Human\tCell\tGM19210\n' +
    'Human\tCell\tGM19222\n' +
    'Human\tCell\tGM19223\n' +
    'Human\tCell\tGM19225\n' +
    'Human\tCell\tGM19238\n' +
    'Human\tCell\tGM19239\n' +
    'Human\tCell\tGM19240\n' +
    'Human\tCell\tGM19257\n' +
    'Human\tCell\tGM2255\n' +
    'Human\tCell\tGM2588\n' +
    'Human\tCell\tGM2610\n' +
    'Human\tCell\tGM2630\n' +
    'Human\tCell\tGRANTA-519\n' +
    'Human\tCell\tGSU\n' +
    'Human\tCell\tH1\n' +
    'Human\tCell\tH128\n' +
    'Human\tCell\tH1299\n' +
    'Human\tCell\tH2009\n' +
    'Human\tCell\tH2171\n' +
    'Human\tCell\tH3122\n' +
    'Human\tCell\tH358\n' +
    'Human\tCell\tH7\n' +
    'Human\tCell\tH9\n' +
    'Human\tCell\tHBL1\n' +
    'Human\tCell\tHCC1937\n' +
    'Human\tCell\tHCC1954\n' +
    'Human\tCell\tHCC827\n' +
    'Human\tCell\tHCC95\n' +
    'Human\tCell\tHCT-116\n' +
    'Human\tCell\tHCT-15\n' +
    'Human\tCell\tHEK293\n' +
    'Human\tCell\tHEK293A\n' +
    'Human\tCell\tHEK293T\n' +
    'Human\tCell\tHeLa\n' +
    'Human\tCell\tHeLa-S3\n' +
    'Human\tCell\tHepG2\n' +
    'Human\tCell\tHFF\n' +
    'Human\tCell\tHK1\n' +
    'Human\tCell\tHKC8\n' +
    'Human\tCell\tHL-60\n' +
    'Human\tCell\thMADS-3\n' +
    'Human\tCell\tHNE1\n' +
    'Human\tCell\tHOS\n' +
    'Human\tCell\tHSC4\n' +
    'Human\tCell\tHS-ES-2M\n' +
    'Human\tCell\tHT1080\n' +
    'Human\tCell\tHT29\n' +
    'Human\tCell\tHT-3\n' +
    'Human\tCell\tHu09\n' +
    'Human\tCell\tHuCCT1\n' +
    'Human\tCell\tHUES48\n' +
    'Human\tCell\tHUES6\n' +
    'Human\tCell\tHUES64\n' +
    'Human\tCell\tHuh7\n' +
    'Human\tCell\tIM95\n' +
    'Human\tCell\tIMEC\n' +
    'Human\tCell\tIMR-32\n' +
    'Human\tCell\tIMR-5-75\n' +
    'Human\tCell\tIMR90\n' +
    'Human\tCell\tIN528\n' +
    'Human\tCell\tIOE11\n' +
    'Human\tCell\tIOE4\n' +
    'Human\tCell\tIshikawa\n' +
    'Human\tCell\tJHU-06\n' +
    'Human\tCell\tJMSU-1\n' +
    'Human\tCell\tJurkat\n' +
    'Human\tCell\tK562\n' +
    'Human\tCell\tKARPAS-422\n' +
    'Human\tCell\tKATO_III\n' +
    'Human\tCell\tKB Cell\n' +
    'Human\tCell\tKELLY\n' +
    'Human\tCell\tKMS11\n' +
    'Human\tCell\tKOPT-K1\n' +
    'Human\tCell\tKYSE-510\n' +
    'Human\tCell\tL3.6\n' +
    'Human\tCell\tLAN-1\n' +
    'Human\tCell\tLCL\n' +
    'Human\tCell\tLHCN-M2\n' +
    'Human\tCell\tLIS2\n' +
    'Human\tCell\tLM7\n' +
    'Human\tCell\tLNAR\n' +
    'Human\tCell\tLNCaP\n' +
    'Human\tCell\tLNCaP-abl\n' +
    'Human\tCell\tLOUCY\n' +
    'Human\tCell\tLoVo\n' +
    'Human\tCell\tLOX-IMVI\n' +
    'Human\tCell\tLP-1\n' +
    'Human\tCell\tLREX\n' +
    'Human\tCell\tLS174T\n' +
    'Human\tCell\tLS180\n' +
    'Human\tCell\tLTED\n' +
    'Human\tCell\tLY1\n' +
    'Human\tCell\tM112\n' +
    'Human\tCell\tMB231\n' +
    'Human\tCell\tMB361\n' +
    'Human\tCell\tMB436\n' +
    'Human\tCell\tMB468\n' +
    'Human\tCell\tMCF-10A\n' +
    'Human\tCell\tMCF-7\n' +
    'Human\tCell\tMD-901\n' +
    'Human\tCell\tMDA-MB-231\n' +
    'Human\tCell\tMDA-MB-468\n' +
    'Human\tCell\tMG-63\n' +
    'Human\tCell\tMIA_PaCa-2\n' +
    'Human\tCell\tMKN1\n' +
    'Human\tCell\tMKN45\n' +
    'Human\tCell\tMKN7\n' +
    'Human\tCell\tMLL-AF9\n' +
    'Human\tCell\tMM.1S\n' +
    'Human\tCell\tMNNG\n' +
    'Human\tCell\tMO1043\n' +
    'Human\tCell\tMOLM-13\n' +
    'Human\tCell\tMOLM-14\n' +
    'Human\tCell\tMOLT-3\n' +
    'Human\tCell\tMOLT-4\n' +
    'Human\tCell\tMRC5\n' +
    'Human\tCell\tMS1\n' +
    'Human\tCell\tMSTO\n' +
    'Human\tCell\tMutuI\n' +
    'Human\tCell\tMV4-11\n' +
    'Human\tCell\tN87\n' +
    'Human\tCell\tNB-1643\n' +
    'Human\tCell\tNB69\n' +
    'Human\tCell\tNCC-59\n' +
    'Human\tCell\tNCCIT\n' +
    'Human\tCell\tNCI-0075\n' +
    'Human\tCell\tNCI-0082\n' +
    'Human\tCell\tNCI-H2087\n' +
    'Human\tCell\tNCI-H69\n' +
    'Human\tCell\tNCI-H82\n' +
    'Human\tCell\tNGP\n' +
    'Human\tCell\tNHDF-Ad\n' +
    'Human\tCell\tNHEK\n' +
    'Human\tCell\tNHLF\n' +
    'Human\tCell\tNS129\n' +
    'Human\tCell\tNS134\n' +
    'Human\tCell\tOCI-Ly1\n' +
    'Human\tCell\tOCI-Ly3\n' +
    'Human\tCell\tOCI-Ly4\n' +
    'Human\tCell\tOCUM-1\n' +
    'Human\tCell\tOVCAR3\n' +
    'Human\tCell\tP12-ICHIKAWA\n' +
    'Human\tCell\tP493-6\n' +
    'Human\tCell\tPANC-1\n' +
    'Human\tCell\tPC-3\n' +
    'Human\tCell\tPC-9\n' +
    'Human\tCell\tPEER\n' +
    'Human\tCell\tPF382\n' +
    'Human\tCell\tPfeiffer\n' +
    'Human\tCell\tPrEC\n' +
    'Human\tCell\tRaji\n' +
    'Human\tCell\tRamos\n' +
    'Human\tCell\tReh\n' +
    'Human\tCell\tRERF-GC-1B\n' +
    'Human\tCell\tRh18\n' +
    'Human\tCell\tRh4\n' +
    'Human\tCell\tRH5\n' +
    'Human\tCell\tRj2.2.5\n' +
    'Human\tCell\tRKO\n' +
    'Human\tCell\tRMS008\n' +
    'Human\tCell\tRMS206\n' +
    'Human\tCell\tRMS209\n' +
    'Human\tCell\tRMS216\n' +
    'Human\tCell\tRMS237\n' +
    'Human\tCell\tRMS238\n' +
    'Human\tCell\tRPMI-8402\n' +
    'Human\tCell\tRPM-MC\n' +
    'Human\tCell\tRS4\n' +
    'Human\tCell\tRT112\n' +
    'Human\tCell\tRWPE1\n' +
    'Human\tCell\tSCMC\n' +
    'Human\tCell\tSEM\n' +
    'Human\tCell\tSET2\n' +
    'Human\tCell\tSF268\n' +
    'Human\tCell\tSF7761\n' +
    'Human\tCell\tSF8628\n' +
    'Human\tCell\tSH-EP\n' +
    'Human\tCell\tSHEP-21N\n' +
    'Human\tCell\tSH-SY5Y\n' +
    'Human\tCell\tSJNB-1\n' +
    'Human\tCell\tSJNB-12\n' +
    'Human\tCell\tSJNB-3\n' +
    'Human\tCell\tSJNB-6\n' +
    'Human\tCell\tSJNB-8\n' +
    'Human\tCell\tSKBR-3\n' +
    'Human\tCell\tSKmel147\n' +
    'Human\tCell\tSKMEL2\n' +
    'Human\tCell\tSKmel239\n' +
    'Human\tCell\tSKMEL30\n' +
    'Human\tCell\tSKMEL5\n' +
    'Human\tCell\tSK-N-AS\n' +
    'Human\tCell\tSK-N-DZ\n' +
    'Human\tCell\tSK-N-FI\n' +
    'Human\tCell\tSK-N-MC\n' +
    'Human\tCell\tSKNO-1\n' +
    'Human\tCell\tSK-N-SH\n' +
    'Human\tCell\tSK-OV-3\n' +
    'Human\tCell\tSNU016\n' +
    'Human\tCell\tSNU-16\n' +
    'Human\tCell\tSNU-1750\n' +
    'Human\tCell\tSNU638\n' +
    'Human\tCell\tSNU719\n' +
    'Human\tCell\tSU-DHL6\n' +
    'Human\tCell\tSUM149\n' +
    'Human\tCell\tSUM149R\n' +
    'Human\tCell\tSUM159PT\n' +
    'Human\tCell\tSUM159R\n' +
    'Human\tCell\tSW48\n' +
    'Human\tCell\tSW480\n' +
    'Human\tCell\tSW620\n' +
    'Human\tCell\tT24\n' +
    'Human\tCell\tT47D\n' +
    'Human\tCell\tTC-797\n' +
    'Human\tCell\tTCam-2\n' +
    'Human\tCell\tTE10\n' +
    'Human\tCell\tTE6\n' +
    'Human\tCell\tTE-7\n' +
    'Human\tCell\tTHP-1\n' +
    'Human\tCell\tTIME\n' +
    'Human\tCell\tTL-Om1\n' +
    'Human\tCell\tToledo\n' +
    'Human\tCell\tTOV-21G\n' +
    'Human\tCell\tTR14\n' +
    'Human\tCell\tTT\n' +
    'Human\tCell\tTTC1240\n' +
    'Human\tCell\tTTC-549\n' +
    'Human\tCell\tU266B1\n' +
    'Human\tCell\tU2OS\n' +
    'Human\tCell\tU87\n' +
    'Human\tCell\tUACC-257\n' +
    'Human\tCell\tUACC812\n' +
    'Human\tCell\tVACO_5\n' +
    'Human\tCell\tVCaP\n' +
    'Human\tCell\tWIBR3\n' +
    'Human\tCell\tWIS2\n' +
    'Human\tCell\tYCC-21\n' +
    'Human\tCell\tYCC-22\n' +
    'Human\tCell\tYCC3\n' +
    'Human\tCell\tYCC-7\n' +
    'Human\tCell\tYD8\n' +
    'Human\tCell\tZNF532-NUT\n' +
    'Human\tCell\tZR-75-1\n' +
    'Human\tCell\tZR-75-30\n' +
    'Human\tTissue\tColon_Crypt\n' +
    'Human\tTissue\tFetal_Liver\n' +
    'Human\tTissue\tFetal_Thymus\n' +
    'Human\tTissue\tHippocampus\n' +
    'Human\tTissue\tSkeletal_Muscle\n' +
    'Human\tTissue\tPancreatic_ductal\n' +
    'Human\tTissue\tAorta\n' +
    'Human\tTissue\tEsophagus\n' +
    'Human\tTissue\tendometrioid_adenocarcinoma\n' +
    'Human\tTissue\tRectal_Mucosa\n' +
    'Human\tTissue\tAdrenal_Gland\n' +
    'Human\tTissue\tPontine\n' +
    'Human\tTissue\tPancreatic_Islet\n' +
    'Human\tTissue\tBrain\n' +
    'Human\tTissue\tSpleen\n' +
    'Human\tTissue\tprimary_colorectal_cancer_tumor\n' +
    'Human\tTissue\tGastric_Primary_Sample\n' +
    'Human\tTissue\tFetal_Heart\n' +
    'Human\tTissue\tPsoas_Muscle\n' +
    'Human\tTissue\tPrefrontal\n' +
    'Human\tTissue\tColonic_Mucosa\n' +
    'Human\tTissue\tBone_Marrow\n' +
    'Human\tTissue\tClear_cell_renal_cell_carcinoma_tumor\n' +
    'Human\tTissue\tSigmoid_Colon\n' +
    'Human\tTissue\tCerebellum\n' +
    'Human\tTissue\tUrinary_Bladder\n' +
    'Human\tTissue\tRight_Ventricle\n' +
    'Human\tTissue\tRetina\n' +
    'Human\tTissue\tEndoderm\n' +
    'Human\tTissue\tFetal_Spinal_Cord\n' +
    'Human\tTissue\tLeft_Ventricle\n' +
    'Human\tTissue\tMid_Frontal_Lobe\n' +
    'Human\tTissue\tFetal_Muscle_Leg\n' +
    'Human\tTissue\tThymus\n' +
    'Human\tTissue\tmeningioma\n' +
    'Human\tTissue\tRight_Atrium\n' +
    'Human\tTissue\tFetal_Muscle_Trunk\n' +
    'Human\tTissue\tgastrocnemius_medialis\n' +
    'Human\tTissue\tThyroid\n' +
    'Human\tTissue\tLiver\n' +
    'Human\tTissue\tBlood\n' +
    'Human\tTissue\tUmbilical_Cord\n' +
    'Human\tTissue\tFetal_Adrenal_Gland\n' +
    'Human\tTissue\tFetal_Stomach\n' +
    'Human\tTissue\tKidney\n' +
    'Human\tTissue\tFetal_Brain\n' +
    'Human\tTissue\tHypothalamus\n' +
    'Human\tTissue\tAngular_Gyrus\n' +
    'Human\tTissue\tCingulate_Gyrus\n' +
    'Human\tTissue\tLung\n' +
    'Human\tTissue\tPancreas\n' +
    'Human\tTissue\tOvary\n' +
    'Human\tTissue\tAdipose\n' +
    'Human\tTissue\tdura\n' +
    'Human\tTissue\tStomach\n' +
    'Mouse\tCell\tCone_M_Y-257.03\n' +
    'Mouse\tCell\tMIN\n' +
    'Mouse\tCell\tBetaTC6\n' +
    'Mouse\tCell\tR1\n' +
    'Mouse\tCell\tRodFibr_F_Y-FNR07\n' +
    'Mouse\tCell\tNRL-Rod_M_N-P6\n' +
    'Mouse\tCell\tCD-1\n' +
    'Mouse\tCell\tCH12\n' +
    'Mouse\tCell\tMull_M_Y-rCr33.01\n' +
    'Mouse\tCell\tV5\n' +
    'Mouse\tCell\tCone_I_Y-209.13\n' +
    'Mouse\tCell\tNeuro-2a\n' +
    'Mouse\tCell\tP19CL6\n' +
    'Mouse\tCell\tAmac_M_Y-30.02\n' +
    'Mouse\tCell\tNIH-3T3\n' +
    'Mouse\tCell\tC2\n' +
    'Mouse\tCell\tMull_M_Y-rCr33.04\n' +
    'Mouse\tCell\tCone_I_Y-209.12\n' +
    'Mouse\tCell\tTKO\n' +
    'Mouse\tCell\tMull_M_Y-263.08\n' +
    'Mouse\tCell\t232\n' +
    'Mouse\tCell\tJ1\n' +
    'Mouse\tCell\tRaw_264.7\n' +
    'Mouse\tCell\tTT2\n' +
    'Mouse\tCell\tCone_I_Y-209.11\n' +
    'Mouse\tCell\tE8.5\n' +
    'Mouse\tCell\tCone_I_N-rCh209.04\n' +
    'Mouse\tCell\t207\n' +
    'Mouse\tCell\tE14\n' +
    'Mouse\tCell\tT.T\n' +
    'Mouse\tCell\tMAST\n' +
    'Mouse\tCell\tIDG-SW3\n' +
    'Mouse\tCell\tLNCaP\n' +
    'Mouse\tCell\tB16-BL6\n' +
    'Mouse\tCell\tAT-3\n' +
    'Mouse\tCell\tP19.6\n' +
    'Mouse\tCell\tE14Tg2A\n' +
    'Mouse\tCell\tMMTV-Myc\n' +
    'Mouse\tCell\tMEFs\n' +
    'Mouse\tCell\tSCLC-24H\n' +
    'Mouse\tCell\thES-T3\n' +
    'Mouse\tCell\tP19\n' +
    'Mouse\tCell\tMull_M_N-rCr263.4\n' +
    'Mouse\tCell\tG1E\n' +
    'Mouse\tCell\tEL-4\n' +
    'Mouse\tCell\tRod_I_Y-8602\n' +
    'Mouse\tCell\tX18.1.1\n' +
    'Mouse\tCell\t46C\n' +
    'Mouse\tCell\tAmac_I_N-rG79.04\n' +
    'Mouse\tCell\tEpH4\n' +
    'Mouse\tCell\tCone_M_N-rCh257.4\n' +
    'Mouse\tCell\tBipo_I_Y-208.03\n' +
    'Mouse\tCell\tBipo_I_Y-208.04\n' +
    'Mouse\tCell\tAinv15\n' +
    'Mouse\tCell\tMull_M_N-rCr33.05\n' +
    'Mouse\tCell\tMull_M_N-rCr143.02\n' +
    'Mouse\tCell\tTSC\n' +
    'Mouse\tCell\tT23\n' +
    'Mouse\tCell\tV6.5\n' +
    'Mouse\tCell\tHL-1\n' +
    'Mouse\tCell\tP6D4\n' +
    'Mouse\tCell\tBipo_I_Y-rM0405\n' +
    'Mouse\tCell\tmpkCCD\n' +
    'Mouse\tCell\tGRM6-Bipo_M_N\n' +
    'Mouse\tCell\tAmacFibr_F_N-fG140.02\n' +
    'Mouse\tCell\tBV2\n' +
    'Mouse\tCell\t29c\n' +
    'Mouse\tCell\tMEL\n' +
    'Mouse\tCell\tMullFibr_F_N-FCR02\n' +
    'Mouse\tCell\tMullFibr_F_N-FCR01\n' +
    'Mouse\tCell\tMull_M_Y-Cr143.01\n' +
    'Mouse\tCell\t155\n' +
    'Mouse\tCell\t3T3-L1\n' +
    'Mouse\tCell\t32D_Myeloid\n' +
    'Mouse\tCell\tBipo_I_Y-rM0401\n' +
    'Mouse\tCell\tAtT-20\n' +
    'Mouse\tCell\tHPC-7\n' +
    'Mouse\tCell\tNMuMG\n' +
    'Mouse\tCell\tEpiSC9\n' +
    'Mouse\tCell\tMK2\n' +
    'Mouse\tCell\tE36\n' +
    'Mouse\tCell\tBipo_I_N-rM0408\n' +
    'Mouse\tCell\tMLL-AF9\n' +
    'Mouse\tCell\tMelan-a\n' +
    'Mouse\tCell\tNRL-Rod_M_N-P21\n' +
    'Mouse\tCell\t416B\n' +
    'Mouse\tCell\t8946\n' +
    'Mouse\tCell\tmHypoE-N6\n' +
    'Mouse\tCell\tCGR8\n' +
    'Mouse\tCell\tT6E\n' +
    'Mouse\tCell\tC2C12\n' +
    'Mouse\tCell\tMK1\n' +
    'Mouse\tCell\tRN2\n' +
    'Mouse\tCell\tResting_Treg\n' +
    'Mouse\tCell\tTh2\n' +
    'Mouse\tCell\tT_Lymphocyte\n' +
    'Mouse\tCell\tHepatocyte\n' +
    'Mouse\tCell\tMacrophage\n' +
    'Mouse\tCell\tMyoblast\n' +
    'Mouse\tCell\tLeukemia\n' +
    'Mouse\tCell\tSpermatid\n' +
    'Mouse\tCell\tFibroblast\n' +
    'Mouse\tCell\tMouse_embryonic_stem_cells\n' +
    'Mouse\tCell\tType_1_innate_lymphoid_cells\n' +
    'Mouse\tCell\tNeural_crest_cell\n' +
    'Mouse\tCell\tNatural_Killer_Cell\n' +
    'Mouse\tCell\tHematopoietic_Stem_Cell\n' +
    'Mouse\tCell\tAstrocyte\n' +
    'Mouse\tCell\tMonocyte\n' +
    'Mouse\tCell\tNeuron\n' +
    'Mouse\tCell\tB_cell_precursor\n' +
    'Mouse\tCell\tHaematopoietic_Progenitor_Cell\n' +
    'Mouse\tCell\tStromal_Cell\n' +
    'Mouse\tCell\tProgenitor_Cells\n' +
    'Mouse\tCell\tCardiomyocyte\n' +
    'Mouse\tCell\tPlasma_Cell\n' +
    'Mouse\tCell\tNeural_Progenitor_Cell\n' +
    'Mouse\tCell\tType_3_innate_lympoid_cell\n' +
    'Mouse\tCell\tLeukemia_Cell\n' +
    'Mouse\tCell\tEpithelium\n' +
    'Mouse\tCell\tIntermediate\n' +
    'Mouse\tCell\tDendritic_Cell\n' +
    'Mouse\tCell\tiPSC\n' +
    'Mouse\tCell\tEmbryonic_Stem_Cell\n' +
    'Mouse\tCell\tHematopoietic_stem_and_progenitor_cell\n' +
    'Mouse\tCell\tNeutrophil_cell\n' +
    'Mouse\tCell\tB_Lymphocyte\n' +
    'Mouse\tCell\tCortex\n' +
    'Mouse\tCell\tPlasmablast\n' +
    'Mouse\tCell\tActivated_Treg\n' +
    'Mouse\tCell\tTh1\n' +
    'Mouse\tCell\tAdipocyte\n' +
    'Mouse\tCell\tPrimary_mammary_epithelial_cells\n' +
    'Mouse\tCell\tStem_cell\n' +
    'Mouse\tTissue\tFetal_Liver\n' +
    'Mouse\tTissue\tHippocampus\n' +
    'Mouse\tTissue\tBrain\n' +
    'Mouse\tTissue\tSpleen\n' +
    'Mouse\tTissue\tBone_Marrow\n' +
    'Mouse\tTissue\tCerebellum\n' +
    'Mouse\tTissue\tRetina\n' +
    'Mouse\tTissue\tThymus\n' +
    'Mouse\tTissue\tLiver\n' +
    'Mouse\tTissue\tHypothalamus\n' +
    'Mouse\tTissue\tLung\n' +
    'Mouse\tTissue\tPancreas\n' +
    'Mouse\tTissue\tAdipose';
  let items = string2array(text);
  let options = [];
  items.map((item)=>{
    let {Species,	BioSample_Type,	BioSample_Term} = item;

    let typeIndex = options.findIndex((o) => o.value === Species);
    let termItem = {value: BioSample_Term, label: BioSample_Term, type: BioSample_Type, Species};
    let typeItem = {value: BioSample_Type, label: BioSample_Type, Species};
    if(typeIndex === -1) {
      options = [
        ...options,
        {value: Species, label: Species, children: [typeItem]}
      ];
    }  else {
      let {children} = options[typeIndex];
      children = children || [];
      let t2 = children.findIndex(c=>c.value === BioSample_Type);
      if(t2 === -1) children = [...children, typeItem];
      options[typeIndex] = {...options[typeIndex], children};
    }
    let index3 = options.findIndex((o) => o.value === Species);
    let opt = options[index3];
    let children3 = opt.children || [];
    let index4 = children3.findIndex(c=> c.value === BioSample_Type);
    let children4 = children3[index4].children || [];
    children4 = [...children4, termItem];
    children3[index4].children = children4;
    opt.children = children3;
    options[index3] = opt;
  });
  return options;
};

// console.log(uuid.toString());
const Elnc = Form.create()(
  class extends React.Component{
    constructor(props){
      super(props);
      let args = get_args(location.search);
      console.log(args);
      this.state = {
        disabled: false,
        data: [],
        selected_items: [],
        action_title: args.block_id? '另存为': action_name,
        ...args,
        block_info: {},
        example: '',
        btn_text: '#example',
        intype: 'Ensembl ID',
        defaultChecked: true,
        show_ex: true,
      };
    }
    getValueFromEvent = (e) => {
      if (Array.isArray(e)) return e;
      return e && e.fileList;
    };
    getFileItem= (fileList) => {
      if(Array.isArray(fileList) && fileList.length > 0) return fileList[0].response.path;
      return ''
    };
    componentWillMount =()=>{
      // this.props.form.setFieldsValue({ex: true});
    };
    handleCreate = (form)=>{

      // this.props.history.push('/retrieve/?taskid=demo');
      // return;
      let values = form.getFieldsValue();
      console.log(values);
      let {gtf, INPUT_GTF, BAM_LINK, species, SEQ_TYPE, USER_ENHANCER, enhancer, user_species} = values;
      INPUT_GTF = this.getFileItem(INPUT_GTF);
      USER_ENHANCER = this.getFileItem(USER_ENHANCER);

      if(gtf === 'file'){
        if(!INPUT_GTF) {
          jy_tip('Upload GTF generated by de novo assembly please!');
          return;
        }
      }
      if (gtf === 'link'){
        if(!BAM_LINK){
          jy_tip('Input bam link please!');
          return;
        }
      }

      let rq = {};
      if(INPUT_GTF) rq = {...rq, INPUT_GTF, FILE_TYPE: 'gtf'};
      if(BAM_LINK) rq = {...rq, BAM_LINK, FILE_TYPE: 'bam'};
      if(enhancer === 'User'){
        if(!USER_ENHANCER){
          jy_tip('Upload user-defined enhancer or select pre-annotated enhancer!');
          return;
        }
        let SPE = user_species.toLowerCase();
        rq = {...rq, SPE, USER_ENHANCER, UPLOAD_ENHANCER: 'YES'};
      }else {
        let SPE = species[0].toLowerCase();
        let BIO_TYPE = species[1].toLowerCase();
        let BIO_TERM = species[2];
        rq = {
          ...rq,
          SPE,
          BIO_TYPE,
          BIO_TERM,
        };
      }
      rq = {
        ...rq,
        SEQ_TYPE,
        STRINGTIE:	'stringtie',
        CUFFCOMP:	'cuffcompare',
        SAMTOOLS:	'samtools',
        BEDTOOLS:	'bedtools',
      };
      this.setState({disabled: true});
      this.submitRq(rq);
    };
    submitRq = (values) =>{
      post_task('/ncfans/elnc', values, (res)=>{
        this.setState({disabled: false});
        let {data, status} = res;
        if(data) this.props.history.push('/retrieve/?taskid=' + data.task_id);
        else jy_tip(JSON.stringify(res));
      })
    };

    render(){
      const {form} = this.props;
      const {getFieldDecorator} = form;
      const table_style = {width: '30%', margin: '0 30%'};
      const formItemLayout = {labelCol: 24, wrapperCol: 24};
      let user_input_items = [
        {
          field: 'gtf', tag: 'radio',
          label: '1.Trancriptome data',
          items: [{value: 'file', text: <span>
              Upload GTF generated by de novo assembly
              (highly recommended,
              &nbsp;
              <Button
                type={'primary'}
                size={'small'} icon={'file'} onClick={()=>{
                let fInfo = {
                  uid: 'INPUT_GTF',
                  name: 'SRA008244.gtf',
                  path: '/mnt/JINGD/example/ncfans/SRA008244.gtf',
                  status: 'done',
                };
                this.setState({fileList: [{...fInfo, response: fInfo}]})
              }}>Load example</Button> &nbsp;
              <Button size={'small'} icon={'download'} onClick={()=>{
                down_file({file_path: '/mnt/JINGD/example/ncfans/SRA008244.gtf'})
              }}>example</Button>
              )
            </span>}],
          initialValue: 'file',
          onChange: (e)=>{
            console.log(e);
            // item = { ...item, fileList: [ {...fInfo,  response: fInfo } ] };
          }
        },
        {
          field: 'INPUT_GTF', required: true, initialValue: '',
          tag: 'upload',
          ...formItemLayout,
          getValueFromEvent: this.getValueFromEvent,
          fileList: this.state.fileList
          // onChange: (s)=>{
          //   console.log(s);
          // }
        },
        {
          initialValue: 'file',
          field: 'gtf', tag: 'radio', items: [{
            value: 'link', text: <span>Uploading bam file is not recommended.
            You can convert it to GTF file by de novo assembly as described in <Tooltip
                placement={'right'}
                overlayStyle={{width: '500px'}}
                title={<div>
                  <h3>Manual for bam</h3>
                  <p>
                    Owing to the incalculable download time and storage, we do not recommend users to upload alignment results in .bam or .sam format. They are encouraged to perform de novo assembly locally and then upload GTF file instead. Our strategies for de novo assembly are shown in the following:
                  </p>
                  <ol>
                    <li>
                      For RNA-seq data, the software StringTie is used.
                      <ul><li>stringtie –p thread_num –o output.gtf input.bam</li></ul>
                    </li>
                    <li>
                      For GRO-seq data, the software Homer is used.
                      <ul>
                        <li>homer/bin/makeTagDirectory Homer_tagdir –genome mm10/hg38 input.bam</li>
                        <li>homer/bin/findPeaks Homer_tagdir –style groseq –rev –o denovotranscripts.txt –gtf output.gtf</li>
                      </ul>
                    </li>
                  </ol>
                </div>}><a>manual</a></Tooltip>.</span>
          }]},
        {field: 'BAM_LINK', placeholder: 'Input bam link please!'},
        {
          label: '2.Sequencing Type', field: 'SEQ_TYPE', tag: 'radio',
          initialValue: 'GRO-seq',
          radio_type: 'btn',
          size: 'small',
          items: ['GRO-seq', 'RNA-seq']
        },

        {
          field: 'enhancer',
          label: '3.Enhancer definition',
          tag: 'radio',
          initialValue: 'Pre-annotated',
          groupStyle: {display: 'block'},
          items: [
            {
              value: 'User',
              style: {display: 'block', width: '100%'},
              text: <span>
                User-defined enhancer
                <p>
                  {
                    jy_form_item({
                      // label: 'User-defined enhancer',
                      field: 'user_species',
                      initialValue: 'Human',
                      tag: 'select',
                      items: ['Human', 'Mouse'],
                      getFieldDecorator, marginBottom: '5px',
                    })
                  }
                  {
                    jy_form_item(
                      {
                        field: 'USER_ENHANCER', tag: 'upload',
                        getValueFromEvent: this.getValueFromEvent,
                        getFieldDecorator, marginBottom: '5px',
                      },
                    )
                  }
                </p>
              </span>
            },
            {
              value: 'Pre-annotated',
              style: {display: 'block', width: '100%'},
              text: <span>
                Pre-annotated enhancer
                {
                  jy_form_item({
                    // label: 'Choose species and cell/tissue-specific enhancers',
                    // label: 'Pre-annotated enhancer',
                    field: 'species',
                    initialValue: ['Human', 'Cell', 'Neuroblatoma_cell_line'],
                    tag: 'cascader',
                    options: getELNcSpecies(),
                    getFieldDecorator
                  })
                }
              </span>
            }
          ]
        },
        // {
        //   label: 'Choose species and cell/tissue-specific enhancers',
        //   field: 'species',
        //   initialValue: ['Human', 'Cell', 'Neuroblatoma_cell_line'],
        //   tag: 'cascader',
        //   options: getELNcSpecies(),
        // },

      ];
      let {activateKeys} = this.state;
      activateKeys = activateKeys || ['exp_filter', 'do_dif', 'do_coexp'];
      return (
        <JYModel
          action={this.state.action_title}
        >
          <Form style={{width: '100%', margin: '0 auto'}}  {...formItemLayout}>
            <Collapse
              bordered={true}
              style={{ margin: '0 auto'}}
              // defaultActiveKey={'1'}
              defaultActiveKey={['1', ...activateKeys]}
              expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
            >
              <Panel header="User input" key="1">
                {
                  user_input_items.map((item, index)=>{
                    return jy_form_item({...item,
                      getFieldDecorator, marginBottom: '10px',
                      ...formItemLayout
                      //initialValue: block_info[item.field] || item.initialValue
                    });
                  })
                }
              </Panel>
            </Collapse>
            <br/>
            <Button type={'primary'} onClick={()=>this.handleCreate(form)} block={true} style={table_style} disabled={this.state.disabled}>Run</Button>
          </Form>
        </JYModel>
      )
    }
  }
);

export default Elnc;
