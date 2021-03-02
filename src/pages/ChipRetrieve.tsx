
import React from 'react';
import {Button, Col, Collapse, Divider, Icon, List, Modal, Row, Tag, Tabs} from "antd";
import {
  down_file,
  get_file_content,
  getNodesANDEdges,
  moduleTags,
  render_count,
  sortColumns,
  render_long_text
} from '@/pages/utils/request';
import MsigBar from "@/pages/figure/MsigBar";
import Scatter from "@/pages/figure/Scatter";
import ChipDif from "@/pages/retrieve/ChipDif";
import CoExpression from "@/pages/CoExpression";
class Chip extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      summary: {}
    };
  }
  componentWillMount(): void {
    let {out_dir} = this.props;

    this.getSummaryAndNetwork(out_dir);
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
          this.setState({dir, summary});
        }
      });
      // console.log('sssssss', summary);

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
            activeModuleTagIndex === 2? <MsigBar data={activeModuleInfo}/>: <Scatter data={activeModuleInfo}/>
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
          this.setState({lncRnetTitle: title, lncRnetColumns: columns, lncRnetItems: items, lncRnetPath: dir + '/' + file_name});
        }
      })
    }
  };
  render(){
    let {summary, PCG_NO, lncRnetItems, lncRnetColumns, lncRnetPath} = this.state;
    let {out_dir, request_data} = this.props;
    request_data = request_data || {};
    let {exp_filter, do_dif, do_coexp} = request_data;
    let leftItems = [
      {
        title: 'total gene number', dataIndex: 'all_NO', status: 'warning'
      },
      {
        title: 'PCG number', dataIndex: 'coding_NO', status: 'success'
      },
      {
        title: 'lncRNA number', dataIndex: 'lncRNA_NO', status: 'processing'
      },
      {
        title: 'snoRNA number', dataIndex: 'snoRNA_NO', status: 'processing'
      },
      {
        title: 'miRNA number', dataIndex: 'miRNA_NO', status: 'processing'
      },
      {
        title: 'tRNA number', dataIndex: 'tRNA_NO', status: 'processing'
      },
      {
        title: 'other gene number', dataIndex: 'other_NO', status: 'processing'
      },
    ];
    let cons = [];
    if(do_dif === 'yes'){
      cons = [
        ...cons,
        {
          header: 'Differential expression analysis',
          content: <Tabs defaultActiveKey="1" onChange={()=>{}}>
            <Tabs.TabPane tab="Up-regulated genes" key="1">
              <ChipDif action={'up'} dir={out_dir}/>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Down-regulated genes" key="2">
              <ChipDif action={'down'} dir={out_dir}/>
            </Tabs.TabPane>
          </Tabs>
        }
      ]
    }
    if(do_coexp === 'yes'){
      cons = [
        ...cons,
        {
          header: 'Co-expression network',
          content: <CoExpression data={{dir: out_dir + '/coexp_out'}} app_type={'chip'}/>
        }
      ]
    }
    return <div>
      <Collapse defaultActiveKey={['1', '2', '3']}>
        <Collapse.Panel key={'1'} header={'Expression Profile'}>

            <div style={{float: 'right'}}>
              <Button icon={'download'} onClick={()=>{
                down_file({file_path: out_dir + '/gene.exp.tsv'})
              }}>Download gene expression file</Button>
            </div>
            <Row style={{width: '50%'}}>
              {
                leftItems.map(item1 => {
                  let {dataIndex} = item1;
                  return  <Col span={12}>
                    <p style={{paddingLeft: '30px'}}>
                      {item1.title} &nbsp;&nbsp;
                      {
                        item1.render? item1.render():
                          render_count(summary[dataIndex], item1.status)
                      }
                    </p>
                  </Col>
                })
              }
            </Row>

          </Collapse.Panel>
        {
          cons.map((con, index)=>{
            return <Collapse.Panel key={'' + (index+ 2)} header={con.header}>
              {con.content}
            </Collapse.Panel>
          })
        }

      </Collapse>
    </div>
  }
}
export default Chip;
