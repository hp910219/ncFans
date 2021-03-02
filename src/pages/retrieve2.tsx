import React from 'react';
import {Button, Col, Input, Modal, Popover, Row, Select, Table, Tooltip, Icon} from 'antd';
import "antd/lib/typography/Typography";
import Typography from "antd/lib/typography";
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
import Tag from "antd/lib/tag";

let query_items = ['Pathway', 'disease', 'go'];
let ulStyle = {listStyle: 'none', paddingLeft: 0};

class TaskContent extends React.Component {
  render() {
    let {
      visible, onCancel, onCreate, dataSource, db
    } = this.props;
    let columns= [
      {
        title: 'Database',
        dataIndex: 'database'
      },
      {
        title: 'Disease ID',
        dataIndex: 'disease_id',
        render: (disease_id, record)=>{
          let {hyperlink} = record;
          if(hyperlink) return <a href={hyperlink} target={'_blank'}>{disease_id}</a>;
          return disease_id
        }
      },
      {
        title: 'Description',
        dataIndex: 'description'
      },
    ].map((column) => {
      // if (!column.editable) {
      //   return column;
      // }
      const {title, dataIndex, searchAble} = column;
      let filterInfo = {};

      return {
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => cmp(a[dataIndex], b[dataIndex]),
        ...column,
      };
    });
    return (
      <Modal
        visible={visible}
        title={db + ' 查询'}
        okText="确定"
        cancelText="取消"
        onCancel={onCancel}
        onOk={onCreate}
        width={'800px'}
      >
        <Table
          bordered={true}
          columns={columns}
          dataSource={dataSource}
          // scroll={{y: 520}}
          pagination={{showTotal: (total)=> <Button>共{total}条</Button>}}
          // pagination={false}
        />
      </Modal>
    );
  }
}

class Retrieve extends React.Component {
  constructor(props) {
    // To disabled submit button at the beginning.
    super(props);
    let args = get_args();
    let {taskid} = args;
    this.state = {
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
    // this.get_content('/tmp', {outfile: 'output_annotate_hmu.txt'});
    // this.get_content('/tmp', {outfile: 'output_annotate_zma.txt'});
    // this.get_content('/tmp', {outfile: 'output_annotate.txt'});
    // this.get_content('/tmp', {outfile: 'output_identify.txt'});
    // this.get_content('/tmp', {outfile: 'combination_results.tsv'});
    this.setState({loading: true});
    get_task(taskid, (res)=>{
      let {data} = res;
      console.log('get_task data', data);
      if(JSON.stringify(data) === '{}') this.setState({loading: false, task_info: {status: 'unavailable'}});
      else if(data) {
        let {out_dir, status, request_data} = data;
        console.log(status);
        if(status === 'success') this.get_content(out_dir, request_data, false);
        else if(status === -1 || status === 'failed' ){
          this.setState({loading: false});
        }
        else this.resultRetrieve();
        this.setState({task_info: data});
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
  queryDB = (qId, db)=>{
    let {content} = this.state;
    let s = `Query:              	${qId}`;
    console.log(qId, db);
    let infos = content.split('\n');
    let n = infos.length;
    let start = infos.indexOf(s);
    let specie = infos[0].split('\t')[0].substring(2);
    if(start === -1) return '';
    infos = infos.slice(start);
    let end = infos.indexOf('////');
    infos = infos.slice(0, end);
    let items  = [];
    let items2 = {};
    let start1 = n;
    let end1 = 0;
    let db_dict = {
      'lmt': '10403S_RAST',
      'atu': 'AGRO',
      'aga': 'ANO2',
      'ban': 'ANTHRA',
      'ath': 'ARA',
      'bsu': 'BSUB',
      'bta': 'CATTLE',
      'ccr': 'CAULO',
      'ccs': 'CAULONA1000',
      'cre': 'CHLAMY',
      'cpv': 'CPARVUM',
      'eco': 'ECOLI',
      'ecc': 'ECOL199310',
      'ecj': 'ECOL316407',
      'ebr': 'ECOL413997',
      'ece': 'ECOO157',
      'dme': 'FLY',
      'cho': 'HOMINIS',
      'hpy': 'HPY',
      'hsa': 'HUMAN',
      'lma': 'LEISH',
      'mmu': 'MOUSE',
      'mtc': 'MTBCDC',
      'mtu': 'MTBRV',
      'pbe': 'PBERGHEI',
      'pcb': 'PCHABAUDI',
      'pcs': 'PCHR',
      'pfa': 'PLASMO',
      'pvx': 'PVIVAX',
      'pyo': 'PYOELII',
      'sco': 'SCO',
      'sfx': 'SHIGELLA',
      'smm': 'SMAN',
      'syf': 'SYNEL',
      'tgo': 'TOXO',
      'tbr': 'TRYPANO',
      'vch': 'VCHO',
      'sce': 'YEAST'
    };
    let not_break = true;
    for(let i = 0; i < infos.length; i++){
      let info_line = infos[i];
      let info_lines = info_line.split('\t');
      let first = info_lines[0];
      let item = {
        description: info_lines[1],
        database: info_lines[2],
        disease_id: info_lines[3]
      };
      console.log('first', first);
      let {database, disease_id} = item;
      let hyperlink = '';
      if(database === 'KEGG PATHWAY'){
        hyperlink = 'http://www.genome.jp/dbget-bin/www_bget?pathway:' + disease_id;
      }
      else if(database === 'Reactome'){
        hyperlink = 'http://www.reactome.org/cgi-bin/eventbrowser_st_id?ST_ID=' + disease_id;
      }
      else if(database === 'BioCyc'){
        hyperlink = `http://biocyc.org/${db_dict[specie]}/NEW-IMAGE?type=NIL&object=${disease_id}`;
      }
      else if(database === 'PANTHER'){
        hyperlink = 'http://www.pantherdb.org/pathway/pathwayDiagram.jsp?catAccession=' + disease_id;
      }
      else if(database === 'KEGG DISEASE'){
        hyperlink = 'http://www.genome.jp/dbget-bin/www_bget?' + disease_id;
      }
      else if(database === 'OMIM'){
        hyperlink = 'http://omim.org/entry/' + disease_id;
      }
      else if(database === 'NHGRI GWAS Catalog'){

      }
      else if(database === 'Gene Ontology Slim'){
        hyperlink = 'http://amigo.geneontology.org/amigo/term/' + disease_id;
      }else if(database === 'Gene Ontology'){
        hyperlink = 'http://amigo.geneontology.org/amigo/term/'  + disease_id;
      }
      items = [
        ...items,
        {...item, hyperlink}
      ];
      end1 = i;
      let k = first.toUpperCase().trim().slice(0, -1);
      let db1 = db.toUpperCase();
      if(k){if(!items2[k])items2[k] = []}
      if(items2[db1]) items2[db1].push(item);
      if(k === db1) {
        start1 = i;
      }
      else if(k && end1 > start1 && (! k.startsWith(db1))) {
        // end1 = i;
        not_break = false;
        break;
      }


      // if(k &&  && end1> start1){
      //   // end1 = i;
      //   break;
      // }
    }
    // if(db === 'go') end1 += 1;
    // if(end1 === start1) end1 += 1;
    // console.log(end1 === infos.length);
    if(not_break) end1 += 1;
    console.log(not_break, items, start1, end1, infos.length);
    this.setState({db_items: items.slice(start1, end1), visibleTag: true, db, qId});
  };
  get_content = (out_dir, request_data, only_unmarked)=>{
    let infile;
    if(Array.isArray(request_data)){
      request_data = request_data[1];
      // infile = request_data[0].infile;
    }
    let {outfile} = request_data;
    let unmarked = [];
    outfile = outfile || 'combination_results.tsv';

    get_file_content({dir: out_dir, file_name: outfile}, (res2)=>{
      let {data, file_path} = res2;
      let {showSelect} = this.state;
      if(data) {
        let dataSource = [];
        let columns = [];
        if(typeof data === 'string'){
          let lines = data.split('\n');
          let th = '#Query\tGene ID|Gene name|Hyperlink';
          let separator = '|';
          let ths = th.split(separator);
          let th_index = lines.indexOf(th);
          let end_index = lines.indexOf('--------------------');
          if(th_index === -1){
            showSelect = true;
            th = '#Term\tDatabase\tID\tInput number\tBackground number\tP-Value\tCorrected P-Value\tInput\tHyperlink';
            separator = '\t';
            ths = th.split(separator);
            th_index = lines.indexOf(th);
            end_index = lines.length;
          }
          let data_lines = lines.slice(th_index+1, end_index-1);
          columns = ths.map((t, index)=>{
            let title = t;
            let k = t
              .replace('#', '').replace(/ /g, '').replace(/\t/g, '');
            let filterInfo = {};
            let style = {};
            if(k === 'Term') {
              style.width = '180px';
              title = '';
            }
            if(k === 'Inputnumber') {
              style.width = '90px';
              title = 'Input gene number';
              t = 'Input';
            }
            if(k === 'Backgroundnumber') {
              style.width = '90px';
              title = 'Background gene number';
              t = 'Total'
            }
            if (k === 'Input'){
              title = 'Input genes';
              t = 'Genes'
            }
            if(k.endsWith('P-Value')) style.width='120px';
            console.log(k);
            return {
              title: <span title={title}>{t}</span>,
              dataIndex: k,
              key: k,
              ...style,
              render: (text, record)=>{
                // if(k === 'Hyperlink') return <a href={text} target={'_blank'}>detail</a>
                if(k === 'ID')return <a href={record.Hyperlink} target={'_blank'}>{text}</a>;
                if(k.endsWith('P-Value')) {
                  // console.log(text);
                  let v = Number(text);
                  if(isNaN(v)) return text;
                  return <Tooltip title={text}><span>{v.toExponential(2)}</span></Tooltip>;
                }
                if(k === 'Input'){
                  let inputs = text.split('|');
                  let content = (
                    <Row style={{width: '500px', maxHeight: '400px', overflow: 'auto'}} gutter={16}>
                      <Col span={24}><Tag color={'blue'}>total: {inputs.length}</Tag></Col>
                      {
                        inputs.map((item)=><Col span={8}>{item}</Col>)}
                    </Row>
                  );
                  return (<Popover title={record.ID} placement={'right'} content={content}>
                    <Tag color={'blue'}>detail</Tag>
                  </Popover>)
                }
                if(k === 'Term') return render_long_text(text, 30);
                return render_long_text(text, 15);
              },
              ...filterInfo
              // sortable: true
            }
          });
          data_lines.map((d_l)=>{
            if(d_l.startsWith('#')) return;
            if(d_l === '--------------------') return;
            if(!d_l.trim()) return;
            let item = {};
            let d_line = d_l.split(separator);
            columns.map((col, t_index)=>{
              item = {...item, [col.dataIndex]: d_line[t_index]}
            });
            if(separator === '|'){
              let {QueryGeneID} = item;
              let texts = QueryGeneID.split('\t');
              item.query=texts[0];
              item.GeneID = texts[1];
              if(item.GeneID && item.GeneID !== 'None') dataSource = [...dataSource, item];
              else unmarked = [...unmarked, item.query];
            }else dataSource = [...dataSource, item];
          });
          if(separator === '|'){
            columns = [
              {
                title: 'Query', dataIndex: 'query', render: (text, record)=>{
                  let {QueryGeneID} = record;
                  let texts = QueryGeneID.split('\t');
                  record.query=texts[0];
                  record.GeneID = texts[1];
                  return record.query;
                }
              },
              {
                title: 'Gene ID', dataIndex: 'GeneID',
                render: (geneID, record)=>(<a href={record.Hyperlink} target={'_blank'}>{geneID}</a>)
              },
              {title: 'Gene name', dataIndex: 'Genename'}
            ];
            query_items.map((q_item)=> {
              columns = [
                ...columns,
                {
                  title: q_item,
                  dataIndex: q_item,
                  render: (t, record)=><a
                    style={{marginLeft: '10px'}}
                    onClick={()=>this.queryDB(record.query, q_item)}>detail</a>
                }
              ]
            })

          }else columns = columns.slice(0, columns.length-1);
        }else if(Array.isArray(data)) {
          let ths = data[0];
          dataSource = data;
          for (let k in ths){
            columns = [
              ...columns,
              {
                title: k,
                dataIndex: k,
                key: k,
                render: (text, record)=>{
                  console.log(k);
                  if( k === 'ENRICH_SCORE' || k === 'PROBABILITY' ){
                    let v = Number(text);
                    if(isNaN(v)) return text;
                    return <Tooltip title={text}><span>{v.toFixed(4)}</span></Tooltip>;
                  }
                  return text;
                }
              }
            ]
          }
        }
        // console.log(unmarked);
        if(infile){
          // this.get_content(out_dir, {outfile: infile}, true);
        }
        if(only_unmarked)this.setState({unmarked});
        else this.setState({
          content: data, dataSource, columns, loading: false, file_path, unmarked,
          init_data: dataSource, showSelect
        });
      }
    })
  };
  download = () =>{
    let {file_path} = this.state;
    console.log(file_path);
    down_file({file_path});
  };
  downUnmarked = ()=>{
    let {unmarked} = this.state;
    if(unmarked.length > 0){
      save_file({content:unmarked.join('\n'), file_name: 'unannotated_IDs.txt'}, (res)=>{
        let {path} = res;
        if(path){
          down_file({file_path: path})
        }else jy_tip(JSON.stringify(res));
      })
    }
  };
  onInputChange = (searchText, searchKey) => {
    searchText = searchText || [];
    let init_data = this.state['init_data'] || [];
    this.setState({
      searchText,
      searchKey,
      open: false,
      dataSource: searchText.length === 0? init_data:
        init_data.map((record) => {
          if(searchText === 'all') return record;
          const record_value = record[searchKey];
          if (searchText.indexOf(record_value) === -1)  return null;
          return record;
        }).filter(record => !!record),
    });
  };

  render() {
    let {task_info, task_log, content, loading, columns, dataSource, unmarked, showSelect} = this.state;
    columns = columns || [];
    columns = columns.map((column) => {
      // if (!column.editable) {
      //   return column;
      // }
      const {title, dataIndex, searchAble} = column;
      return {
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => cmp(a[dataIndex], b[dataIndex]),
        ...column,
      };
    });
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    let status_color = '';
    let status_text = 'submitted';
    let status = 'loading';
    // jy_tip('ssdfs', 'info');
    if(task_info){
      status = task_info.status;
      if(task_info.status === 'failed' ) {status_color = '#f50'; status_text = 'Failed'}
      else if(task_info.status === 'success' ) {status_color = '#87d068'; status_text = 'Success'}
      else if(task_info.status === 'running' ) {status_color = '#2db7f5'; status_text = 'running'}
      else if(task_info.status === 'enquene' ) {status_color = '#108ee9'; status_text = 'in the queue'}
      else if(task_info.status === 'enqueue' ) {status_color = '#108ee9'; status_text = 'in the queue'}
      else if(task_info.status === 'enaqueue' ) {status_color = '#108ee9'; status_text = 'in the queue'}
      else if(task_info.status === 'unavailable' ) {status_color = '#108ee9'; status_text = 'not available'}
    }
    // status = 'success';
    console.log('task_info', task_info);
    return (
      <Typography>
        {
          ( status === 'loading' || status === 'running' || status === 'enquene' || status === 'enqueue' )? (
              <div style={ulStyle}>
                <h3><b>Your task is {status_text}. </b></h3>
                <p>
                  This page reload data in every 2 seconds with no refresh using Ajax. Or you can click <a onClick={()=>window.location.reload()}>here</a> to manually refresh. The result will load automatically when the task is finished.
                </p>
                <p>
                  Note: You DON'T need to wait for the task finished. You can save this
                  link to fetch results directly in the future. Link of this page:
                  <a href={window.location.href}>
                    {window.location.href}
                  </a>
                </p>
              </div>
            ):
            status === 'success'? (
                <div style={ulStyle}>
                  <h3><b>Your task is finished. </b></h3>
                  <p>
                    You can save this link to fetch results directly in the future. Link of this
                    page：<a href={window.location.href}>
                    {window.location.href}
                  </a>.  Tasks will be cleared 10 days after completion.
                  </p>
                  {
                    this.state.loading? (
                      <p>
                        <Button
                          onClick={()=>this.resultRetrieve()}
                          icon={'loading'}
                          type={'primary'}>Show the results</Button>
                      </p>
                    ): ''
                  }

                </div>
              ):
              (task_log && task_log.startsWith('None of the entries was annotated successfully. '))? (
                  <div>
                    <h3><b>Your task is finished. </b></h3>
                    <p>But n{task_log.substring(1, task_log.length)}</p>
                    <p>
                      If you have a
                      confused question, you can send this link to the mailing list
                      kobas@mail.cbi.pku.edu.cn.  Link of this page:
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
                        confused question, you can send this link to the mailing list
                        kobas@mail.cbi.pku.edu.cn.  Link of this page:
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
                          confused question, you can send this link to the mailing list
                          kobas@mail.cbi.pku.edu.cn.
                        </p>
                      </div>
                    ):
                    ''
        }
        <div>
          {/*<p style={{textAlign: 'center'}}>*/}
          {/*  <Spin spinning={loading} tip={'Result will be displayed here'}/>*/}
          {/*</p>*/}

          {
            content?(
                <div>
                  <p><b>Result</b></p>
                  <div style={{marginBottom: '15px'}}>
                    <Row>
                      <Col span={1}>{showSelect? 'Filter: ': ''}</Col>
                      <Col span={17}>
                        {
                          showSelect? (
                            <Select
                              style={{ minWidth: '180px'}}
                              showSearch={true}
                              // buttonStyle={'solid'}
                              mode="multiple"
                              onChange={(e)=> this.onInputChange(e, 'Database')}
                              // placeholder={`Search Database`}
                              placeholder="Select databases"
                            >
                              {
                                'KEGG PATHWAY, Reactome, PANTHER, BioCyc, Gene Ontology, NHGRI GWAS Catalog, KEGG DISEASE, OMIM, Gene Ontology Slim'
                                  .split(',')
                                  .map(function (item, index) {
                                    item = item.trim();
                                    return (<Select.Option value={item} title={item} key={index} index={index}>{item}</Select.Option>)
                                  })}
                            </Select>
                          ): ''
                        }
                      </Col>
                      <Col span={6} style={{textAlign: 'right'}}>
                        <Button
                          icon={'download'} disabled={!this.state.file_path} onClick={this.download}>
                          download the result
                        </Button>
                        &nbsp;
                        {
                          showSelect? (<Icon
                            type={'question-circle'}
                            title={'For each table cell, mouse over to show all contents.'}
                          />): ''
                        }
                      </Col>
                    </Row>
                  </div>

                  <Table
                    // size={'small'}
                    width={'962'}
                    // style={{width: '100%', overflow: 'auto'}}
                    bordered={true}
                    loading={loading}
                    columns={columns}
                    dataSource={dataSource}
                    components={components}
                    // scroll={{y: 520}}
                    pagination={{showTotal: (total)=> <Button>共{total}条</Button>}}
                    // pagination={false}
                  />
                </div>
              )
              : ''
          }
          {
            unmarked.length === 0? '':
              <p style={{marginLeft: ''}}>
                <b>IDs Failed to be Annotated</b><br/> {unmarked.join(',').substring(0, 80)}
                &nbsp;&nbsp;
                <Button size={'small'} icon={'download'} onClick={()=>this.downUnmarked()}>
                  download the IDs failed
                </Button>
              </p>
          }
        </div>
        <br/>
        <TaskContent
          visible={this.state.visibleTag}
          onCancel={()=> this.setState({visibleTag: false})}
          onCreate={()=>this.setState({visibleTag: false})}
          db={this.state.db + ': ' +this.state.qId}
          dataSource={this.state.db_items || []}
        />
      </Typography>
    )
  }
}

export default Retrieve;
