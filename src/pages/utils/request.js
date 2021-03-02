/**
 * 封装 fetch
 */
import moment from 'moment';
import {
  Input, Form, Radio, Checkbox, Switch, Slider,
  DatePicker, Modal, Table, List,
  Row, Col,
  Icon, Badge, Cascader,
  Upload, Rate, Select, Divider, Tooltip,
} from 'antd';

import React from 'react';
import styles from '../../layouts/index.css';

const { MonthPicker, RangePicker } = DatePicker;

const service_info = {endpoint: sessionStorage.getItem('hostname') || `http://${window.location.hostname}`, 'port': 9003};
const tcm_api_prefix = sessionStorage.getItem('hostname') ? '' : `${service_info.endpoint }:${service_info.port || ''}`;

// 普通请求
export const jy_request_common =(rq, api_service=null) =>{
  let token = sessionStorage.getItem('access-token');
  let headers = {'Content-Type': 'application/json', 'Accept': 'application/json'};
  let {url, api_info} = rq;
  let body;
  api_info = api_info || {};
  const {api_name, api_prefix} = api_info;
  let method = rq.type.toLowerCase();
  if(api_prefix) url = api_prefix + url.substring(1);
  if(rq.data){
    if(method === 'get') url += '?' + dict2params(rq.data);
    else body = JSON.stringify(rq.data);
  }
  if(url)headers['API-URL'] = url;
  if(api_service) headers['API-SERVICE'] = api_service;
  if(token) headers['Authorization'] = `Basic ` + token;
  let tcm_api_prefix = sessionStorage.getItem('hostname')? 'http://ncfans.gene.ac/': `${service_info.endpoint }:${service_info.port || ''}`;
  console.log(tcm_api_prefix);

  if(method === 'delete') {headers['API-METHOD'] = method.toUpperCase();method = 'put'; }
  const fetch_url = `${tcm_api_prefix+rq.base_url}?${method === 'get' && rq.data? dict2params(rq.data): ''}`;
  if(rq.down){
    window.open(fetch_url);
    return;
  }
  return fetch(fetch_url, {method, headers: headers, body})
    .then((promise) => { return promise.json() })
    .then((res) => {
      res = res || {status: -1};
      if(!res.message) res.message = 'Request  exception';
      if(rq.success) rq.success(res);
      else console.log(res);
    })
    .catch(err => {
      // jy_tip(<span>Some problems occurred.  If you have a
      //                   confused question, you can send this link to the administrator email budechao@ict.ac.cn.  Link of this page:
      //                   <a href={window.location.href}>
      //                     {window.location.href}
      //                   </a>.</span>, 'error');
    });
};
export const get_auth_code = (func)=>{
  jy_request_common({
    type: 'GET',
    base_url: '/tcm/auth/code/',
    url: '',
    success: func
  })
};
export const jy_request = (rq, api_service=null) => {
  rq.base_url = '/tcm/api/';
  return jy_request_common(rq, api_service);
};

export const read_json =(file_name) => {

};
export const get_args = (url = "") => {
  if(url === '') url = window.location.search;
  const [, pStr = ""] = url.split('?'); // 使用解构赋值，避免了使用数组
  const args = {};
  pStr.split('&').map((it, i)=>{  // 箭头函数搭配map，避免了for循环，可以少定义变量
    const [k,v] = it.split('='); // 不用定义k，v并分开赋值，直接赋值 简化代码
    if(k)args[k]=decodeURIComponent(v);
  });
  return args;
};
export const dict2params = (dict) => {
  let params = '';
  Object.keys(dict).forEach(function (key) {
    params += `${key}=${dict[key]}&`;
  });
  return params.substring(0, params.length-1);
};

export const render_long_text = (text, len=20)=>{
  let show_text = text;
  if(typeof len !== 'number') len = 20;
  if(typeof text === 'string' && text.length > len) show_text = text.substring(0, len) + '...';
  return <Tooltip title={text}><span>{show_text}</span></Tooltip>
};

export const expandedRow = (dataSource, columns, expandedRowRender=null, backgroundColor='#dff0d8', rowKey='') => {
  if (dataSource.length === 0) return '暂无数据';
  console.log(backgroundColor, rowKey);
  return (
    <Table
      columns={columns}
      rowKey={rowKey}
      style={{width: '100%', background: backgroundColor || '#dff0d8!important' }}
      dataSource={dataSource||[]}
      pagination={false}
      size={'small'}
      scroll={{ y: 300 }}
      expandedRowRender={expandedRowRender}
    />
  );
};

export const expandedRowItem = (expandedRows) => {
  const columns = [
    { title: '检测项编号', dataIndex: 'item_id', width: '15%', render: (item_id, record, index)=> index + 1},
    { title: '检测项名称', dataIndex: 'item_name', width: '25%'},
    { title: '填写提示', dataIndex: 'description', width: '25%'},
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: '25%',
      render: () => (
        <span className="table-operation">
          <a href="javascript:;">编辑</a>
          <Divider type="vertical" />
          <a href="javascript:;">删除</a>
        </span>
      )
    },
  ];
  return expandedRow(expandedRows.items_info || expandedRows.items || [], columns, null, '', 'item_id');
};

// api请求
export const api_request = (rq) => jy_request(rq, 'api');

// 发消息
export const jy_tip = (msg, type='info', duration=3) => {
  let title = type === 'success' ? 'OK': type === 'info'? 'Tip': 'Fail';
  const m = Modal[type]({
    title: title,
    content: msg,
    okText: 'OK'
  });
  if(type === 'success' && duration>0){
    const timer = setInterval(() => {
      duration -= 1;
      m.update({title: msg, content: `The pop-up will close automatically in ${duration} seconds`});
    }, 1000);
    setTimeout(() => {
      clearInterval(timer);
      m.destroy();
    }, duration * 1000);
  }
  return m;
};

// 排序
export function cmp(a, b) {
  if(a > b) return 1;
  else if(a===b) return 0;
  else return -1;
}
export const jy_sort = (a, b, k) => {
  //小的在前，大的在后，一样的不交换。-1不交换，1交换
  if(!k) return cmp(a, b);
  if(!a && !b) return 0;
  if(!a && b) return -1;
  if(!b) return 1;
  if(a[k] && b[k])  {
    if(Array.isArray(a[k])) {
      console.log(a[k].length, b[k].length);
      return cmp(a[k].length, b[k].length);
    }
    return cmp(a[k], b[k]);
  }
  if(a[k] && !b[k]) return 1;
  if(!a[k] && b[k]) return -1;
  return false;
};
// 列设置
export const get_column = (title, key, sorted_info, others) => {
  others = others || {};
  return {
    title,
    dataIndex: key,
    columnKey: key,
    key,
    //defaultSortOrder: 'descend',
    sorter: (a, b) => {return jy_sort(a, b, key)},
    sortOrder: sorted_info? sorted_info.columnKey === key && sorted_info.order: false,
    ...others
  };
};

export const sort_columns = (columns, isEditing)=>{
  return columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    const {title, key, sorted_info, others} = col;
    col = get_column(title, key, sorted_info, others);
    return {
      ...col,
      onCell: record => ({
        record,
        //editable: col.editable,
        dataIndex: col.dataIndex,
        key: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
};

export const sortColumns = (data)=> {
  data = data || [];
  let items = [];
  let columns = [];
  let headers = [];
  let msg = '';
  if(typeof data === 'string') data = string2arraySimple(data);
  if(Array.isArray(data)){
    items = data.slice(1, data.length+1);
    items = items || [];
    let th = data[0];
    columns = [];
    if(th){
      columns = th.map((item, index)=>{
        let col = {};
        if(typeof item === 'object') col = {...col, ...item};
        else col = {title: item};
        headers = [...headers, col.title];
        return {
          ...col,
          dataIndex: index,
          render: (v)=>{
            if(!Array.isArray(v) && typeof v === 'object')  v = [v];
            if(Array.isArray(v)){
              return v.map((vItem, index)=>{
                let {title, link, style} = vItem;
                style = style || {};
                if(link) {
                  return <span style={style}><a href={link}>{title}</a>{(index< (v.length - 1))? '; ': ''}</span>;
                }
                return <span style={style}>{render_long_text(title)}</span>
              })
            }
            return render_long_text(v);
          }
        }
      })
    }
  }
  else if(typeof data === "string"){
    if(data.startsWith('NONE.')) msg = data.substring(5);
  }

  return {items, columns, msg, headers};
};

export const float2percent = (f, sign='%') =>parseInt(f * 10000) / 100 + sign;

//渲染数目
export const render_count = (items, status='success')=>{
  const count = Array.isArray(items)? items.length: items;
  return <span><Badge status={status}/>{count}</span>;
};

export const jy_form_error = (form, field, message)=>{
  form.setFields({[field]: {errors: [new Error(message)]}});
};
export const jy_form_item = (setting) => {
  setting = sort_value(setting);
  const {
    field, getFieldDecorator, size, label, is_group,
    initialValue, required, marginBottom
  } = setting;
  let {
    msg, tag, placeholder, items,
    radio_type, extra, labelCol, wrapperCol,
    style
  } = setting;
  style = style || {};
  let other = '';
  if(getFieldDecorator)delete setting.getFieldDecorator;
  msg = msg || `please input ${label || ''}`;
  if(tag === 'upload') msg = 'please upload';
  tag = tag || 'input';
  items = items || [];
  extra = extra || '';
  radio_type = radio_type || '';
  setting.placeholder = placeholder || msg;
  let setting1 = {style: {marginBottom: marginBottom || 0, ...style}};
  if (is_group || tag === 'matrix_textarea') {
    return (
      <Form.Item label={label} {...setting1}>
        <Row>
          {
            items.map((item, index) => {
              if(!item.field) item = {...item, field: (setting.item_id || setting.field) + index};
              return (
                <Col span={item.span || Math.round(24 / items.length)}>
                  {jy_form_item({
                    getFieldDecorator,
                    initialValue: initialValue ? initialValue[index] : '',
                    ...item,
                    labelCol: {span: item.labelCol || 8},
                    wrapperCol: {span: item.wrapperCol || 16}
                  })}
                </Col>
              )
            })
          }
        </Row>
      </Form.Item>
    );
  }
  const Tag = tag === 'input' ? (
    <Input {...setting} style={{width: setting.field.endsWith('_other')? '150px': ''}}/>
  ) : tag === 'textarea' ? (
    <Input.TextArea {...setting}/>
  ) : tag === 'select' ? (
    <Select
      showSearch
      name={field} size={size} buttonStyle={'solid'}
      filterOption={(input, option) =>
        option.props.children.toString().toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
      }
      {...setting}>
      {items.map(function (item, index) {
        if(typeof item !== 'object') item = {text: item, value: item};
        let {text, value} = item;
        if(!text)text = value;
        item.title = item.title || item.value;
        // delete item.text;
        return (<Select.Option {...item} key={index} index={index}>{text}</Select.Option>)
      })}
    </Select>
  ) : (tag === 'radio')? (
    <Radio.Group
      style={setting.groupStyle}
      name={field} size={size} buttonStyle={'solid'} onChange={(evt)=>setting.onChange?setting.onChange(evt): ''}>
      {
        items.map(function (item, index) {
          if(typeof item !== 'object') item = {value: item};
          item.text = item.text || item.value;
          item.title = item.title || item.value;
          if (item.value === '其他') {
            let item2 = items.find((item3)=>{
              if(typeof item3 === 'string') item3 = {value: item3};
              return item3.value === initialValue
            });
            other = jy_form_item({
              field: field + '_other',
              getFieldDecorator,
              wrapperCol: 5,
              size: 'small',
              initialValue: item2? '': initialValue
            });
            return '';
          }
          const Item = radio_type === 'btn' ? Radio.Button : Radio;
          return (<Item {...item} key={index}>{item.text}</Item>);
        })
      }
    </Radio.Group>
  ) : tag === 'checkbox' ? (
    <Checkbox.Group name={field} size={size} buttonStyle={'solid'} onChange={(evt)=>setting.onChange?setting.onChange(evt): ''}>
      {
        items.map(function (item, index) {
          if(typeof item === 'string') item = {value: item};
          item.text = item.text || item.value;
          item.title = item.title || item.value;
          if (item.value === '其他') {
            let initialValue1 = '';
            if(initialValue && initialValue.length > 0){
              initialValue1 = initialValue[initialValue.length - 1];
              let item2 = items.find((item3)=>{
                if(typeof item3 === 'string') item3 = {value: item3};
                return initialValue1 === item3.value;
              });
              if(item2) initialValue1 = ''
            }
            other = jy_form_item({
              field: field + '_other',
              getFieldDecorator,
              wrapperCol: 5,
              placeholder: '请输入其他',
              initialValue: initialValue1
            });
            return '';
          }
          return (<Checkbox {...item} key={index}>{item.text}</Checkbox>);
        })
      }
    </Checkbox.Group>
  ) : tag === 'switch' ? (
    <Switch {...setting}/>
  ) : tag === 'slider' ? (
    <Slider {...setting}/>
  ): tag === 'switch_text' ? (
    <p style={{margin : '1px 8px'}}>{setting.text}</p>
  ) : tag === 'monthpicker' ? (
    <MonthPicker placeholder={setting.placeholder}/>
  ) : tag === 'datepicker' ? (
    <DatePicker/>
  ) : tag === 'rangepicker' ? (
    <RangePicker/>
  ) : tag === 'rate' ? (
    <Rate character={<Icon type={'frown'}/>} allowHalf count={setting.count} tooltips={setting.tooltips}/>
  ) : tag === 'upload' ? (
    <Upload.Dragger
      accept={setting.accept}
      name={field}
      action={`${tcm_api_prefix}/tcm/upload/file/`}
      multiple={setting.multiple}
      showUploadList={true}
      beforeUpload={(file, fileList) => {
        // console.log(setting.fileList);
        const accept = setting.accept || '';
        const postfix = accept.split(',');
        if (file) {
          for (let p of postfix) {
            if (file.name.endsWith(p.trim())) return true;
          }
        }
        fileList.pop();
        jy_tip('仅允许' + accept + '结尾的文件');
        return false;
      }}
      onChange={(info) => {
        const status = info.file.status;
        if (status === 'done') {
          if(!setting.multiple) info.fileList = [info.file];
          jy_tip(`${info.file.name} upload successfully.`, 'success');
        } else if (status === 'error') {
          jy_tip(`${info.file.name} upload failed.`);
        }else{
          console.log(info);
        }
        if(setting.onChange) setting.onChange(info);
      }}
      style={{height: '150px!important', padding: '20px 80px'}}
    >
      <p className="ant-upload-drag-icon">
        <Icon type="inbox"/>
      </p>
      <p className="ant-upload-text">Click or drag file to this area to upload</p>
    </Upload.Dragger>
  ) : tag === 'cascader' ? (
    <Cascader
      showSearch={(inputValue, path) => {
        return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
      }}
      className={styles['kobas_cascader']}
      size={'large'}
      // style={{border: '1px solid red'}}
      // fieldNames={setting.filedNames}
      options={setting.options}
      onChange={setting.onChange}
      placeholder="Please select"
    />
  ) : tag === 'text'? setting.text:
    ''
  ;
  if (Tag === '') return `tag: ${tag}`;
  let option = {
    initialValue: initialValue,
    rules: [{required: required, message: msg}],
  };
  if (tag === 'upload') option = {
    ...option,
    valuePropName: 'fileList',
    getValueFromEvent: setting.getValueFromEvent,
    initialValue: setting.fileList
  };
  const content = field && getFieldDecorator? getFieldDecorator(field, option)(Tag): Tag;

  if (label) {
    setting1 = {...setting1, label};
    if (labelCol) setting1 = {...setting1, labelCol: (typeof labelCol) === 'object'? labelCol: {span: Number(labelCol)}};
    if (wrapperCol) setting1 = {...setting1, wrapperCol: (typeof wrapperCol) === 'object'? wrapperCol: {span: Number(wrapperCol)}};
    return (
      <Form.Item {...setting1}>
        {content}{extra}{other}
      </Form.Item>
    );
  }
  return <div {...setting1}>{content}{extra}</div>;

};
export const render_list = (option, getFieldDecorator, editing_record) =>  {
  console.log('render_list', option);
  let {extra, h1, header, data, uuids, initialIndex, label, item_name1, item_id,
    placeholder, description
  } = option;
  h1 = h1 || label || item_name1;
  header = header || placeholder || description;
  let {value} = option;
  extra = extra || [];
  const items = extra.map(function (text) {
    return {value: text, text: text, title: text};
  });
  try{
    value = JSON.parse(value)}
  catch(e){
    console.log(e);
  }
  return (
    <div>
      <h2>{h1}</h2>
      <h3>{header}</h3>
      <List
        size={'small'}
        bordered={true}
        dataSource={data}
        itemLayout={'vertical'}
        style={{marginBottom: '20px'}}
        renderItem={(item, index) => {
          let initialValue = extra[initialIndex || 0];
          try {
            initialValue = value? value[index]: editing_record[uuids[index]];
          }
          catch (e){
            console.log('render list error, info.tsx, line 38, ', e)
          }
          let input_option = {
            required: false,
            field: uuids? uuids[index]: item_id?  (item_id + index) :('list' + index),
            tag: 'radio', initialValue,
            items,
            getFieldDecorator
          };

          return (
            <List.Item style={{marginBottom: 0}} extra={jy_form_item(input_option)}>
              {index + 1}. {item}
            </List.Item>
          )
        }}
      />
    </div>
  )
};
export const sort_value = (item)=>{
  if(item ===undefined) return '';
  let {value} = item;
  if( value ) {
    try{
      value = JSON.parse(value);
    }catch (e){
    }
    if(item.tag !== 'upload'){
      item.initialValue = item.tag==='datepicker'? moment(value, 'YYYY-MM-DD'):
        item.tag === 'monthpicker'? moment(value, 'YYYY-MM'):
          value ;
    } else {
      if(Array.isArray(value)) value = value[0].name;
      const urls = value.split('/');
      item.fileList = [
        {
          uid: item.item_id,
          name: urls[urls.length-1],
          status: 'done',
        }
      ]
    }
    delete item.value;
  }
  return item;
};
export const jy_input = (settging) =>  jy_form_item({...settging, tag: 'input'});

export const jy_radio_btn = (settging) =>  jy_form_item({...settging, tag: 'radio'});
export const bool_setting = {
  tag: 'radio',
  items: [{value: true, text: '是'}, {value: false, text: '否'}]
};
export const bool_radiobox = (field, initialValue=true, getFieldDecorator, label='') => jy_form_item({
  ...bool_setting, label, field, initialValue, getFieldDecorator
});

//可编辑表格
export const EditableContext = React.createContext();
export const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);
export const form_in_modal = (title, items) => Form.create({ name: 'form_in_modal' })(
  // eslint-disable-next-line
  class extends React.Component {
    render() {
      const {
        visible, onCancel, onCreate, form, layout
      } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title={title}
          okText="确定"
          cancelText="取消"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout={layout}>
            {items.map(function (item, key) {
              return jy_form_item({...item, getFieldDecorator, key});
            })}
          </Form>
        </Modal>
      );
    }
  }
);

export const EditableFormRow = Form.create()(EditableRow);

export class EditableCell extends React.Component {
  getInput = () => {
    return <Input />;
  };

  render() {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      ...restProps
    } = this.props;
    return (
      <EditableContext.Consumer>
        {(form) => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? jy_form_item({field: dataIndex, getFieldDecorator, initialValue: record[dataIndex]})
                : restProps.children}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}

export const AddUserForm = form_in_modal('授权', [
  {
    is_group: true,
    items: [
      {field: 'account', prefix: (<Icon type="user"/>), placeholder: "请输入用户名"},
      {
        field: 'role', tag: 'radio', size: '', initialValue:'D', radio_type: 'btn',
        items:[{value: 'B', text: '管理员'}, {value: 'C', text: '数据员'}, {value: 'D', text: '阅览者'}]
      }
    ]
  }
]);
//auth相关


//查询任务
export const get_task = (task_id, success) => {
  api_request({
    url: `/${task_id}/`,
    type: 'get',
    success,
    api_info: {api_name: "查询任务", api_prefix: "/task/"}
  });
};

//查询任务log
export const get_task_log = (task_id, success) => {
  api_request({
    url: `/${task_id}/log/`,
    type: 'get',
    success,
    api_info: {api_name: "查询任务日志", api_prefix: "/task/"}
  });
};
//提交任务
export const post_task = (url, data, success) => {
  api_request({
    data,
    type: 'post',
    url: url,
    success,
    api_info: {api_name: "提交任务", api_prefix: ""}
  });
};

export const down_file = (res, func)=>{
  jy_request_common({
    down: true,
    data: res,
    type: 'GET',
    base_url: '/tcm/download/',
    url: '',
    success: func
  })
};
//保存文件
export const save_file = (res, func)=>{
  jy_request_common({
    data: res,
    type: 'POST',
    base_url: '/tcm/save/file/',
    url: '',
    success: func
  })
};

export const getNodesANDEdges = (edges, sourceKey, targetKey, nodeKey, sourceCategory, targetCategory)=>{
  if(typeof edges === 'string'){
    edges = string2array(edges);
  }
  let nodes = [];
  let legend = [];
  let categories = [];

  if(Array.isArray(edges)){
    let f1 = (a, k, category) =>{
      let item1 = nodes.find((node)=> node[nodeKey] === a);
      category = category || k;
      if(legend.indexOf(category) === -1){
        legend = [...legend, category];
        categories = [...categories, {name: category}];
      }
      if(!item1 && a){
        nodes = [
          ...nodes,
          {
            [nodeKey]: a,
            name: a,
            category,
            id: nodes.length
          }
        ]
      }
    };
    edges = edges.map((edge)=>{
      let {[sourceKey]: source, [targetKey]: target} = edge;
      source = source || '';
      target = target || '';
      f1(source, sourceKey, edge[sourceCategory]);
      f1(target, targetKey, edge[targetCategory]);
      return {
        ...edge,
        name: source +' - ' +target,
        source: nodes.findIndex((node)=>node[nodeKey] === source),
        target: nodes.findIndex((node)=>node[nodeKey] === target),
      }
    })
  }
  else edges = [];
  // edges = edges.map((edge, index)=>{
  //   let {[sourceKey]: source, [targetKey]: target} = edge;
  //   source = source || '';
  //   target = target || '';
  //
  //   return {
  //     ...edge,
  //     name: source +' - ' +target,
  //     source: nodes.findIndex((node)=>node[nodeKey] === source),
  //     target: nodes.findIndex((node)=>node[nodeKey] === target),
  //   }
  // });
  legend = legend.sort();
  return {nodes, edges, legend, categories};
};
// 排序
export let compare =(key, dataType)=>{
  return (a, b) =>{
    let v1 = a[key];
    let v2 = b[key];
    if(dataType === 'number') {
      v1 = Number(v1);
      v2 = Number(v2);
    }
    if(v1 > v2) return 1;
    if(v1 < v2) return -1;
    return 0
  }
};
//获取文件内容
export const get_file_content = (res, func)=>{
  jy_request_common({
    data: res,
    type: 'POST',
    base_url: '/file/content/',
    url: '',
    success: func
  })
};

export const string2arraySimple = (data, sep='\t', noHeader=false)=>{
  let lines = data.split('\n').filter((l)=> l !== '');
  data = lines.map((line)=> line.split(sep));
  return data;
};
export const string2array = (data, sep='\t', noHeader=false)=>{
  let lines = data.split('\n');
  let ths = lines[0].split(sep);
  let lines2 = lines.slice(1, lines.length);
  if(noHeader) lines2 = lines;
  data = lines2.map((line)=>{
    let ds = line.split(sep);
    if(noHeader) return ds;
    let item = {};
    ds.map((d1, index)=>{
      item = {...item, [ths[index]]: d1}
    });
    return item;
  });
  return data;
};

//获取物种
export const get_avai_taxonomy = (func)=>{
  jy_request_common({
    type: 'GET',
    base_url: '/avai/taxonomy/',
    url: '',
    success: func
  })
};


export const transfer_img = (file_path, func)=>{
  jy_request_common({
    data: {file_path},
    type: 'POST',
    base_url: '/transfer/img/',
    url: '',
    success: func
  })
};

export const get_file = (rq, func)=>{
  jy_request_common({
    type: 'POST',
    base_url: '/tcm/file/',
    data: rq,
    success: func
  })
};

const nonIds = 'NONHSAG000079.2\n' +
  'NONHSAG000446.3\n' +
  'NONHSAG000714.2\n' +
  'NONHSAG000966.3\n' +
  'NONHSAG001452.3\n' +
  'NONHSAG001643.2\n' +
  'NONHSAG002070.2\n' +
  'NONHSAG002378.3\n' +
  'NONHSAG002540.2\n' +
  'NONHSAG002725.2\n' +
  'NONHSAG002872.2\n' +
  'NONHSAG003236.3\n' +
  'NONHSAG003431.3\n' +
  'NONHSAG003816.2\n' +
  'NONHSAG004083.2\n' +
  'NONHSAG004224.3\n' +
  'NONHSAG004544.3\n' +
  'NONHSAG004756.2\n' +
  'NONHSAG004986.2\n' +
  'NONHSAG005226.2\n' +
  'NONHSAG005482.3\n' +
  'NONHSAG005687.3\n' +
  'NONHSAG006100.2\n' +
  'NONHSAG006339.2\n' +
  'NONHSAG006772.2\n' +
  'NONHSAG007116.2\n' +
  'NONHSAG007301.3\n' +
  'NONHSAG007400.2\n' +
  'NONHSAG007554.2\n' +
  'NONHSAG008236.3\n';


export const saveAsImg = (name='enriched_functions')=>{
  return {
    toolbox: {
      right: 0,
      bottom: 0,
      feature: {
        saveAsImage: {
          name,
          type: 'png',
          show: true,
          pixelRatio: 5,
          title: 'Save the figure',
          icon: 'M 893.3 293.3 L 730.7 130.7 c -7.5 -7.5 -16.7 -13 -26.7 -16 V 112 H 144 c -17.7 0 -32 14.3 -32 32 v 736 c 0 17.7 14.3 32 32 32 h 736 c 17.7 0 32 -14.3 32 -32 V 338.5 c 0 -17 -6.7 -33.2 -18.7 -45.2 Z M 384 184 h 256 v 104 H 384 V 184 Z m 456 656 H 184 V 184 h 136 v 136 c 0 17.7 14.3 32 32 32 h 320 c 17.7 0 32 -14.3 32 -32 V 205.8 l 136 136 V 840 Z M 512 442 c -79.5 0 -144 64.5 -144 144 s 64.5 144 144 144 s 144 -64.5 144 -144 s -64.5 -144 -144 -144 Z m 0 224 c -44.2 0 -80 -35.8 -80 -80 s 35.8 -80 80 -80 s 80 35.8 80 80 s -35.8 80 -80 80 Z'
        },
        dataView: {
          show: false
        }
      }
    },
  };
}

export const moduleTags = [
  {tag: 'GO', folder: 'GO', overall: 'all_GO.tsv'},
  {tag: 'KEGG', folder: 'KEGG', overall: 'all_KEGG.tsv'},
  {tag: 'MSIG', folder: 'MsigDB', overall: 'alltarget_MsigDB.tsv'},
];

