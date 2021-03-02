
import React from 'react';
import {Button, Row, Col, Divider, Icon, Tag} from "antd";
import JYTable from "@/pages/utils/JYTable";
import {
  down_file,
  get_file,
  get_file_content,
  getNodesANDEdges,
  render_count,
  string2array,
  saveAsImg,
  moduleTags, render_long_text, sortColumns
} from '@/pages/utils/request.js';
import Scatter from "@/pages/figure/Scatter";
import MsigBar from "@/pages/figure/MsigBar";
import Network from "@/pages/figure/Network";
import { Modal, Button } from 'antd';


class ElncRetrieve extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      activeModuleIndex: 0,
      activeModuleTagIndex: 0,
      visible: false
    }
  }
  componentWillMount(): void {
    let {out_dir} = this.props;
    if(out_dir) {
      this.setState({CodingPotentialPath: out_dir + '/CodingPotential.txt'});
      get_file_content({dir: out_dir, file_name: 'final_elncRNA.bed'}, (res)=>{
        let {data, file_path} = res;
        if(data) {
          let {columns, items} = sortColumns(data);
          columns = columns.filter((col)=>col.title !== '.')
          columns = [
            ...columns,
            {
              title: 'Putative targets',
              render: (t, record)=>{
                let text = record[3];
                return  <Tag
                  onClick={()=>{
                    let {initCodingPotential} = this.state;
                    initCodingPotential = initCodingPotential || [];
                    let CodingPotential = initCodingPotential.filter(c=> {
                      return c[0].startsWith(text)
                    });
                    this.setState({visible: true, id: text, CodingPotential})
                  }}
                  color={'blue'}>
                  <Icon type={'eye'}/>
                  <Divider type={'vertical'}/>
                  View putative targets
                </Tag>
              }
            }
          ]
          this.setState({loading: false, dataSource: items, columns: columns, dataPath: file_path});
        }
      });
      get_file_content({dir: out_dir, file_name: 'adjacent.gene.bed'}, (res)=>{
        let {data, file_path} = res;
        if(data) {
          let {columns, items} = sortColumns(data);
          this.setState({initCodingPotential: items, CodingPotential: items, CodingPotentialColumns: columns});
        }
      });

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
        let networkInfo = getNodesANDEdges(edges, 'Gene1', 'Gene2', 'ID');
        this.setState({
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
          downUrl: downUrl,
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
    let {visible, loading,
      dataSource, columns, dataPath,
      CodingPotential, CodingPotentialColumns, CodingPotentialPath
    } = this.state;
    dataSource = dataSource || [];
    columns = columns || [];
    CodingPotential = CodingPotential || [];
    CodingPotentialColumns = CodingPotentialColumns || [];
    let props = {
      dataSource, columns,
      btns: [
        {text: 'Download elncRNA list', dataPath: dataPath},
        {text: 'Download CPC2 result', dataPath: CodingPotentialPath},
      ]};
    return <div>
      <JYTable {...props}/>
      <div>
        <Modal
          width={800}
          visible={visible}
          title={<span>{this.state.id}</span>}
          onOkText={'Ok'}
          onCancelText={'Cancel'}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <JYTable
            dataSource={CodingPotential}
            scroll={{x: 1300}}
            columns={CodingPotentialColumns}
          />
        </Modal>
      </div>
    </div>
  }
}
export default ElncRetrieve;
