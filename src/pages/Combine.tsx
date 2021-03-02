
import React from 'react';

import styles from './PredictedFunctions.css';
import Form from "antd/es/form";
import {examples, get_args, jy_form_item, jy_tip, post_task, get_task} from "@/pages/utils/request";
import Button from "antd/lib/button";
import JYModel from "@/pages/utils/JYModel";
import JYLoading from "@/pages/utils/JYLoading";
import {Alert, Collapse, Icon, Modal} from "antd";
import CoExpression from "@/pages/CoExpression";
const Combine = Form.create()(
  class extends React.Component{
    constructor(props){
      super(props);
      let args = get_args(location.search);
      console.log(args);
      this.state = {
        disabled: false,
        data: [],
        selected_items: [],
        ...args,
      };
    }
    componentWillMount =()=>{
      // this.props.form.setFieldsValue({ex: true});
      let {checkNetworks} = this.props;
      checkNetworks = checkNetworks || [];
      let CHECK_COEXP = checkNetworks.findIndex(item=> item.key === 'CHECK_COEXP') > -1;
      this.setState({CHECK_COEXP});
      let {taskid} = this.state;
      if(taskid === 'demo'){
        this.setState({visible: true, showResult: true});
      }
    };
    submitRq = (values) =>{
      let system_conf = window.system_conf || {};
      // if(values.ex) kobasdb += '/ex';
      let {taskid} = this.state;

      let {combination} = values;
      if(combination) {
        combination.map((c)=>{
          values = {...values, [c]: 'YES'}
        });
        delete values['combination'];
      }
      console.log(values);
      post_task('/ncfans/combine', {...values, task_id: taskid}, (res)=>{
        this.setState({disabled: false});
        let {data, status} = res;
        if(data) {
          let {task_id: combine_task_id} = data;
          this.resultCombine(combine_task_id);
          this.setState({visible: true, showResult: false});
        }
        // if(data) window.location.href = window.location.origin + '/kobas3/retrieve/?taskid='+ data.task_id;
        //if(data) jy_tip('Your task is submitted. Taskid is ' +  data.task_id + '. Paste the taskid to the home page to retrieve the result. ', 'success', 0);
        else jy_tip(JSON.stringify(res));
      })
    };
    resultCombine = (combine_task_id)=>{
      this.setState({loading: true});
      get_task(combine_task_id, (res)=>{
        let {data} = res;
        console.log('get_task data', data);
        if(data) {
          let {app_type, status, out_dir} = data;
          if(status === 'success') {
            this.setState({showResult: true, isRefresh: true});
          }
          else if(status === -1 || status === 'failed' ){
            this.setState({loading: false});
          }
          else this.resultCombine(combine_task_id);
          this.setState({app_type, task_info: data});
        } else {
          // clearInterval(timer);
          this.setState({loading: false});
          jy_tip(JSON.stringify(res));
        }
      });
    };
    handleCreate = (form, TYPE)=>{
      this.setState({disabled: true});
      // this.props.history.push('/retrieve/?taskid=demo');
      // return;
      form.validateFields((err, values)=>{
        if(err) return;
        this.submitRq({...values, TYPE})
      })
    };
    render(){
      let {form, checkNetworks, out_dir} = this.props;
      let {CHECK_COEXP, showResult, taskid, isRefresh} = this.state;
      const {getFieldDecorator} = form;
      const formItemLayout = {labelCol: 24, wrapperCol: 24};
      checkNetworks = checkNetworks || [];
      let combineItems = [
        {
          label: <h2>Network selection</h2>,
          field: 'combination', required: false,
          tag: 'checkbox',
          initialValue: checkNetworks.map((item)=>item.value),
          items: checkNetworks.map((item, index)=>{
            let {tab, value} = item;
            return {text: tab, value: value, style: {display: 'block', marginTop: '10px', marginLeft: index === 0? '1px': '0'}}
          }),
          onChange: (values)=>{
            CHECK_COEXP = values.findIndex(item=> item === 'CHECK_COEXP') > -1;
            if(!CHECK_COEXP) form.setFieldsValue({PCG2PCG: 'PPI'});
            this.setState({CHECK_COEXP});
          }
        },
        {
          label: 'PCG-PCG interaction',
          field: 'PCG2PCG', required: false,
          tag: 'radio',
          initialValue: 'COEXP',
          items: [
            {text: 'PCG-PCG co-expression', value: 'COEXP', disabled: !CHECK_COEXP, style: {display: 'block', marginTop: '10px'}},
            {text: 'PPI from STRING', value: 'PPI', style: {display: 'block', marginTop: '10px'}},
            {text: 'Coexp-PPI overlap', value: 'COEXP_PPI_OVER', disabled: !CHECK_COEXP, style: {display: 'block', marginTop: '10px'}},
            {text: 'Coexp-PPI merge', value: 'COEXP_PPI_MERGE', disabled: !CHECK_COEXP, style: {display: 'block', marginTop: '10px'}},
          ]
        },
      ];
      return (
          <div>
            <Form style={{width: '30%', margin: '0 auto'}}  {...formItemLayout}>
              {
                combineItems.map((item, index)=>{
                  return jy_form_item({
                    ...item,
                    getFieldDecorator,
                    marginBottom: '10px',
                    ...formItemLayout
                    //initialValue: block_info[item.field] || item.initialValue
                  });
                })
              }
              <br/>
              <div style={{width: '50%', textAlign: 'left'}}>
                <Button type={'primary'} onClick={()=>this.handleCreate(form, 'Merge')} disabled={this.state.disabled}>
                  Merge
                </Button>
                &nbsp;
                <Button type={'primary'} onClick={()=>this.handleCreate(form, 'Overlap')} disabled={this.state.disabled}>
                  Overlap
                </Button>
              </div>

            </Form>
            <Modal
              title={<span>
                {
                  showResult? (<span>Combine is completed.</span>):
                    <span>Combine is running<JYLoading/></span>
                }
              </span>}
              visible={this.state.visible}
              width={900}
              okText={'OK'}
              okButtonProps={{ disabled: !showResult}}
              cancelButtonProps={{ disabled: !showResult}}
              onCancel={()=>{
                if(showResult) this.setState({visible: false});
              }}
              onOk={()=>{
                if(showResult) this.setState({visible: false});
              }}
            >
              {
                showResult? (<div><CoExpression data={{isRefresh, dir: (out_dir)+'/Combine'}}/></div>):
                  <div>
                    <p>
                      It may take  1~2 minutes and will automatically load the combine result.
                      <br/>
                      Please don't close this page until the result is completed.
                    </p>
                  </div>
              }
            </Modal>
          </div>
      )
    }
  }
);
export default Combine;
