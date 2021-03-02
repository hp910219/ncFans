import React from 'react';
import { Collapse, Icon, Alert, Tooltip, Tag} from 'antd';
import JYModel from './utils/JYModel';
import {
  jy_form_item, jy_tip,
  get_args,
  post_task,
  string2array, down_file
} from '@/pages/utils/request';
import uuid from 'react-uuid';
import Button from "antd/lib/button/button";
import Form from "antd/es/form/Form";
const action_name = 'ncFANs-CHIP';
const {Panel} = Collapse;
const getChipSpecies = ()=>{
  let text = 'species\tchip_type\n' +
    'Human\tHG-U133A_2\n' +
    'Human\tHG-U133A\n' +
    'Human\tHG-U133B\n' +
    'Human\tHG-U133_Plus_2\n' +
    'Human\tHG-U219\n' +
    'Human\tHG_U95Av2\n' +
    'Human\tHG_U95B\n' +
    'Human\tHG_U95C\n' +
    'Human\tHG_U95D\n' +
    'Human\tHG_U95E\n' +
    'Human\tHT_HG-U133_Plus_PM\n' +
    'Human\tHuEx-1_0-st-v2\n' +
    'Human\tHuGene-1_0-st-v1\n' +
    'Human\tHuGene-2_0-st-v1\n' +
    'Human\tHuGene-2_1-st-v1\n' +
    'Mouse\tMOE430A\n' +
    'Mouse\tMoGene-2_0-st-v1\n' +
    'Mouse\tMouse430_2\n' +
    'Mouse\tMoGene-1_0-st-v1\n' +
    'Mouse\tMoGene-1_1-st-v1\n' +
    'Mouse\tHT_MG-430_PM\n' +
    'Mouse\tMG_U74Av2\n' +
    'Mouse\tMG_U74Bv2\n' +
    'Mouse\tMG_U74Cv2\n' +
    'Mouse\tMoEx-1_0-st\n' +
    'Mouse\tMTA-1_0\n' +
    'Mouse\tMOE430B\n' +
    'Mouse\tMouse430A_2';
  let items = string2array(text);
  let options = [];
  items.map((item)=>{
    let {species, chip_type} = item;
    let oIndex = options.findIndex((o) => o.value === species);
    let chipItem = {value: chip_type, label: chip_type};
    if(oIndex === -1) {
      options = [
        ...options,
        {value: species, label: species, children: [chipItem]}
      ];
    }  else {
      let {children} = options[oIndex];
      children = children || [];
      options[oIndex].children = [...children, chipItem];

    }
  });
  return options;
};
// console.log(uuid.toString());
const Chip = Form.create()(
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
        disabledTOM_CUTOFF: true,
        do_coexp: true,
        do_dif: true,
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
      if (Array.isArray(e)) return e;
      return e && e.fileList;
    };
    getFileList = (fileList) => {
      fileList = fileList || [];
      return fileList.map(ff=>ff.response.path)
    };
    componentWillMount =()=>{
      // this.props.form.setFieldsValue({ex: true});
    };
    checkSwitch = (v) =>{
      if(v === 'yes') return v;
      if(v === true) return 'yes';
      if(v === 'no') return v;
      if(v === undefined) return 'no';
      if(v === false) return 'no';
      return 'no';
    };
    handleCreate = (form)=>{

      // this.props.history.push('/retrieve/?taskid=demo');
      // return;
      form.validateFields((err, values)=>{
        if(err) return;

        let {species, treat, control, exp_filter, do_dif, do_coexp} = values;
        treat = this.getFileList(treat);
        control = this.getFileList(control);
        if(control === '') delete values['control'];
        let chiptype = species[1];
        species = species[0].toLowerCase();
        exp_filter = this.checkSwitch(exp_filter);
        do_dif = this.checkSwitch(do_dif);
        do_coexp = this.checkSwitch(do_coexp);
        values = {...values, chiptype, species, treat, control, exp_filter, do_dif, do_coexp};
        console.log(values);
        this.setState({disabled: true});
        this.submitRq(values);
      })
    };
    submitRq = (values) =>{
      post_task('/ncfans/chip', values, (res)=>{
        this.setState({disabled: false});
        let {data, status} = res;
        if(data) this.props.history.push('/retrieve/?taskid=' + data.task_id);
        // if(data) window.location.href = window.location.origin + '/kobas3/retrieve/?taskid='+ data.task_id;
        //if(data) jy_tip('Your task is submitted. Taskid is ' +  data.task_id + '. Paste the taskid to the home page to retrieve the result. ', 'success', 0);
        else jy_tip(JSON.stringify(res));
      })
    };


    setItems = (prefix, value)=>{
      let arr1 = [];
      for(let i = 3; i <= 9; i += 1){
        arr1 = [...arr1, {text: i/10, value: i/10}];
      }
      let advancedOpts = [
        {
          label: prefix + '_R_nc (Nc-Pcg correlation coefficient  (default: 0.4): range from 0.3 to 0.9 and break=0.1)',
          field: prefix + '_R_nc', initialValue: 0.4,
          tag: 'select',
          items: arr1
        },
        {
          label: prefix + '_R_pc (Pcg-pcg correlation coefficient (default: 0.4): range from 0.3 to 0.9 and break=0.1)',
          field: prefix + '_R_pc', initialValue: 0.4,
          tag: 'select',
          items: arr1
        },
        {
          label: prefix + '_TOM (TOM cutoff (default: 0.01): range from 0-0.3 ; continuous variable)', field: prefix + '_TOM', initialValue: 0.01
        },
      ];
      if(value.indexOf('all') > -1){
        advancedOpts = [
          advancedOpts[0],
          advancedOpts[1],
          {
            label: prefix + '_OVERALL_NUM (Minimum coexpression frequency (default: 6): range from 3 to 30 (int))',
            field: prefix + '_OVERALL_NUM', initialValue: 5,
          },
          {
            label: prefix + '_OVERALL_TOM', field: prefix + '_OVERALL_TOM', initialValue: 0.01,
            tag: 'radio',
            items: [0.01, 0.1]
          },
        ];
      }
      return advancedOpts;
    };
    setItemsLnc = (value) =>{
      console.log('sss', value);
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
            initialValue: '1e-08'
          },
          {
            label: 'MuTAME score (continuously range from 100 to 10000)', field: 'ceM',
            initialValue: '1000'
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
          label: 'RF produced possibility : continuously from 0.6 to 0.95',
          field: 'LPP_INDEX',
          initialValue: 0.8
        },
      ]
    };
    getFileListChip = (field, arr)=>{
      return arr.map((path, index)=>{
        let names = path.split('/');
        let name = names[names.length-1];
        let file_info = {
          uid: field + index,
          name,
          path,
          status: 'done'
        };
        return {...file_info, response: file_info}
      })
    };
    getTreatExFiles = ()=>{
      return this.getFileListChip('treat', [
        '/mnt/JINGD/example/ncfans/GSM424317.CEL.gz',
        '/mnt/JINGD/example/ncfans/GSM424318.CEL.gz',
      ]);
    };
    getControlExFiles = ()=>{
      return this.getFileListChip('control', [
        '/mnt/JINGD/example/ncfans/GSM424314.CEL.gz',
        '/mnt/JINGD/example/ncfans/GSM424315.CEL.gz',
        '/mnt/JINGD/example/ncfans/GSM424316.CEL.gz',
      ])
    };
    render(){
      const {form} = this.props;
      const {getFieldDecorator} = form;
      const table_style = {width: '30%', margin: '0 30%'};
      const formItemLayout = {labelCol: 24, wrapperCol: 24};
      let user_input_items = [
        {
          label: 'Species and chip type',
          field: 'species',
          initialValue: ['Human', 'HG-U133A_2'],
          tag: 'cascader',
          required: true,
          options: getChipSpecies(),
        },
        {
          label: <span>
            Upload your CEL files of treat group (Required,  one CEL file (.gz) for one sample,
            please do not zip all the CEL file together).
            <span>
              &nbsp;
              <Button
                type={'primary'}
                size={'small'} icon={'file'} onClick={()=>{
                let fileList = this.getTreatExFiles();
                this.setState({treat: fileList})
              }}>Load example</Button> &nbsp;
              <Button size={'small'} icon={'download'} onClick={()=>{
                down_file({file_path: '/mnt/JINGD/example/ncfans/GSM424317.CEL.gz'})
              }}>example</Button>
            </span>
            &nbsp;
            <Tooltip title={'The CEL files need to be calculated at both coding and noncoding gene level. '}>
              <Tag
                onClick={(e) => e.preventDefault()}
                color={'blue'} disabled={true}><Icon type={'question'}/></Tag>
            </Tooltip>
          </span>,
          field: 'treat', required: true, initialValue: '',
          tag: 'upload',
          multiple: true,
          ...formItemLayout,
          getValueFromEvent: this.getValueFromEvent,
          fileList: this.state.treat,
          onChange: (s)=>{
            console.log(s);
          }
        },
        {
          label: <span>
            Upload your CEL files of control group (Optional but required for differential expression analysis,  one CEL file (.gz) for one sample, please do not zip all the CEL file together).
            <span>
              &nbsp;
              <Button
                type={'primary'}
                size={'small'} icon={'file'} onClick={()=>{
                let fileList = this.getControlExFiles();
                this.setState({control: fileList})
              }}>Load example</Button> &nbsp;
              <Button size={'small'} icon={'download'} onClick={()=>{
                down_file({file_path: '/mnt/JINGD/example/ncfans/GSM424314.CEL.gz'})
              }}>example</Button>
            </span>
            &nbsp;
            <Tooltip title={'If you need to do differential expression analysis, please upload your CEL files  of control group here. '}>
              <Tag
                onClick={(e) => e.preventDefault()}
                color={'blue'}><Icon type={'question'}/></Tag>
            </Tooltip>
          </span>,
          field: 'control', required: false, initialValue: '',
          tag: 'upload',
          multiple: true,
          ...formItemLayout,
          getValueFromEvent: this.getValueFromEvent,
          fileList: this.state.control
        },

      ];
      let network_items = [
        {
          title: <span>
            Expression profile calculation &nbsp;
            <Tooltip title={'Set the expression filter parameters to calculate expression profile of both PCGs and ncRNAs by use of re-annotated CDF. Make sure select the right chiptype above.'}>
              <Tag
                onClick={(e) => e.preventDefault()}
                color={'blue'}><Icon type={'question'}/>
              </Tag>
            </Tooltip></span>,
          field: 'exp_filter',
          defaultChecked: 'yes',
          items: [
            {
              required: false, field: 'exp_filter_method', label: 'Chose statistical method to filter the genes',
              tag: 'select',
              initialValue: 'mean',
              items: ['mean', 'median']
            },
            {
              field: 'exp_cutoff', label: 'Expression cutoff used to filter the genes with  low expression',
              initialValue: '0.1',
              tag: 'select',
              items: ['0.1', '0.5', 1]
            }
          ]
        },
        {
          title: <span>
            Differential expression analysis &nbsp;
            <Tooltip title={'Set the parameters of differential expression calculation to obtain differentially expressed PCGs and ncRNAs. To perform this analysis, you must upload the CEL files of both treat group and control group.'}>
              <Tag
                onClick={(e) => e.preventDefault()}
                color={'blue'}><Icon type={'question'}/>
              </Tag>
            </Tooltip></span>,
          field: 'do_dif',
          defaultChecked: false,
          items: [
            {
              required: false, field: 'difmethod', label: 'Differential analysis method',
              tag: 'select',
              initialValue: 'limma',
              items: [
                {text: 'limma', value: 'limma'},
                {text: 't test', value: 'ttest'},
                {text: 'Wilcoxon test', value: 'wilcoxon'}
              ]
            },
            {
              field: 'dif_adj', label: 'Adjust p-value cutoff',
              initialValue: '0.05',
              tag: 'select',
              items: ['0.001', '0.01', '0.05', '0.1']
            },
            {
              field: 'fc', label: 'Fold Change cutoff',
              initialValue: '1.5',
              tag: 'select',
              items: ['1.2', '1.5', '2']
            }
          ]
        },
        {
          title: <span>
            Co-expression network analysis &nbsp;
            <Tooltip title={'Set the parameters of constructing co-expression network to annotate the functions of ncRNAs. To perform this analysis, the sample size of your CEL files in total should be not less than 3.'}>
              <Tag
                onClick={(e) => e.preventDefault()}
                color={'blue'}><Icon type={'question'}/>
              </Tag>
            </Tooltip></span>,
          field: 'do_coexp',
          defaultChecked: false,
          items: [
            {
              required: false,
              field: 'sd_cutoff',
              label: <span>
                Coefficient of variation cutoff
                &nbsp;
                <Tooltip title={'Percentile cutoff used to filter the genes with expression of low variation'}>
                  <Tag color={'blue'}><Icon type={'question'}/></Tag>
                </Tooltip>
              </span>,
              tag: 'select',
              initialValue: 0.4,
              items: [
                {text: '25%', value: 0.25},
                {text: '30%', value: 0.3},
                {text: '35%', value: 0.35},
                {text: '40%', value: 0.4},
                {text: '45%', value: 0.45},
                {text: '50%', value: 0.5},
              ]
            },
            {
              field: 'coexp_cor', label: 'Absolute correlation coefficient cutoff',
              initialValue: 0.3,
              tag: 'select',
              items: [0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]
            },
            {
              field: 'coexp_adjp', label: 'Adjust p-value cutoff',
              initialValue: 0.05,
              tag: 'select',
              items: [0.01, 0.05, 0.001, 0.0001, 0.00001]
            },
            {
              required: false,
              field: 'tom',
              label: <span>
                Whether filter coexpression relationships with Topological Overlap Measure(TOM)
                &nbsp;
                <Tooltip title={'If select yes, it will cost several minutes to calculate'}>
                  <Tag color={'blue'}><Icon type={'question'}></Icon></Tag>
                </Tooltip>
              </span>,
              tag: 'select',
              initialValue: 'no',
              items: ['yes', 'no'],
              onChange: (value)=>{
                this.setState({disabledTOM_CUTOFF: value === 'no'})
              }
            },
            {
              required: false,
              field: 'tom_cutoff',
              disabled: this.state.disabledTOM_CUTOFF,
              label: <span>
                TOM value cutoff
                &nbsp;
                <Tooltip title={'Cutoff used to filter the co-expression relationships with low TOM values'}>
                  <Tag color={'blue'}><Icon type={'question'}/></Tag>
                </Tooltip>
              </span>,
              tag: 'select',
              initialValue: 0.05,
              items: [0.01, 0.03, 0.05, 0.1, 0.2]
            },
          ]
        },
      ];
      let {activateKeys} = this.state;
      activateKeys = activateKeys || ['exp_filter'];
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
              {
                network_items.map((item, index)=>{
                  let {title, field, items, defaultChecked} = item;
                  return <Panel
                    header={<h4>{title}</h4>}
                    key={field}
                    // disabled={this.state[field]}
                    extra={
                      jy_form_item({
                        getFieldDecorator,
                        tag: 'switch',
                        field: field,
                        style: {marginTop: "-19px"},
                        defaultChecked,
                        checkedChildren: 'yes',
                        unCheckedChildren: 'no',
                        initialValue: defaultChecked?'yes': 'no',
                        onClick: (checked)=>{
                          console.log('click', checked);
                          if(!checked) {
                            if(activateKeys.indexOf(field) === -1) {
                              activateKeys = [...activateKeys, field]
                            }
                            items = [];
                          }else activateKeys = activateKeys.filter((k) => k !== field);
                          this.setState({activateKeys, [field]: !checked});
                        }
                      })
                    }
                  >
                    {
                      items.map((item)=>{
                        return jy_form_item({...item, getFieldDecorator})
                      })
                    }
                  </Panel>;
                })
              }
            </Collapse>
            <br/>
            <Button type={'primary'} onClick={()=>this.handleCreate(form)} block={true} style={table_style} disabled={this.state.disabled}>Run</Button>
          </Form>
        </JYModel>
      )
    }
  }
);

export default Chip;
