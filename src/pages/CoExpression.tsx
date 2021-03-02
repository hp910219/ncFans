
import React from 'react';
import {Button, Col, Collapse, Divider, Icon, List, Modal, Row, Tag} from "antd";
import {
  down_file,
  get_file_content,
  getNodesANDEdges,
  moduleTags,
  render_count,
  sortColumns,
  render_long_text
} from '@/pages/utils/request';
import ModuleInfoApp from "@/pages/CoExpression/ModuleInfoApp";
import MsigBar from "@/pages/figure/MsigBar";
import Scatter from "@/pages/figure/Scatter";
import Network from "@/pages/figure/Network";
import JYTable from "@/pages/utils/JYTable";
class CoExpression extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      summary: {}
    };
  }
  componentWillMount(): void {
    let {data} = this.props;
    data = data || {};
    let {
      dir, lncRnet
    } = data;
    this.getSummaryAndNetwork(dir);
    if(Array.isArray(lncRnet)){
      if(lncRnet.length >0){
        this.overviewLncRnet(lncRnet[0]);
      }
    }
  }
  getSummaryAndNetwork= (dir)=>{
    if(dir){
      // this.setState({dir: dir});
      console.log(dir);
      get_file_content({dir: dir, file_name: 'summary.tsv'}, (res)=>{
        let {data: summary1} = res;
        if(Array.isArray(summary1)) {
          let summary = {};
          summary1.map((sItem) => {
            let {Attr, Value} = sItem;
            summary = {...summary, [Attr]: Value};
          });
          let edgesPath = dir + '/overall_network.tsv';
          let {PCG_NO, Edge_NO} = summary;
          PCG_NO = Number(PCG_NO);
          Edge_NO = Number(Edge_NO);
          this.setState({dir, summary, edgesPath, PCG_NO, Edge_NO});
          if(PCG_NO < 1000 && Edge_NO < 10000) get_file_content({file_name: edgesPath}, (res)=>{
            let {data} = res;
            let networkInfo = getNodesANDEdges(data, 'Gene1_Name', 'Gene2_Name', 'ID', 'Attribute1', 'Attribute2');
            this.setState({networkInfo, loading: false});
          });
        }
      });
    }
  };
  overviewModule = (activeModuleTagIndex) =>{
    let {data} = this.props;
    let {dir} = data;
    if(dir){
      let activeModuleTag = moduleTags[activeModuleTagIndex];
      let {overall, folder} = activeModuleTag;
      let title = 'Overall ' + folder;
      let moduleUrl = dir + '/'+ overall;
      this.setState({
        activeModuleTagIndex,
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
            activeModuleTagIndex === 2? <MsigBar data={activeModuleInfo}/>: <Scatter folder={folder} data={activeModuleInfo}/>
        })
      })
    }
  };
  overviewLncRnet = (item)=>{
    console.log(item);
    let {dir} = this.props.data;
    let {file_name, title } = item;
    if(dir){
      get_file_content({dir, file_name, to_json: false}, (res)=>{
        let {data} = res;
        if(Array.isArray(data) && data.length > 0) {
          let {columns, items} = sortColumns(data);
          columns = columns.map((col)=>{
            let {title} = col;
            if(title === 'LncRNA_Name') col = {...col, searchable: true};
            return col;
          });
          this.setState({lncRnetTitle: title, lncRnetColumns: columns, lncRnetItems: items, lncRnetPath: dir + '/' + file_name});
        }
      })
    }
  };
  downModule = () =>{
    let {downUrl} = this.state;
    down_file({file_path: downUrl});
  };
  render(){
    let {summary, PCG_NO, Edge_NO, lncRnetItems, lncRnetColumns, lncRnetPath} = this.state;
    let {app_type} = this.props;
    let {lncRnet, dir} = this.props.data;
    let leftItems = [
      {
        title: 'ncRNA number', dataIndex: 'ncRNA_NO', status: 'warning'
      },
      {
        title: 'PCG number', dataIndex: 'PCG_NO', status: 'success'
      },
      {
        title: 'Module number', dataIndex: 'module_NO', status: 'processing'
      },
      {
        title: 'Hub number', dataIndex: 'hub_NO', status: 'processing'
      },
      {
        title: 'Total edge number', dataIndex: 'Edge_NO', status: 'processing'
      },
      {
        title: 'Undetected ncRNA number', dataIndex: 'Missed_ncRNA_NO', success: 'error'
      },
      {
        title: 'Functions', dataIndex: 'moduleInfo',
        render: ()=>{
          return <div>
            {
              moduleTags.map((tagItem, tagIndex)=>{
                let {tag} = tagItem;
                return <div style={{marginTop: '5px'}}>
                  <Tag
                    color={'orange'}
                    style={{cursor: 'pointer'}}
                    onClick={()=> this.overviewModule(tagIndex)}
                  >
                    <Icon type={'eye'}/>
                    <Divider type={'vertical'}/>
                    {tag} function
                  </Tag>
                </div>
              })
            }
          </div>
        }
      },
    ];
    if(Array.isArray(lncRnet)){
      leftItems = [
        ...leftItems,
        {
          title: 'Network content included',
          render: ()=>{
            return lncRnet.map((item)=>{
              return <div style={{marginTop: '5px'}}>
                <Tag
                  color={'green'}
                  style={{cursor: 'pointer'}}
                  onClick={()=> this.overviewLncRnet(item)}
                >
                  <Icon type={'eye'}/>
                  <Divider type={'vertical'}/>
                  {item.title}
                </Tag>
              </div>
            })
          }
        }
      ]
    }
    if(app_type === 'chip'){
      leftItems = leftItems.filter((item)=>item.title !== 'Undetected ncRNA number');
    }
    return <div>
      <Collapse defaultActiveKey={'1'}>
        <Collapse.Panel key={'1'} header={'Network information'}>
          <div>
            <Row gutter={16}>
              <Col span={6}>
                <List
                  loading={this.state.loading}
                  size="small"
                  // style={{marginTop: '100px'}}
                  // header={<div>Header</div>}
                  // footer={<div>Footer</div>}
                  bordered
                  dataSource={leftItems}
                  renderItem={item1 => {
                    let {dataIndex} = item1;
                    return  <List.Item>
                      {item1.title} &nbsp;&nbsp;
                      {
                        item1.render? item1.render():
                          render_count(summary[dataIndex], item1.status)
                      }
                    </List.Item>
                  }}
                />
              </Col>
              <Col span={18}>
                {
                  (PCG_NO < 1000 && Edge_NO < 10000) ? <div>
                    <p style={{textAlign: 'right'}}>
                      <Button icon={'download'} onClick={()=> down_file({file_path: this.state.edgesPath})}> network </Button>
                    </p>
                    <Network data={this.state.networkInfo}/>
                  </div>: <div style={{}}>
                    <p>This network is too large to view, please download and visualize locally.
                      &nbsp;
                      <Button icon={'download'} onClick={()=> down_file({file_path: this.state.edgesPath})}> network </Button>
                    </p>
                  </div>
                }
              </Col>
            </Row>
            {
              lncRnetItems? (<div>
                <Divider orientation={'left'}>{this.state.lncRnetTitle}</Divider>
                <JYTable
                  scroll={{x: lncRnetColumns.length> 10? 2000: lncRnetColumns.length>= 7? 1500: '', y: '320px'}}
                  columns={lncRnetColumns}
                  dataSource={lncRnetItems}
                  dataPath={lncRnetPath}
                />
              </div>): ''}
            <div>
              <Modal
                width={800}
                visible={this.state.visible}
                title={<span>{this.state.title} <Button icon={'download'} onClick={()=>this.downModule()}>Download all enrichment result</Button></span>}
                okText={'Ok'}
                cancelText={'Cancel'}
                onOk={()=>this.setState({visible: false})}
                onCancel={()=>this.setState({visible: false})}
              >
                {
                  this.state.figure
                }
              </Modal>
            </div>
          </div>
        </Collapse.Panel>
        <Collapse.Panel key={'2'} header={'Module information'}>
          <ModuleInfoApp title={'Module'} action={'module'} data={{dir, summary}}/>
        </Collapse.Panel>
        <Collapse.Panel key={'3'} header={'Hub information'}>
          <ModuleInfoApp title={'Hub'} action={'hub'} data={{dir, summary}}/>
        </Collapse.Panel>
      </Collapse>
    </div>
  }
}
export default CoExpression;
