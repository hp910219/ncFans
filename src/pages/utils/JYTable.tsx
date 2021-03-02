/**
 * 癌种
 */
import React from 'react';
import ExportJsonExcel from 'js-export-excel';
import Highlight from 'react-highlight';
// 引入 antd 组件
import {
  Table, Modal,
  Input, Button, Form,
  Icon, Tag, Tooltip, Rate, Collapse, Divider, Popconfirm
} from 'antd';
// 引入 封装fetch工具类
import Highlighter from 'react-highlight-words';
import {
  EditableFormRow,
  EditableCell,
  cmp, down_file,
} from '@/pages/utils/request';
import styles from "@/layouts/index.css";

const action_name = '';

class JYTable extends React.Component {
  // 构造器
  constructor(props) {
    super(props);
    // 定义初始化状态

    this.state = {
      searchText: '',
      searchedColumn: '',
    };
  }

  /**
   * 生命周期
   * componentWillMount
   * 组件初始化时只调用，以后组件更新不调用，整个生命周期只调用一次
   */
  componentWillMount(){
    // 请求数据
  }

  isEditing = record => {return record[this.state.unique_id] === this.state.editingKey;};

  download = (columns)=>{
    let { data, dataPath} = this.props;
    if(dataPath){
      down_file({file_path: dataPath});
      return;
    }
    data = data || [];
    let headers = data.length === 0? []: Object.keys(data[0]);
    console.log(data.length, headers);
    let toExcel = new ExportJsonExcel({
      fileName: action_name + '_' +(new Date().toLocaleDateString()),
      datas: [
        {
          sheetData: data,
          sheetFilter: headers,
          sheetHeader: headers
        }
      ]
    });
    toExcel.saveExcel();
  };
  getColumnSearchProps = (dataIndex, title) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${title}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>{
      console.log(dataIndex, record[dataIndex], record);
      return record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase())
    },
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text =>{
      console.log(this.state.searchedColumn === dataIndex, this.state.searchedColumn, dataIndex);
      return this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      )
    },
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  sortColumns = (columns, dataKey)=>{
    return columns.map((column) => {
      // if (!column.editable) {
      //   return column;
      // }
      let {title, dataIndex, searchable, dataType} = column;
      let filterInfo = {};
      if(searchable) filterInfo = this.getColumnSearchProps(dataIndex, title);
      title = title || dataIndex;
      return {
        title,
        ...filterInfo,
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => {
          if(dataType === 'number') return cmp(Number(a[dataIndex]), Number(b[dataIndex]));
          return cmp(a[dataIndex], b[dataIndex])
        },
        ...column,
        onCell: record => ({
          record,
          //editable: col.editable,
          dataIndex: column.dataIndex,
          key: column.dataIndex,
          title: column.title,
          // editing: this.isEditing(record),
        }),
      };
    });
  };
  render() {
    // 定义变量
    let {columns, dataSource, loading, rowKey,scroll, btns, title} = this.props;
    dataSource = dataSource || [];
    // let popConfig = title, onConfirm, okText, cancelText, onCancel

    columns = this.sortColumns(columns||[], 'medical_terminology');
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    let pageSize = [];
    for(let p = 1; p <= Math.ceil(dataSource.length/10); p++){
      pageSize.push(p * 10)

    }
    return (
      (
        <div>
          <div style={{textAlign: 'right', marginBottom: '15px'}}>

            {btns? btns.map((btn)=>{
              return (<Button
                style={{marginLeft: '5px'}}
                type={'info'} icon={'download'}
                onClick={()=>down_file({file_path: btn.dataPath})}>
                {btn.text}
              </Button>)
            }): (<span>
                <Button onClick={this.handleRest} icon={'sync'} title={'Reset'}/>
              &nbsp;<Button
              type={'info'} icon={'download'} onClick={()=>this.download(columns)}>
                download
              </Button>
              </span>)}
          </div>
          <Table
            components={components}
            loading={loading}
            columns={columns}
            dataSource={dataSource}
            rowKey={rowKey}
            size={'small'}
            scroll={scroll}
            title={title}
            locale={{emptyText: 'No data is available'}}
            pagination={{
              pageSizeOptions: pageSize,
              showSizeChanger: true, showQuickJumper: true,
              showTotal: (total)=> <Tag>{total} items</Tag>}}
            // expandedRowRender={(record)=>{
            //   return <Table
            //     components={components}
            //     loading={loading}
            //     columns={[columns[0], columns[1], columns[2], columns[3]]}
            //     dataSource={medical_terminology || []}
            //     rowKey={'tag_no'}
            //     size={'small'}
            //     pagination={{
            //       pageSizeOptions: pageSize,
            //       showSizeChanger: true, showQuickJumper: true,
            //       showTotal: (total)=> <Button>共{total}条</Button>}}
            //     // pagination={false}
            //   />
            // }}
            // pagination={false}
          />
        </div>
      )
    );
  }
}


export default JYTable;
