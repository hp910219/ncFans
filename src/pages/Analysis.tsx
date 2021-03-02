import React from 'react';
import { Collapse, Icon, Alert, Tag, Divider} from 'antd';
import JYModel from './utils/JYModel';
import {
  jy_form_item, jy_tip,
  get_args,
  post_task, save_file,
} from '@/pages/utils/request';
import JYHelp from "@/pages/utils/JYHelp";
import Button from "antd/lib/button/button";
import Form from "antd/es/form/Form";
const action_name = 'ncFANs-NET';
const {Panel} = Collapse;
const GeneList = Form.create()(
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
        intype: 'Ensemble ID or Gene symbol',
        ex: 'PVT1\n' +
          'LINC00265\n' +
          'AL356356.1',
        defaultChecked: true,
        show_ex: true,
        Coexpression: {
          value: 'Adipose_Subcutaneous',
          advancedOpts: this.setItems('COEXP', 'Adipose_Subcutaneous')
        },
        Comethylation: {
          value: 'TCGA-ACC',
          advancedOpts: this.setItems('COMETHY', 'TCGA-ACC')
        },
        ['lncRNA-centric regulatory']: {
          value: 'transcription factor;miRNA;ceRNA;RNA-binding proteins;RNA-DNA triplex'.split(','),
          advancedOpts: this.setItemsLnc('transcription factor;miRNA;ceRNA;RNA-binding proteins;RNA-DNA triplex'.split(';'))
        },
        ['RF-based']: {
          value: 'RF',
          advancedOpts: this.setItemsRF()
        }
      };
    }
    getValueFromEvent = (e) => {
      console.log(e);
      if (Array.isArray(e)) return e;
      return e && e.fileList;
    };
    componentWillMount =()=>{
      // this.props.form.setFieldsValue({ex: true});
    };
    submitRq = (values) =>{
      let system_conf = window.system_conf || {};
      // if(values.ex) kobasdb += '/ex';
      values = {
        SPE: 'human',
        INFO: 'gencode.v33.annotation.info',
        PPI: 'human.ppi.v11.final.txt',
        BASIC: 'gencode.v33.nc.detail.txt',
        ...values,
      };
      let {
        COEXP_TYPE, COEXP_TYPE1, COEXP_TYPE_tumor, COEXP_TYPE_normal,
        COMETHY_TYPE, COMETHY_TYPE1, COMETHY_TYPE_cancer, COMETHY_TYPE_normal,
        LncRnet_TYPE } = values;
      COEXP_TYPE = COEXP_TYPE_normal || COEXP_TYPE_tumor || COEXP_TYPE1;
      COMETHY_TYPE = COMETHY_TYPE_cancer || COMETHY_TYPE_normal || COMETHY_TYPE1;

      if(COEXP_TYPE) {
        values = {...values,  COEXP_TYPE};
      }
      if(COMETHY_TYPE) {
        values = {...values, COMETHY_TYPE};
      }
      if(LncRnet_TYPE) {
        if(LncRnet_TYPE.indexOf('transcription factor') > -1){
          values = {...values, CONTENT_TF: 'YES'};
        }
        if(LncRnet_TYPE.indexOf('miRNA') > -1){
          values = {...values, CONTENT_MIRNA: 'YES'};
        }
        if(LncRnet_TYPE.indexOf('ceRNA') > -1){
          values = {...values, CONTENT_ceRNA: 'YES'};
        }
        if(LncRnet_TYPE.indexOf('RNA-binding proteins') > -1){
          values = {...values, CONTENT_RBP: 'YES'};
        }
        if(LncRnet_TYPE.indexOf('RNA-DNA triplex') > -1){
          values = {...values, CONTENT_DNA: 'YES'};
        }
      }
      let delKeys = [
        'COEXP_TYPE1', 'COEXP_TYPE_tumor', 'COEXP_TYPE_normal',
        'COMETHY_TYPE1', 'COMETHY_TYPE_cancer', 'COMETHY_TYPE_normal',
        'LncRnet_TYPE', 'LPP_TYPE',
        'filter_genes', 'infile-file', 'infile'
      ];
      delKeys.map(k=> {
        delete values[k]
      });
      console.log(values);
      post_task('/ncfans', values, (res)=>{
        this.setState({disabled: false});
        let {data, status} = res;
        if(data) this.props.history.push('/retrieve/?taskid=' + data.task_id);
        // if(data) window.location.href = window.location.origin + '/kobas3/retrieve/?taskid='+ data.task_id;
        //if(data) jy_tip('Your task is submitted. Taskid is ' +  data.task_id + '. Paste the taskid to the home page to retrieve the result. ', 'success', 0);
        else jy_tip(JSON.stringify(res));
      })
    };
    handleCreate = (form)=>{
      this.setState({disabled: true});
      // this.props.history.push('/retrieve/?taskid=demo');
      // return;
      form.validateFields((err, values)=>{
        if(err) return;
        let {infile, filter_genes} = values;
        // if(use_ko){values['species'] = 'ko'; delete values.use_ko}
        values['CHECK_FILTER'] = 'NO';
        if(values.intype) values.intype = values.intype.trim();
        infile = infile.trim();
        if(values['infile-file']){
          let file_item = values['infile-file'][0];
          let {response} = file_item;
          //console.log(file_item, response);
          values['INPUT_NC'] = response.path;
          this.saveFilterGenes(values);
        }else {
          if(!infile) {
            jy_tip('Input your data or Upload a file');
            return;
          }
          save_file({content: infile, file_name: 'INPUT_NC'}, (res)=>{
            let {path} = res;
            if(path){
              values['INPUT_NC'] = path;
              this.saveFilterGenes(values);
            }else jy_tip(JSON.stringify(res));
          })
        }
      })
    };
    saveFilterGenes = (values)=>{
      let {filter_genes} = values;
      if(filter_genes) {
        save_file({content: filter_genes, file_name: 'Filter_genes'}, (res)=>{
          let {path: path1} = res;
          if(path1){
            values['Filter_list'] = path1;
            values['CHECK_FILTER'] = 'YES';
            this.submitRq(values);
          }else jy_tip(JSON.stringify(res));
        })
      }
      else this.submitRq(values);
    };
    clearExample = ()=>{
      this.setState({example: ''});
    };
    showExample= ()=>{
      let {example, btn_text, ex} = this.state;
      example = ex;
      this.setState({example, btn_text})
    };
    setItems = (prefix, value)=>{
      let arr1 = [];
      for(let i = 3; i <= 9; i += 1){
        arr1 = [...arr1, {text: i/10, value: i/10}];
      }
      let advancedOpts = [
        {
          label: 'Correlation coefficient between ncRNA and PCG',
          field: prefix + '_R_nc', initialValue: 0.4,
          tag: 'select',
          items: arr1
        },
        {
          label: 'Correlation coefficient between PCG and PCG',
          field: prefix + '_R_pc', initialValue: 0.4,
          tag: 'select',
          items: arr1
        },
        {
          label: <span>Topological Overlap Measure (TOM) similarity cutoff ([0, 0.2]) <a href="/help/?#Q4" target={'_blank'}><Icon type="question-circle" /></a></span>, field: prefix + '_TOM', initialValue: 0.01
        },
      ];
      if(value.indexOf('all') > -1){

        advancedOpts = [
          {...advancedOpts[0], initialValue: 0.5},
          {...advancedOpts[1], initialValue: 0.6},
          {
            label: `The proportion of specific networks a pair of genes should be ${prefix === 'COEXP'? 'co-expressed': 'co-methylated'} in (default: 0.3 range:[0.1-1.0]): `,
            field: prefix + '_OVERALL_NUM', initialValue: 0.5
          },
          {
            label: prefix + '_OVERALL_TOM', field: prefix + '_OVERALL_TOM', initialValue: 0.01,
            tag: 'radio',
            items: [0, 0.01, 0.1]
          },
        ];
      }
      return advancedOpts;
    };
    setItemsLnc = (value) =>{
      let advancedOpts = [];
      if(value.indexOf('transcription factor') > -1){

      }
      if(value.indexOf('miRNA') > -1){
        console.log(value);
        advancedOpts = [
          ...advancedOpts,
          {
            label: 'miRANDA score (continuously range from 140 to 170)', field: 'miR_SCORE',
            initialValue: 150
          },
        ]
      }
      if(value.indexOf('ceRNA') > -1){
        advancedOpts = [
          ...advancedOpts,
          {
            label: 'FDR (continuously range from 1e-100 to 0.05)', field: 'ceP',
            initialValue: '1e-10'
          },
          {
            label: 'MuTAME score (continuously range from 100 to 10000)', field: 'ceM',
            initialValue: '10000'
          },
        ]
      }
      if(value.indexOf('RNA-binding proteins') > -1){
        advancedOpts = [
          ...advancedOpts,
          {
            label: 'lncPro score: continuously from 50 to 100', field: 'lncPro_SCORE',
            initialValue: '80'
          },
        ]
      }
      return advancedOpts
    };
    setItemsRF = ()=>{
      return [
        {
          label: 'Possibility of LncRNA-PCG interaction generated by Random Forest：continuously from 0.6 to 0.95',
          field: 'LPP_INDEX',
          initialValue: 0.8
        },
      ]
    };
    render(){
      const {form} = this.props;
      const {getFieldDecorator} = form;
      const table_style = {width: '30%', margin: '0 30%'};
      const formItemLayout = {labelCol: 24, wrapperCol: 24};
      let user_input_items = [

        {
          label: <span>
            <span style={{'color': 'red'}}>*</span> Input &nbsp;
            <span style={{'color': 'red'}}>{this.state.intype}</span>
            &nbsp;
            <Button onClick={()=>this.showExample()} size={'small'} type={'primary'}>{this.state.btn_text}</Button>
            &nbsp;
            <Button onClick={()=>this.clearExample()} size={'small'} icon={'rest'}/>
          </span>,
          field: 'infile', required: false, initialValue: this.state.example,
          tag: 'textarea', rows: 10,
          placeholder: 'Input your data here or Upload a file below',
          ...formItemLayout
        },
        {
          label: 'Or upload a file',
          field: 'infile-file', required: false, initialValue: '',
          tag: 'upload',
          multiple: false,
          ...formItemLayout,
          getValueFromEvent: this.getValueFromEvent
        },
        {
          label: 'If you want to specific coding genes in your network, please upload (Optional)',
          placeholder: 'If you want to specific coding genes in your network, please upload (Optional)',
          field: 'filter_genes',  tag: 'textarea', rows:5
        },
      ];
      let network_items = [
        {
          field: 'Coexpression',
          initialValue: ['single-normal', 'Adipose_Subcutaneous'],
          prefix: 'COEXP',
          items: [
            {
              is_group: true,
              items: [
                {
                  span: 7,
                  initialValue: 'single_normal',
                  tag: 'radio', field: 'COEXP_TYPE1', items: [{text: 'Normal tissue-specific network', value: 'single_normal'}]
                },
                {
                  span: 6,
                  size: 'small',
                  initialValue: 'Adipose_Subcutaneous',
                  tag: 'select', field: 'COEXP_TYPE_normal', items: ('Adipose_Subcutaneous;Adipose_Visceral;' +
                    'Adrenal_Gland;Artery_Aorta;Artery_Coronary;Artery_Tibial;Bladder;' +
                    'Brain_Amygdala;Brain_Anterior_cingulate_cortex;Brain_Caudate;' +
                    'Brain_Cerebellar_Hemisphere;Brain_Cerebellum;Brain_Cortex;Brain_Frontal_Cortex;' +
                    'Brain_Hippocampus;Brain_Hypothalamus;Brain_Nucleus_accumbens;Brain_Putamen;' +
                    'Brain_Spinal_cord;Brain_Substantia_nigra;Breast_Mammary_Tissue;Cells_Cultured_fibroblasts;' +
                    'Cells_EBV-transformed_lymphocytes;Cervix_Ectocervix;Cervix_Endocervix;Colon_Sigmoid;Colon_Transverse;' +
                    'Esophagus_Gastroesophageal_Junction;Esophagus_Mucosa;Esophagus_Muscularis;Fallopian_Tube;' +
                    'Heart_Atrial_Appendage;Heart_Left_Ventricle;Kidney_Cortex;Liver;Lung;Minor_Salivary_Gland;' +
                    'Muscle_Skeletal;Nerve_Tibial;Ovary;Pancreas;Pituitary;Prostate;Skin_Not_Sun_Exposed;Skin_Sun_Exposed;' +
                    'Small_Intestine_Terminal_Ileum;Spleen;Stomach;Testis;Thyroid;Uterus;Vagina;Whole_Blood')
                    .split(';')
                    .map((t)=>{
                      return {value: t, label: t}
                    })
                },
              ]
            },
            {
              is_group: true,
              marginBottom: 10,
              items: [
                {
                  span: 6,
                  tag: 'radio', field: 'COEXP_TYPE1', items: [ {text: 'Cancer type-specific network', value: 'single_tumor'}],
                  onChange: (e)=>{
                    console.log(e);
                    let {value} = e.target;
                    if(value === 'single_tumor') form.setFieldsValue({COEXP_TYPE_normal: '', COEXP_TYPE_tumor: 'TCGA-ACC'});
                    else if(value === 'single_normal') form.setFieldsValue({COEXP_TYPE_tumor: '', COEXP_TYPE_normal: 'TCGA-ACC'});
                    else form.setFieldsValue({COEXP_TYPE_tumor: '', COEXP_TYPE_normal: ''});

                    let advancedOpts = this.setItems('COEXP', value);
                    this.setState({['Coexpression']: { value, advancedOpts }});
                  }
                },
                {
                  span: 6,
                  size: 'small',
                  tag: 'select', field: 'COEXP_TYPE_tumor',
                  items: ('TCGA-ACC;TCGA-BLCA;TCGA-BRCA;TCGA-CESC;TCGA-CHOL;TCGA-COAD;TCGA-DLBC;TCGA-ESCA;' +
                    'TCGA-GBM;TCGA-HNSC;TCGA-KICH;TCGA-KIRC;TCGA-KIRP;TCGA-LAML;TCGA-LGG;TCGA-LIHC;TCGA-LUAD;' +
                    'TCGA-LUSC;TCGA-MESO;TCGA-OV;TCGA-PAAD;TCGA-PCPG;TCGA-PRAD;TCGA-READ;' +
                    'TCGA-SARC;TCGA-SKCM;TCGA-STAD;TCGA-TGCT;TCGA-THCA;TCGA-THYM;TCGA-UCEC;TCGA-UCS;TCGA-UVM')
                    .split(';')
                    .map((t)=>{return {value: t, label: t}})
                },
              ]
            },
            {
              tag: 'radio', field: 'COEXP_TYPE1', items: [{
                text: <span>
                  Overall  normal network <JYHelp title={
                    'What does “overall” mean? A pair of genes co-expressed in a certain number of tissues or cancers will be considered to be overall co-expressed.'}/></span>, value: 'Overall_Normal'}],
              marginBottom: 15,
            },
            {
              tag: 'radio', field: 'COEXP_TYPE1', items: [{text: <span>Overall cancer network <JYHelp title={'What does “overall” mean? A pair of ncRNA and PCG co-expressed in a certain number of tissues or cancers will be considered to be overall co-expressed.'}/></span>, value: 'Overall_Cancer'}],
              marginBottom: 10,
              onChange: (e)=>{
                console.log(e);
                let {value} = e.target;
                if(value === 'single_tumor') form.setFieldsValue({COEXP_TYPE_normal: '', COEXP_TYPE_tumor: 'TCGA-ACC'});
                else if(value === 'single_normal') form.setFieldsValue({COEXP_TYPE_tumor: '', COEXP_TYPE_normal: 'TCGA-ACC'});
                else form.setFieldsValue({COEXP_TYPE_tumor: '', COEXP_TYPE_normal: ''});

                let advancedOpts = this.setItems('COEXP', value);
                this.setState({['Coexpression']: { value, advancedOpts }});
              }
            },

          ]
        },
        {
          field: 'Comethylation',
          prefix: 'COMETHY',
          items: [
            {
              is_group: true,
              items: [
                {
                  span: 9,
                  tag: 'radio', field: 'COMETHY_TYPE1', items: [{text: 'Methylation type and region-specific network', value: 'single_normal'}],
                  onChange: (e)=>{
                    let {value} = e.target;
                    if(value === 'single_cancer') form.setFieldsValue({COMETHY_TYPE_cancer: 'TCGA-ACC', COMETHY_TYPE_normal: ''});
                    else if(value === 'single_normal') form.setFieldsValue({COMETHY_TYPE_cancer: '', COMETHY_TYPE_normal: 'mC_Downstream'});
                    else  form.setFieldsValue({COMETHY_TYPE_cancer: '', COMETHY_TYPE_normal: ''});

                    let advancedOpts = this.setItems('COMETHY', value);
                    this.setState({['Comethylation']: { value, advancedOpts }});
                  }
                },
                {
                  span: 6,
                  size: 'small',
                  tag: 'select', field: 'COMETHY_TYPE_normal',
                  items: 'mC_Downstream;mCG_Downstream;mC_GeneBody;mCG_GeneBody;mCG_Promoter;mCH_Downstream;mCH_GeneBody;mCH_Promoter;mC_Promoter'
                    .split(';').map((t)=>{return {value: t, label: t}}),
                  items1: [
                    {text: '', value: ''},
                    {text: '', value: ''},
                    {text: '', value: ''},
                    {text: '', value: ''},
                  ]
                },
                {
                  span: 3,
                  tag: 'text',
                  text: <span>
                    &nbsp;
                    <JYHelp title={'mC_Downstream(C methylation in downstream region); mCG_Downstream(CG methylation in downstream region); mC_GeneBody(C methylation in genebody);\n' +
                    'mCG_GeneBody(CG methylation in genebody);\n' +
                    'mCG_Promoter(CG methylation in promoter); \n' +
                    'mCH_Downstream(CH methylation in downstream region); mCH_GeneBody(CH methylation in genebody);\n' +
                    'mCH_Promoter(CH methylation in promoter);\n' +
                    'mC_Promoter(C methylation in promoter)'}/>
                  </span>
                }
              ]
            },
            {
              is_group: true,
              marginBottom: '10px',
              items: [

                {
                  span: 6,
                  initialValue: 'single_cancer',
                  tag: 'radio', field: 'COMETHY_TYPE1', items: [ {text: 'Cancer type-specific network', value: 'single_cancer'}],
                },
                {
                  span: 6,
                  size: 'small',
                  initialValue: 'TCGA-ACC',
                  tag: 'select', field: 'COMETHY_TYPE_cancer',
                  items: ('TCGA-ACC;TCGA-BLCA;TCGA-BRCA;TCGA-CESC;TCGA-CHOL;TCGA-COAD;TCGA-DLBC;TCGA-ESCA;' +
                    'TCGA-GBM;TCGA-HNSC;TCGA-KICH;TCGA-KIRC;TCGA-KIRP;TCGA-LAML;TCGA-LGG;TCGA-LIHC;TCGA-LUAD;' +
                    'TCGA-LUSC;TCGA-MESO;TCGA-OV;TCGA-PAAD;TCGA-PCPG;TCGA-PRAD;TCGA-READ;' +
                    'TCGA-SARC;TCGA-SKCM;TCGA-STAD;TCGA-TGCT;TCGA-THCA;TCGA-THYM;TCGA-UCEC;TCGA-UCS;TCGA-UVM')
                    .split(';')
                    .map((t)=>{return {value: t, label: t}})
                },
              ]
            },
            {
              tag: 'radio', field: 'COMETHY_TYPE1', items: [{text: 'Overall normal network', value: 'Overall_Normal'}],
              marginBottom: 15,
            },
            {
              tag: 'radio', field: 'COMETHY_TYPE1', items: [{text: 'Overall cancer network', value: 'Overall_Cancer'}],
              marginBottom: 10,
              onChange: (e)=>{
                let {value} = e.target;
                if(value === 'single_cancer') form.setFieldsValue({COMETHY_TYPE_cancer: 'TCGA-ACC', COMETHY_TYPE_normal: ''});
                else if(value === 'single_normal') form.setFieldsValue({COMETHY_TYPE_cancer: '', COMETHY_TYPE_normal: 'mC_Downstream'});
                else  form.setFieldsValue({COMETHY_TYPE_cancer: '', COMETHY_TYPE_normal: ''});

                let advancedOpts = this.setItems('COMETHY', value);
                this.setState({['Comethylation']: { value, advancedOpts }});
              }
            },

          ]
        },

        {
          field: 'lncRNA-centric regulatory',
          title: 'lncRNA-centric regulatory network(LncRnet)',
          initialValue: 'all',
          items: [
            {text: 'Network content  included', value: 'all'},
          ],
          prefix: 'LncRnet',
          tip: '(LncRnet)',
          details: [
            {
              tag: 'checkbox',
              title: '',
              text: 'transcription factor;miRNA;ceRNA;RNA-binding proteins;RNA-DNA triplex'
            },
          ],
        },
        {
          field: 'RF-based',
          title: 'LncRNA-PCG network based on random forest (RF-based)',
          initialValue: 'RF',
          prefix: 'LPP',
          advancedOpts: [
            {
              label: 'RF produced possibility : continuously from 0.6 to 0.95',
              field: 'LPP_INDEX',
              initialValue: 0.8
            },
          ]
        },
      ];
      let {activateKeys} = this.state;
      activateKeys = activateKeys || [];
      return (
        <JYModel
          action={this.state.action_title}
        >
          <Form style={{width: '100%', margin: '0 auto'}}  {...formItemLayout}>

            <Collapse
              bordered={true}
              style={{ margin: '0 auto'}}
              defaultActiveKey={'1'}
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
              <Panel header={<span>Network selection <JYHelp title={'One or several networks can be chosen to discover the connected PCGs of the query ncRNAs. LncRNA-centric regulatory network and RF-based predicted network only support lncRNAs, while the other two networks can work for multiple kinds of ncRNAs if they have sufficient expression or methylation level.'}/></span>} key="2">
                <Collapse defaultActiveKey={['network0', 'network1', 'network2']}>
                  {
                    network_items.map((item, index)=>{
                      let {field, details, prefix, items, title} = item;
                      let networkKey = 'network' + index;
                      details = details || [];
                      return <Panel
                        disabled={index === 3}
                        header={<h4 >{ title || (field + ' network')}</h4>}
                        key={networkKey}
                        extra={
                          jy_form_item({
                            getFieldDecorator,
                            tag: 'switch',
                            field: 'CHECK_' + prefix,
                            style: {marginTop: "-19px"},
                            defaultChecked: true,
                            checkedChildren: 'YES',
                            unCheckedChildren: 'NO',
                            initialValue: 'YES',
                            onChange: (checked)=>{
                              // form.setFieldsValue({[item.field]: checked? item.initialValue: ''});

                              if(!checked) {
                                activateKeys = activateKeys.filter((key)=> key !== networkKey);
                                form.setFieldsValue({['CHECK_' + prefix]: 'NO'});
                                this.setState({[field]: null});
                              } else {
                                if(field ==='RF-based'){
                                  this.setState({[field]: {
                                      value: 'RF',
                                      advancedOpts: this.setItemsRF()
                                    }})
                                }
                                activateKeys = [...activateKeys, networkKey];
                              }
                              this.setState({ activateKeys});
                            }
                          })
                        }
                      >
                        {
                          index === 0? items.map(item1=>jy_form_item({...item1, getFieldDecorator})):
                          index === 1? items.map(item1=>jy_form_item({...item1, getFieldDecorator})):
                              (<div>
                                {jy_form_item({...item, getFieldDecorator, field: prefix + '_TYPE', tag: 'radio'})}
                                <br/>
                                {
                                  details.map((d)=>{
                                    let {text, tag} = d;
                                    let detailItems = text.split(';');
                                    return jy_form_item({
                                      style: {marginLeft: '23px'},
                                      field: prefix + '_TYPE',
                                      getFieldDecorator,
                                      tag: tag,
                                      // label: item.field + ' network',
                                      // field: 'db',
                                      ...formItemLayout,
                                      items: detailItems,
                                      initialValue: detailItems,
                                      onChange: (e)=> {
                                        let value = e;
                                        if(e.target){
                                          value = e.target.value;
                                        }
                                        let advancedOpts = [];
                                        if(field === 'lncRNA-centric regulatory'){
                                          advancedOpts = this.setItemsLnc(value);
                                        }
                                        this.setState({[field]: { value, advancedOpts }});
                                      },
                                    })
                                  })
                                }
                              </div>)
                        }
                      </Panel>;
                    })
                  }
                </Collapse>
              </Panel>
              <Panel header="Advanced options (select network first)" key="3">
                {
                  network_items.map((nItem)=>{
                    let {field} = nItem;
                    let info = this.state[field];
                    if(info){
                      let {value, advancedOpts} = info;
                      if(Array.isArray(advancedOpts)){
                        return <Alert
                          style={{marginBottom: '10px'}}
                          type={'info'}
                          message={<h2>{field + ' network'}</h2>}
                          description={advancedOpts.map((advancedOpt)=>{
                            return jy_form_item({...advancedOpt, getFieldDecorator, ...formItemLayout})
                          })}
                        />
                      }
                    }
                    return '';
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

export default GeneList;
