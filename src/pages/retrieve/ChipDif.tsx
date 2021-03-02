
import React from 'react';
import {Button, Row, Col, Divider, Icon, Tag} from "antd";
import JYTable from "@/pages/utils/JYTable";
import {
  down_file,
  get_file_content,
  getNodesANDEdges,
  moduleTags,
} from '@/pages/utils/request.js';
import Scatter from "@/pages/figure/Scatter";
import MsigBar from "@/pages/figure/MsigBar";
import Network from "@/pages/figure/Network";
import { Modal, Button } from 'antd';
import {jy_form_item} from "@/pages/utils/request";


class ChipDif extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      activeModuleIndex: 0,
      activeModuleTagIndex: 0,
      visible: false
    }
  }
  componentWillMount(): void {
    let {dir, action} = this.props;
    if(dir) {
      dir += '/difexp_out';
      let file_name = `difexp.sig.${action}.info.tsv`;
      get_file_content({dir, file_name}, (res)=>{
        let {data, file_path} = res;
        if(data) {
          let columns = [
            {title: 'gene', dataIndex: 'gene', searchable: true},
            {title: 'gene_type', dataIndex: 'gene_type'},
            {title: 'logFC', dataIndex: 'logFC', render: (v)=>{
              v = Number(v);
              if(isNaN(v)) return v;
              return v.toFixed(2)
              }},
            {title: 'AveExpr', dataIndex: 'AveExpr', render: (v)=>{
                v = Number(v);
                if(isNaN(v)) return v;
                return v.toFixed(2)
              }},
            {title: 't', dataIndex: 't', render: (v)=>{
                v = Number(v);
                if(isNaN(v)) return v;
                return v.toFixed(2)
              }},
            {title: 'P.Value', dataIndex: 'P.Value', render: (v)=>{
                v = Number(v);
                if(isNaN(v)) return v;
                return v.toExponential(2)
              }},
            {title: 'adj.P.Val', dataIndex: 'adj.P.Val', render: (v)=>{
                v = Number(v);
                if(isNaN(v)) return v;
                return v.toExponential(2)
              }},
          ];
          this.setState({columns, dataSource: data, initData: data, dataPath: file_path});
        }
      })
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
          title: prefix + ' NetWork',
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
  overviewModule = (activeModuleTagIndex) =>{
    let {dir, action} = this.props;
    if(dir){
      dir += '/difexp_out';
      let activeModuleTag = moduleTags[activeModuleTagIndex];
      let {overall, folder} = activeModuleTag;
      let title = action + ' ' + folder;
      let moduleUrl = `${dir}/difexp.${action}_genes.${folder}.tsv`;
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
    let {action, dir} = this.props;
    let {visible, loading} = this.state;

    let {initData, dataSource, columns, dataPath} = this.state;
    let props = {dataSource, columns, btns: [
        {text: `Download ${action}-regulated genes`, dataPath},
        {text: 'Download all differential analysis result', dataPath: dir + '/difexp_out/difexp.info.tsv'},
      ]};
    initData = initData || [];
    return <div>
      <div style={{marginBottom: '10px'}}>
        {
          moduleTags.map((tagItem, tagIndex)=>{
            let {tag} = tagItem;
            return <Tag
              color={'orange'}
              style={{cursor: 'pointer'}}
              onClick={()=> this.overviewModule(tagIndex)}
            >
              <Icon type={'eye'}/>
              <Divider type={'vertical'}/>
              {tag} function
            </Tag>
          })
        }
      </div>

      {
        jy_form_item({
          tag: 'select',
          label: 'Filtered by gene type: ',
          labelCol: {span: 18},
          wrapperCol: {span: 3},
          style: {width: '200px', float: 'left'},
          placeholder: 'please select gene type',
          items: [
            'lncRNA',
            'misc_RNA',
            'nonsense_mediated_decay',
            'processed_transcript',
            'protein_coding',
            'retained_intron',
            'TEC',
            'unprocessed_pseudogene',
          ],
          onChange: (value)=>{
              this.setState({
                dataSource: initData.filter((item)=> item.gene_type ===value)
              })
          }
        })
      }
      <JYTable {...props}/>
      <div>
        <Modal
          width={800}
          visible={visible}
          title={<span>{this.state.title} <Button icon={'download'} onClick={()=>this.downModule()}>Download all enrichment result</Button></span>}
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
export default ChipDif;
