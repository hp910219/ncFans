
import React from 'react';
import {Button, Row, Col, Divider, Icon, Tag} from "antd";
import JYTable from "@/pages/utils/JYTable";
import {
  down_file,
  get_file_content,
  getNodesANDEdges,
  render_count,
  moduleTags, render_long_text,
} from '@/pages/utils/request.js';
import Scatter from "@/pages/figure/Scatter";
import MsigBar from "@/pages/figure/MsigBar";
import Network from "@/pages/figure/Network";
import { Modal, Button } from 'antd';


class ModuleInfoApp extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      activeModuleIndex: 0,
      activeModuleTagIndex: 0,
      visible: false
    }
  }
  componentWillMount(): void {
    let {data, action} = this.props;
    let {dir, summary} = data;
    console.log('...sss', summary, action);
    if(dir) {
      let moduleItems = [];
      let len = Number(summary[action + '_NO']);
      if(!isNaN(len)){
        for (let i = 0; i < len; i ++ ){
          let prefix = action +'_' +(i+1);
          let LncRNA = summary[prefix +'_ncRNA'] || '';
          moduleItems = [
            ...moduleItems,
            {
              prefix,
              PCG_no: summary[prefix + '_PCG_NO'],
              LncRNA,
              LncRNA_no: LncRNA.split(',').length
              // PCG_NO: [action + 'PCG_NO'],
              // : [action + 'PCG_NO'],
            }
          ]
        }
      }
      this.setState({moduleItems});
    }
  }
  overviewNetworkI = (activeNetworkIndex, prefix) =>{

    let {data, action} = this.props;
    let {dir, summary} = data;
    console.log('...sss', summary, prefix);
    if(dir) {
      let edgeDir = dir + '/' + action + '_edge';
      let networkUrl = edgeDir + '/' +prefix + '_edge.tsv';
      get_file_content({file_name: networkUrl}, (res1)=>{
        let {data: edges} = res1;
        let networkInfo = getNodesANDEdges(edges, 'Gene1', 'Gene2', 'ID', 'Attribute1', 'Attribute2');
        this.setState({
          downBtnText: 'the network',
          activeNetworkInfo: networkInfo,
          visible: true,
          title: prefix + ' Network',
          downUrl: networkUrl,
          activeNetworkIndex: activeNetworkIndex,
          figure: <Network data={networkInfo}/>
        })
      })
    }
  };
  downloadNetworkI = (activeNetworkIndex, prefix) =>{

    let {data, action} = this.props;
    let {dir, summary} = data;
    console.log('...sss', summary, prefix);
    if(dir) {
      let edgeDir = dir + '/' + action + '_edge';
      let networkUrl = edgeDir + '/' +prefix + '_edge.tsv';
      down_file({file_path: networkUrl});
    }
  };
  operateModule = (activeModuleIndex, activeModuleTagIndex, func) =>{
    let {data, action} = this.props;
    let {dir} = data;
    if(dir){
      let activeModuleTag = moduleTags[activeModuleTagIndex];
      let {folder} = activeModuleTag;
      let moduleDir = dir + '/'+action+'_' + folder;
      let title = action + (activeModuleIndex+1) + '-' + folder;
      let moduleUrl = moduleDir + '/'+action+'_' + (activeModuleIndex+1)+ '_'  + folder + '.tsv';
      func(moduleUrl, title);
    }
  };
  overviewModule = (activeModuleIndex, activeModuleTagIndex) =>{
    this.operateModule(activeModuleIndex, activeModuleTagIndex, (moduleUrl, title) =>{
      this.setState({
        activeModuleIndex, activeModuleTagIndex,
        visible: false,
        title,
        downBtnText: 'all enrichment',
        downUrl: moduleUrl
      });
      get_file_content({file_name: moduleUrl}, (res1)=>{
        let {data: activeModuleInfo} = res1;
        activeModuleInfo.length;
        this.setState({
          title: title + ' Total: ' + activeModuleInfo.length,
          activeModuleInfo,
          visible: true,
          figure: activeModuleInfo.length === 0? 'No data':
            activeModuleTagIndex === 2? <MsigBar data={activeModuleInfo}/>: <Scatter data={activeModuleInfo}/>
        })
      })
    });
  };
  overviewPCG = (prefix)=>{
    let {data, action} = this.props;
    let {dir, summary} = data;
    console.log('...sss', summary, prefix);
    if(dir) {
      let edgeDir = dir + '/' + action + '_node';
      let downUrl = edgeDir + '/' +prefix + '_node.tsv';
      get_file_content({file_name: downUrl, to_json: false}, (res1)=>{
        let {data: edges} = res1;
        this.setState({
          visible: true,
          title: prefix + ' PCG  Total:' + (edges.length),
          downUrl: '',
          figure: <div>
            <Row style={{maxHeight: '500px', overflow: 'auto'}} gutter={16}>
              {
                edges.map((item)=><Col span={4}>{item}</Col>)
              }
            </Row>
          </div>
        })
      })
    }
  };
  handleOk = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
    }, 3000);
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  downModule = () =>{
    let {downUrl} = this.state;
    down_file({file_path: downUrl});
  };

  render(){
    let {data, title} = this.props;
    let {basicInfoPath} = data;
    let {edges, moduleItems} = this.state;
    let {visible, loading} = this.state;
    edges = edges || [];
    moduleItems = moduleItems || [];
    let columns = [
      {
        title: title, dataIndex: title, render: (LncRNA, record, index)=>{
          return <span>
            {title}{index+1}
          </span>
        }
      },
      {
        title: 'ncRNA NO', dataIndex: 'LncRNA_no', render: (LncRNA_no, record)=>{
          return render_count(LncRNA_no, 'warning');
        }
      },
      {
        title: 'ncRNA', dataIndex: 'LncRNA', searchable: true, render: (LncRNA, record)=>{
          return render_long_text(LncRNA);
        }
      },
      {
        title: 'PCG NO', dataIndex: 'PCG_no', render: (PCG_no, record)=>{
          // return render_count(PCG_no, 'success');
          let {prefix} = record;
          return <Tag color={'green'} onClick={()=>this.overviewPCG(prefix)}>
            <Icon type={'eye'}/>
            <Divider type={'vertical'}/>
            {PCG_no}
          </Tag>
        }
      },
      {
        title: 'Function', dataIndex: 'moduleInfo',
        render: (v, record, index)=>{
          return <div>
            {
              moduleTags.map((tagItem, tagIndex)=>{
                let {tag} = tagItem;
                return <div
                  style={{marginBottom: '2px', cursor: 'pointer'}}
                  onClick={()=> this.overviewModule(index, tagIndex)}>
                  <Tag color={'orange'}>
                    <Icon type={'eye'}/>
                    <Divider type={'vertical'}/>
                    {tag} Function
                  </Tag>
                </div>
              })
            }
          </div>
        }
      },
      {
        title: 'Network', dataIndex: 'networkInfo', render: (networkInfo, record, index)=>{
          let {prefix} = record;
          return <div>
            <p>
              <Tag
                color={'orange'}
                onClick={()=> this.overviewNetworkI(index, prefix)}
              >
                <Icon type={'eye'}/>
                <Divider type={'vertical'}/>
                Network
              </Tag>
            </p>
            <p>
              <Tag
                color={'blue'}
                onClick={()=> this.downloadNetworkI(index, prefix)}
              >
                <Icon type={'download'}/>
                <Divider type={'vertical'}/>
                Network
              </Tag>
            </p>
          </div>
        }
      },
    ];
    let props = {dataSource: moduleItems, columns, dataPath: basicInfoPath, btns: []};
    return <div>

      <JYTable {...props}/>
      {this.state.LncRNA}
      <div>
        <Modal
          width={800}
          visible={visible}
          title={<span>{this.state.title} <Button icon={'download'} onClick={()=>this.downModule()}>Download {this.state.downBtnText||'all enrichment'} result</Button></span>}
          onOkText={'Ok'}
          onCancelText={'Cancel'}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          {
            this.state.figure
          }
        </Modal>
      </div>
    </div>
  }
}
export default ModuleInfoApp;
