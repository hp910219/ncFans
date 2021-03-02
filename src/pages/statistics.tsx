
import React from 'react';

import styles from './statistics.css';
import {Collapse, Tabs, Divider} from "antd";
import JYTable from "@/pages/utils/JYTable";
import {sortColumns} from "@/pages/utils/request";
const sortSColumns = (text) =>{
  let {columns, items} = sortColumns(text);
  return {columns, dataSource: items}
};
const getSChip = ()=>{
  let text = 'Species\tArray type\tPCG\tlncRNA\tmiRNA\tsnoRNA\tsnRNA\ttRNA\trRNA\n' +
    'Human\tHG-U133_Plus_2\t17235\t3893\t6\t9\t9\t0\t0\n' +
    'Human\tHG-U133A_2\t12063\t281\t3\t0\t1\t0\t0\n' +
    'Human\tHG-U133A\t12060\t283\t3\t0\t1\t0\t0\n' +
    'Human\tHG-U133B\t8468\t2012\t3\t4\t4\t0\t0\n' +
    'Human\tHG-U219\t17387\t337\t1\t33\t0\t0\t0\n' +
    'Human\tHG-U95Av2\t8470\t156\t1\t1\t0\t0\t0\n' +
    'Human\tHG-U95B\t6066\t900\t1\t3\t0\t0\t0\n' +
    'Human\tHG-U95C\t4718\t1263\t0\t1\t1\t0\t0\n' +
    'Human\tHG-U95D\t3493\t1390\t1\t3\t1\t0\t0\n' +
    'Human\tHG-U95E\t4835\t1146\t2\t4\t3\t0\t0\n' +
    'Human\tHT_HG-U133_Plus_PM\t16289\t1446\t2\t4\t0\t0\t0\n' +
    'Human\tHuEx-1_0-st-v2\t19051\t13871\t236\t415\t1272\t33\t3\n' +
    'Human\tHuGene-1_0-st-v1\t18408\t1339\t148\t439\t1310\t2\t3\n' +
    'Human\tHuGene-2_0-st-v1\t18336\t3821\t890\t177\t24\t0\t0\n' +
    'Human\tHuGene-2_1-st-v1\t18337\t3823\t890\t177\t24\t0\t0\n' +
    'Human\tHT_MG-430_PM\t16126\t982\t1\t1\t0\t0\t0\n' +
    'Mouse\tMG_U74Av2\t8342\t84\t0\t1\t1\t0\t1\n' +
    'Mouse\tMG_U74Bv2\t6937\t389\t3\t2\t0\t0\t1\n' +
    'Mouse\tMG_U74Cv2\t4048\t622\t0\t1\t1\t0\t1\n' +
    'Mouse\tMOE430A\t12597\t170\t3\t1\t1\t0\t1\n' +
    'Mouse\tMOE430B\t7808\t1668\t2\t5\t1\t0\t2\n' +
    'Mouse\tMoEx-1_0-st\t20687\t8357\t255\t120\t29\t1\t4\n' +
    'Mouse\tMoGene-1_0-st\t19950\t1060\t297\t254\t551\t0\t84\n' +
    'Mouse\tMoGene-1_1-st\t19377\t671\t238\t35\t3\t0\t1\n' +
    'Mouse\tMoGene-2_0-st\t20017\t2210\t441\t59\t1\t0\t1\n' +
    'Mouse\tMouse430_2\t17005\t1805\t5\t6\t2\t0\t2\n' +
    'Mouse\tMouse430A_2\t12594\t170\t3\t1\t1\t0\t1\n' +
    'Mouse\tMTA-1_0\t6893\t384\t2\t2\t0\t0\t1';
  return sortSColumns(text)
};
const getSNet1 = ()=>{
  let text = 'Condition\tType\tPCG\tlncRNA\tmiRNA\tsnRNA\tsnoRNA\trRNA\n' +
    'Normal\tAdipose_Subcutaneous (N=663)\t18820\t6020\t105\t211\t185\t2\n' +
    'Normal\tAdipose_Visceral (N=542)\t18813\t5984\t101\t197\t185\t3\n' +
    'Normal\tAdrenal_Gland (N=259)\t18823\t5278\t93\t149\t168\t2\n' +
    'Normal\tArtery_Aorta (N=433)\t18774\t5929\t117\t210\t200\t2\n' +
    'Normal\tArtery_Coronary (N=241)\t18597\t6177\t119\t200\t191\t2\n' +
    'Normal\tArtery_Tibial (N=664)\t18782\t5576\t100\t188\t169\t1\n' +
    'Normal\tBladder (N=22)\t18714\t6254\t126\t197\t184\t2\n' +
    'Normal\tBrain_Amygdala (N=153)\t18348\t5479\t48\t105\t115\t3\n' +
    'Normal\tBrain_Anterior_cingulate_cortex (N=177)\t18773\t5596\t60\t113\t121\t3\n' +
    'Normal\tBrain_Caudate (N=247)\t18775\t5652\t57\t124\t126\t4\n' +
    'Normal\tBrain_Cerebellar_Hemisphere (N=216)\t18507\t6117\t144\t241\t202\t4\n' +
    'Normal\tBrain_Cerebellum (N=242)\t18727\t6345\t154\t253\t211\t3\n' +
    'Normal\tBrain_Cortex (N=256)\t18189\t5826\t75\t135\t135\t2\n' +
    'Normal\tBrain_Frontal_Cortex (N=210)\t18820\t5798\t70\t131\t135\t2\n' +
    'Normal\tBrain_Hippocampus (N=198)\t18747\t5610\t52\t108\t118\t3\n' +
    'Normal\tBrain_Hypothalamus (N=203)\t18316\t6030\t61\t126\t132\t4\n' +
    'Normal\tBrain_Nucleus_accumbens (N=247)\t18709\t5745\t62\t129\t127\t4\n' +
    'Normal\tBrain_Putamen (N=206)\t18775\t5233\t49\t97\t115\t3\n' +
    'Normal\tBrain_Spinal_cord (N=160)\t18726\t5911\t68\t134\t140\t2\n' +
    'Normal\tBrain_Substantia_nigra (N=140)\t19177\t5454\t51\t103\t123\t2\n' +
    'Normal\tBreast_Mammary_Tissue (N=460)\t17975\t6594\t116\t235\t196\t3\n' +
    'Normal\tCells_Cultured_fibroblasts (N=505)\t18703\t5039\t95\t166\t176\t3\n' +
    'Normal\tCells_EBV-transformed_lymphocytes (N=175)\t18806\t4793\t108\t185\t190\t6\n' +
    'Normal\tCervix_Ectocervix (N=10)\t18773\t6562\t153\t308\t227\t4\n' +
    'Normal\tCervix_Endocervix (N=11)\t17590\t6741\t156\t262\t212\t5\n' +
    'Normal\tColon_Sigmoid (N=374)\t18684\t5836\t104\t191\t175\t3\n' +
    'Normal\tColon_Transverse (N=407)\t18732\t5889\t99\t181\t170\t3\n' +
    'Normal\tEsophagus_Gastroesophageal_Junction (N=376)\t18206\t5720\t100\t177\t174\t2\n' +
    'Normal\tEsophagus_Mucosa (N=556)\t18662\t5412\t108\t183\t175\t2\n' +
    'Normal\tEsophagus_Muscularis (N=516)\t18774\t5608\t97\t170\t166\t2\n' +
    'Normal\tFallopian_Tube (N=10)\t18650\t6825\t167\t280\t209\t4\n' +
    'Normal\tHeart_Atrial_Appendage (N=430)\t17034\t4963\t72\t129\t149\t1\n' +
    'Normal\tHeart_Left_Ventricle (N=433)\t18776\t4050\t57\t77\t123\t0\n' +
    'Normal\tKidney_Cortex (N=86)\t18406\t5811\t86\t137\t148\t2\n' +
    'Normal\tLiver (N=227)\t18819\t4441\t70\t123\t141\t0\n' +
    'Normal\tLung (N=579)\t18669\t6691\t146\t246\t212\t2\n' +
    'Normal\tMinor_Salivary_Gland (N=163)\t18691\t6076\t117\t219\t187\t2\n' +
    'Normal\tMuscle_Skeletal (N=804)\t18782\t4136\t60\t86\t127\t0\n' +
    'Normal\tNerve_Tibial (N=620)\t18680\t6815\t136\t290\t210\t2\n' +
    'Normal\tOvary (N=181)\t18440\t6434\t150\t260\t223\t3\n' +
    'Normal\tPancreas (N=329)\t18467\t4426\t80\t127\t148\t1\n' +
    'Normal\tPituitary (N=284)\t18772\t7066\t146\t227\t215\t3\n' +
    'Normal\tProstate (N=246)\t18633\t6947\t134\t226\t200\t4\n' +
    'Normal\tSkin_Not_Sun_Exposed (N=605)\t16747\t6092\t126\t251\t206\t1\n' +
    'Normal\tSkin_Sun_Exposed (N=702)\t18329\t6164\t121\t245\t191\t1\n' +
    'Normal\tSmall_Intestine_Terminal_Ileum (N=188)\t18812\t6361\t126\t224\t196\t2\n' +
    'Normal\tSpleen (N=242)\t18746\t6136\t123\t214\t189\t3\n' +
    'Normal\tStomach (N=360)\t18253\t5690\t97\t161\t164\t1\n' +
    'Normal\tTestis (N=362)\t19176\t11085\t162\t321\t260\t8\n' +
    'Normal\tThyroid (N=654)\t17840\t6750\t149\t258\t235\t2\n' +
    'Normal\tUterus (N=143)\t19177\t6449\t133\t248\t210\t4\n' +
    'Normal\tVagina (N=157)\t18812\t6649\t148\t252\t214\t4\n' +
    'Normal\tWhole_Blood (N=756)\t18593\t3868\t79\t109\t121\t1\n' +
    'Cancer\tTCGA-ACC (N=79)\t17789\t4318\t206\t181\t154\t2\n' +
    'Cancer\tTCGA-BLCA (N=405)\t18557\t4988\t249\t236\t184\t3\n' +
    'Cancer\tTCGA-BRCA (N=1079)\t18698\t4905\t257\t306\t176\t4\n' +
    'Cancer\tTCGA-CESC (N=298)\t18885\t4678\t244\t225\t168\t4\n' +
    'Cancer\tTCGA-CHOL (N=36)\t18862\t4901\t265\t249\t179\t2\n' +
    'Cancer\tTCGA-COAD (N=454)\t18884\t4191\t272\t254\t199\t12\n' +
    'Cancer\tTCGA-DLBC (N=47)\t18831\t4209\t232\t233\t163\t4\n' +
    'Cancer\tTCGA-ESCA (N=153)\t18733\t6181\t575\t700\t323\t8\n' +
    'Cancer\tTCGA-GBM (N=144)\t17605\t5183\t259\t267\t190\t10\n' +
    'Cancer\tTCGA-HNSC (N=497)\t18605\t4000\t178\t167\t131\t4\n' +
    'Cancer\tTCGA-KICH (N=65)\t18037\t3862\t190\t160\t127\t3\n' +
    'Cancer\tTCGA-KIRC (N=526)\t18770\t5068\t292\t316\t189\t4\n' +
    'Cancer\tTCGA-KIRP (N=287)\t18844\t4904\t247\t257\t152\t4\n' +
    'Cancer\tTCGA-LAML (N=136)\t18512\t6776\t799\t906\t453\t8\n' +
    'Cancer\tTCGA-LGG (N=500)\t18091\t4969\t250\t247\t169\t3\n' +
    'Cancer\tTCGA-LIHC (N=369)\t18884\t3901\t146\t145\t121\t2\n' +
    'Cancer\tTCGA-LUAD (N=510)\t18658\t5382\t308\t314\t210\t4\n' +
    'Cancer\tTCGA-LUSC (N=496)\t18648\t5422\t287\t268\t194\t4\n' +
    'Cancer\tTCGA-MESO (N=81)\t18753\t4335\t223\t198\t138\t2\n' +
    'Cancer\tTCGA-OV (N=354)\t18630\t5676\t413\t461\t239\t13\n' +
    'Cancer\tTCGA-PAAD (N=178)\t18865\t4818\t266\t238\t164\t4\n' +
    'Cancer\tTCGA-PCPG (N=177)\t18744\t4313\t231\t180\t179\t3\n' +
    'Cancer\tTCGA-PRAD (N=482)\t18680\t4430\t218\t221\t158\t4\n' +
    'Cancer\tTCGA-READ (N=163)\t18157\t4044\t236\t200\t175\t3\n' +
    'Cancer\tTCGA-SARC (N=259)\t18717\t5126\t211\t191\t139\t3\n' +
    'Cancer\tTCGA-SKCM (N=468)\t18821\t4591\t206\t189\t140\t3\n' +
    'Cancer\tTCGA-STAD (N=373)\t18838\t6106\t589\t753\t333\t14\n' +
    'Cancer\tTCGA-TGCT (N=149)\t17197\t5373\t287\t259\t230\t5\n' +
    'Cancer\tTCGA-THCA (N=505)\t18868\t4091\t224\t196\t136\t4\n' +
    'Cancer\tTCGA-THYM (N=119)\t18787\t5148\t242\t220\t154\t3\n' +
    'Cancer\tTCGA-UCEC (N=537)\t18237\t5066\t249\t247\t192\t10\n' +
    'Cancer\tTCGA-UCS (N=56)\t17975\t5449\t234\t214\t182\t4\n' +
    'Cancer\tTCGA-UVM (N=77)\t18585\t3247\t155\t126\t106\t3';
  return sortSColumns(text);
};
const getSNet2 = ()=>{
  let text = 'Condition\tType\tPCG\tlncRNA\tmiRNA\tsnRNA\tsnoRNA\trRNA\n' +
    'Normal\tmCH_Downstream (N=40)\t19492\t13673\t1412\t1798\t922\t24\n' +
    'Normal\tmCG_Promoter (N=40)\t19686\t13693\t1399\t1794\t916\t25\n' +
    'Normal\tmCH_Promoter (N=40)\t19687\t13698\t1399\t1797\t916\t25\n' +
    'Normal\tmCG_Downstream (N=40)\t19687\t13662\t1412\t1792\t921\t24\n' +
    'Normal\tmC_Downstream (N=40)\t19687\t13673\t1412\t1798\t922\t24\n' +
    'Normal\tmC_GeneBody (N=40)\t19788\t13764\t1171\t1363\t832\t19\n' +
    'Normal\tmC_Promoter (N=40)\t19788\t13698\t1399\t1797\t916\t25\n' +
    'Normal\tmCG_GeneBody (N=40)\t19788\t13710\t775\t1021\t564\t16\n' +
    'Normal\tmCH_GeneBody (N=40)\t19788\t13764\t1171\t1363\t832\t19\n' +
    'Cancer\tTCGA-ACC (N=80)\t6096\t435\t38\t5\t0\t1\n' +
    'Cancer\tTCGA-BLCA (N=410)\t7518\t464\t33\t6\t0\t0\n' +
    'Cancer\tTCGA-BRCA (N=779)\t5886\t384\t28\t5\t0\t0\n' +
    'Cancer\tTCGA-CESC (N=301)\t6197\t415\t30\t5\t0\t0\n' +
    'Cancer\tTCGA-CHOL (N=36)\t7279\t431\t30\t6\t0\t1\n' +
    'Cancer\tTCGA-COAD (N=293)\t6573\t414\t29\t4\t0\t1\n' +
    'Cancer\tTCGA-DLBC (N=47)\t7139\t442\t37\t4\t0\t1\n' +
    'Cancer\tTCGA-ESCA (N=175)\t6978\t447\t33\t6\t0\t0\n' +
    'Cancer\tTCGA-GBM (N=126)\t7075\t420\t39\t6\t0\t0\n' +
    'Cancer\tTCGA-HNSC (N=525)\t6816\t424\t27\t7\t0\t0\n' +
    'Cancer\tTCGA-KICH (N=66)\t4083\t297\t21\t3\t0\t0\n' +
    'Cancer\tTCGA-KIRC (N=316)\t6819\t397\t29\t5\t0\t0\n' +
    'Cancer\tTCGA-KIRP (N=274)\t4813\t340\t29\t5\t0\t0\n' +
    'Cancer\tTCGA-LAML (N=140)\t6985\t450\t37\t3\t0\t0\n' +
    'Cancer\tTCGA-LGG (N=505)\t5114\t364\t28\t4\t0\t1\n' +
    'Cancer\tTCGA-LIHC (N=375)\t5282\t395\t28\t5\t0\t0\n' +
    'Cancer\tTCGA-LUAD (N=455)\t7429\t449\t33\t5\t0\t1\n' +
    'Cancer\tTCGA-LUSC (N=365)\t6880\t447\t33\t5\t0\t1\n' +
    'Cancer\tTCGA-MESO (N=82)\t6077\t429\t38\t6\t0\t0\n' +
    'Cancer\tTCGA-OV (N=10)\t5649\t399\t35\t4\t0\t0\n' +
    'Cancer\tTCGA-PAAD (N=185)\t5767\t384\t27\t5\t0\t0\n' +
    'Cancer\tTCGA-PCPG (N=178)\t5978\t411\t36\t5\t0\t0\n' +
    'Cancer\tTCGA-PRAD (N=485)\t6096\t403\t30\t5\t0\t0\n' +
    'Cancer\tTCGA-READ (N=95)\t7564\t449\t31\t6\t0\t0\n' +
    'Cancer\tTCGA-SARC (N=261)\t6337\t407\t31\t6\t0\t0\n' +
    'Cancer\tTCGA-SKCM (N=470)\t5658\t402\t26\t6\t0\t0\n' +
    'Cancer\tTCGA-STAD (N=393)\t6835\t433\t30\t6\t0\t0\n' +
    'Cancer\tTCGA-TGCT (N=149)\t6605\t483\t39\t5\t0\t0\n' +
    'Cancer\tTCGA-THCA (N=510)\t4768\t293\t20\t2\t0\t0\n' +
    'Cancer\tTCGA-THYM (N=124)\t5178\t382\t29\t4\t0\t0\n' +
    'Cancer\tTCGA-UCEC (N=425)\t7524\t440\t30\t7\t0\t0\n' +
    'Cancer\tTCGA-UCS (N=57)\t6193\t428\t32\t7\t0\t0\n' +
    'Cancer\tTCGA-UVM (N=77)\t4734\t349\t33\t4\t0\t0';
  return sortSColumns(text);
};

const getSNet3 = ()=>{
  let text = 'Gene type\tceRNA\tTF\tRBP\tTriplex\tmiRNA\tTotal\n' +
    'lncRNA\t15747\t6212\t17132\t17315\t17884\t17892\n' +
    'PCG\t15103\t1182\t1529\t17227\t-\t18696';
  return sortSColumns(text);
};

const getSELnc = ()=>{
  let text = 'Species\tCell\tTissue\n' +
    'Human\t460\t55\n' +
    'Mouse\t196\t57';
  return sortSColumns(text);
};


class Statistics extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    return <div>
      <Collapse defaultActiveKey={['1', '2', '3']}>
        <Collapse.Panel key={'1'} header={'ncFANs-CHIP'}>
          <JYTable {...getSChip()} btns={[]} title={()=><h3>Microarray types and gene numbers</h3>}/>
        </Collapse.Panel>
        <Collapse.Panel key={'2'} header={'ncFANs-NET'}>
          <Tabs type={'card'}>
            <Tabs.TabPane tab="co-expression" key="1">
              <JYTable {...getSNet1()} btns={[]} title={()=><h3>Samples and genes in co-expression network</h3>}/>
            </Tabs.TabPane>
            <Tabs.TabPane tab="co-methylation" key="2">
              <JYTable {...getSNet2()} btns={[]} title={()=><h3>Samples and genes in co-methylation network</h3>}/>
            </Tabs.TabPane>
            <Tabs.TabPane tab="lncRNA-centric" key="3">
              <JYTable {...getSNet3()} btns={[]} title={()=><h3>Genes in lncRNA-centric regulatory network</h3>}/>
            </Tabs.TabPane>
            <Tabs.TabPane tab="lncRNA-PCG" key="4">
              <h3>Genes in lncRNA-PCG generally interactive network
              </h3>
              <p> A total of 17937 lncRNAs and 20343 PCGs are recorded in this network.</p>
            </Tabs.TabPane>
          </Tabs>
        </Collapse.Panel>
        <Collapse.Panel header={'ncFANs-eLnc'}>
          <JYTable {...getSELnc()} btns={[]} title={()=><h3>The number of cells/tissues that the pre-annotated enhancers are involved:</h3>}/>
        </Collapse.Panel>
      </Collapse>
    </div>
  }
}
export default Statistics;
