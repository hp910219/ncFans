import React from 'react';
import {
  Breadcrumb, Button, Modal, Table, Icon, Menu, Layout
} from 'antd';
import "antd/lib/typography/Typography";
import {Link} from 'react-router-dom';
import {
  cmp,
  down_file,
  EditableCell,
  EditableFormRow,
  get_args,
  get_file_content,
  get_task,
  get_task_log,
  jy_tip,
  render_long_text,
  save_file
} from './utils/request';
import BasicInformation from "@/pages/BasicInformation";
import CoExpression from "@/pages/CoExpression";
import Combine from "@/pages/Combine";
import ChipRetrieve from "@/pages/ChipRetrieve";
import ElncRetrieve from "@/pages/elncRetrieve";
import {dict2params} from "@/pages/utils/request";
import Chip from "@/pages/ncFansChip";
import JYLoading from "@/pages/utils/JYLoading";

let ulStyle = {listStyle: 'none', paddingLeft: 0};
const { Header, Content, Footer, Sider } = Layout;

class Retrieve extends React.Component {
  constructor(props) {
    // To disabled submit button at the beginning.
    super(props);
    let args = get_args();
    let {taskid, tab} = args;
    this.state = {
      tab: tab || '0',
      task_info: null, content: '', loading: true, taskid, unmarked: [],
      activateKey: 'data',
      visible_Database: false,
    };
  }
  componentWillMount(){
    let {taskid} = this.state;
    if(taskid) this.resultRetrieve(taskid);
    else this.setState({loading: false});
  }

  resultRetrieve = ()=>{
    let {taskid} = this.state;
    let lncRnet = [
      {title: 'transcription factor', file_name: 'tf.tsv', key: 'CONTENT_TF'},
      {title: 'miRNA', file_name: 'mirna.tsv', key: 'CONTENT_MIRNA'},
      {title: 'ceRNA', file_name: 'ceRNA.tsv', key: 'CONTENT_ceRNA'},
      {title: 'RNA-binding proteins', file_name: 'rbp.tsv', key: 'CONTENT_RBP'},
      {title: 'RNA-DNA triplex', file_name: 'triplex.tsv', key: 'CONTENT_DNA'},
    ];
    let checkNetworks = [
      {tab: 'Coexpression', icon: 'appstore', key: 'CHECK_COEXP', value: 'COMBINE_COEXP', networkDir: '/coexp_out'},
      {tab: 'Comethylation', icon: 'tool', key: 'CHECK_COMETHY', value: 'COMBINE_COMETHY', networkDir: '/comethy_out'},
      {tab: 'LncRnet', icon: 'fork', key: 'CHECK_LncRnet', value: 'COMBINE_LNCRNET', networkDir: '/lncRnet_out', lncRnet},
      {tab: 'RF-based', icon: 'fork', key: 'CHECK_LPP', value: 'COMBINE_RFBASE', networkDir: '/RFnet_out'},
    ];
    // this.get_content('/tmp', {outfile: 'output_annotate_hmu.txt'});
    // this.get_content('/tmp', {outfile: 'output_annotate_zma.txt'});
    // this.get_content('/tmp', {outfile: 'output_annotate.txt'});
    // this.get_content('/tmp', {outfile: 'output_identify.txt'});
    // this.get_content('/tmp', {outfile: 'combination_results.tsv'});
    this.setState({loading: true});
    if(taskid === 'chip'){
      // let dir = '/BaiduNetdiskDownload/20201212';
      let dir = '/ncFans/6633a3158cf54c3f9583e64482a175a5';
      this.setState({
        loading: false, out_dir: dir,
        app_type: taskid,
        task_info: {status: 'success'}});
      return ''
    }
    if(taskid === 'elnc'){
      // let dir = '/BaiduNetdiskDownload/20201212';
      let dir = '/ncFans/a4240801d0b6472c807244bcc8a84d01';
      this.setState({
        loading: false, out_dir: dir,
        app_type: taskid,
        task_info: {status: 'success'}});
      return ''
    }
    if(taskid === 'demo'){
      let dir = '/mnt/data/ncFans/20201220';
      this.setState({
        loading: false, out_dir: dir,
        lncRnet,
        checkNetworks,
        app_type: 'net',
        task_info: {status: 'success'}});
      return ''
    }
    get_task(taskid, (res)=>{
      let {data} = res;
      console.log('get_task data', data);
      if(JSON.stringify(data) === '{}') this.setState({loading: false, task_info: {status: 'unavailable'}});
      else if(data) {
        let {app_type, request_data, out_dir, status, real_config_path} = data;
        if(status === 'success') {
          request_data = request_data || {};
          lncRnet = lncRnet.filter((item)=> request_data[item.key] === 'YES');
          checkNetworks = checkNetworks.filter((item)=> request_data[item.key] === 'YES');
          this.setState({checkNetworks, loading: false, out_dir, real_config_path, request_data, lncRnet});
        }
        else if(status === -1 || status === 'failed' ){
          this.setState({loading: false});
        }
        else this.resultRetrieve();
        this.setState({app_type, task_info: data});
      } else {
        // clearInterval(timer);
        this.setState({loading: false});
        jy_tip(JSON.stringify(res));
      }
    });

    // clearInterval(timer);
    get_task_log(taskid, (res)=>{
      let {data} = res;
      if(data) this.setState({task_log: data});
    })
  };

  download = () =>{
    let {file_path} = this.state;
    console.log(file_path);
    down_file({file_path});
  };

  render() {
    let {
      out_dir, real_config_path,
      taskid, task_info, task_log,
      checkNetworks,
      app_type, request_data
    } = this.state;

    let status_color = '';
    let status_text = 'submitted';
    let status = 'loading';
    let combine_task_id;
    if(task_info){
      status = task_info.status;
      combine_task_id = task_info.combine_task_id;
      if(task_info.status === 'failed' ) {status_color = '#f50'; status_text = 'Failed'}
      else if(task_info.status === 'success' ) {status_color = '#87d068'; status_text = 'Success'}
      else if(task_info.status === 'running' ) {status_color = '#2db7f5'; status_text = 'running'}
      else if(task_info.status === 'enquene' ) {status_color = '#108ee9'; status_text = 'in the queue'}
      else if(task_info.status === 'enqueue' ) {status_color = '#108ee9'; status_text = 'in the queue'}
      else if(task_info.status === 'enaqueue' ) {status_color = '#108ee9'; status_text = 'in the queue'}
      else if(task_info.status === 'unavailable' ) {status_color = '#108ee9'; status_text = 'not available'}
    }

    let basicInfoPath = out_dir + '/Basic_information.tsv';
    let GTEx_mean_exp = out_dir + '/GTEx_mean_exp.tsv';
    let TCGA_mean_exp = out_dir + '/TCGA_mean_exp.tsv';
    let menus = [
      {tab: 'Basic Information', icon: 'appstore', content: <BasicInformation data={{basicInfoPath, GTEx_mean_exp,TCGA_mean_exp}}/>},
      {
        tab: 'Individual network', icon: 'appstore',
        children: checkNetworks || []
      },
      {tab: 'Combine Network', icon: 'fork', content: <Combine out_dir={out_dir} checkNetworks={checkNetworks} taskid={taskid}/>},
    ];
    app_type = app_type || '';
    let {content, tab} = this.state;
    let defaultSelectedKeys = tab;
    console.log(tab);
    if(status === 'success'){
      if(app_type === 'net'){
        if(tab){
          if( tab.length > 1){
            let n = Number(tab[1]);
            let net = checkNetworks[n];
            let {networkDir, lncRnet} = net;
            console.log(networkDir, lncRnet);
            if(networkDir) content = <CoExpression data={{dir: out_dir + networkDir, lncRnet}}/>;
          } else {
            content = menus[Number(tab)].content;
          }
        }
      }
    }
    return (
      <div>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Link to={'/'}><Breadcrumb.Item>Home</Breadcrumb.Item></Link>
          <Breadcrumb.Item>ncFANs-{app_type === 'elnc'? 'eLnc': app_type.toUpperCase()}</Breadcrumb.Item>
        </Breadcrumb>
        {
          ( status === 'loading' || status === 'running' || status === 'enquene' || status === 'enqueue' )? (
              <div style={ulStyle}>
                <h3><b>Your task is {status_text}<JYLoading/></b></h3>
                <p>
                  This page reload data in every 2 seconds with no refresh using Ajax. Or you can click <a onClick={()=>window.location.reload()}>here</a> to manually refresh. The result will load automatically when the task is finished.
                </p>
                <p>
                  Note: You DON'T need to wait for the task finished. You can save this
                  link to fetch results directly in the future. Link of this page:
                  &nbsp;
                  <a href={window.location.href}>
                    {window.location.href}
                  </a>.
                </p>
              </div>
            ):
            status === 'success'? (
                <div>
                  {
                    app_type === 'elnc'? (<div><ElncRetrieve out_dir={out_dir}/></div>):
                      app_type === 'chip'? (<div><ChipRetrieve out_dir={out_dir} request_data={request_data}/></div>):
                      (app_type=== 'net' || app_type === 'combine')? (<Layout style={{ padding: '24px 0', background: '#fff' }}>
                        <Sider width={240} style={{ background: '#fff' }}>
                          <Menu
                            defaultSelectedKeys={[defaultSelectedKeys]}
                            defaultOpenKeys={['0', '1']}
                            onClick={(clickParam)=>{
                              let {key} = clickParam;
                              let rq = {taskid, tab: key};
                              window.location.search = dict2params(rq);
                            }}
                            mode="inline"
                          >
                            {
                              menus.map((tabItem, index)=>{
                                let {tab, content: tabContent, icon, children} = tabItem;
                                if(children){
                                  return <Menu.SubMenu
                                    key={'' + index}
                                    title={ <span> <Icon type={icon} /> <span>{tab}</span> </span> } >
                                    {
                                      children.map((item, cIndex)=>{
                                        let {tab, networkDir, icon, lncRnet} = item;
                                        return <Menu.Item
                                          key={index+'' + cIndex}
                                          networkDir={networkDir}
                                          lncRnet={lncRnet}
                                        > <Icon type={icon} />  {tab} </Menu.Item>
                                      })
                                    }
                                  </Menu.SubMenu>
                                }
                                return <Menu.Item
                                  key={index}
                                  content={tabContent}
                                > <Icon type={icon} />  {tab} </Menu.Item>

                              })
                            }
                          </Menu>
                        </Sider>
                        <Content style={{ padding: '0 24px', minHeight: 280 }}>
                          {content}
                        </Content>
                      </Layout>):
                        ''
                  }
                </div>
              ):
              (task_log && task_log.startsWith('None of the entries was annotated successfully. '))? (
                  <div>
                    <h3><b>Your task is finished. </b></h3>
                    <p>But n{task_log.substring(1, task_log.length)}</p>
                    <p>
                      If you have a
                      confused question, you can send this link to the administrator email
                      budechao@ict.ac.cn.  Link of this page:
                      <a href={window.location.href}>
                        {window.location.href}
                      </a>.
                    </p>
                  </div>
                ):
                status === 'failed'? (
                    <div>
                      <h3><b>Your task is finished. </b></h3>
                      <p>
                        But some problems occurred.  If you have a
                        confused question, you can send this link to the administrator email budechao@ict.ac.cn.  Link of this page:
                        <a href={window.location.href}>
                          {window.location.href}
                        </a>.
                      </p>
                      <p>Below is the running log.</p>
                      {
                        task_log? (
                          <div style={{'borderRadius': '5px', background: '#eee', marginLeft: ''}}>
                            {task_log.split('\n').map((t)=> <p>{t}</p>)}
                          </div>
                        ): ''
                      }
                    </div>
                  ):
                  status === 'unavailable'? (
                      <div>
                        <h3><b>Your task is not available. </b></h3>
                        <p>
                          If you have a
                          confused question, you can send this link to the administrator email budechao@ict.ac.cn.
                        </p>
                      </div>
                    ):
                    ''
        }
        {
          real_config_path? <Button onClick={ ()=>down_file({file_path: real_config_path}) } icon={'download'}>config</Button>:
            ''
        }
      </div>
    )
  }
}

export default Retrieve;
