/**
 * 页面统一模式
 */
import React from 'react';
// 引入 antd 组件
import {
  Breadcrumb, Tabs
} from 'antd';

import styles from '../../layouts/index.css'
import {Link} from "react-router-dom";

class JYModel extends React.Component {
  // 构造器
  constructor(props) {
    super(props);
  }
  render() {
    // 定义变量
    let {
      breadcrumbs, tabs, action
    } = this.props;
    breadcrumbs = breadcrumbs || [];
    breadcrumbs = [{text: 'Home', href: '/'}, ...breadcrumbs, {text: action}];
    tabs = tabs || [];
    // antd的Table组件使用一个columns数组来配置表格的列
    return (
      <div>
        <Breadcrumb className={styles["jy-breadcrumb"]}>
          {
            breadcrumbs.map((item, key)=>{
              return (
                <Breadcrumb.Item key={key}>
                  {
                    item.href?(
                      <Link to={item.href}>{item.text}</Link>
                    ): item.text
                  }
                </Breadcrumb.Item>
              )
            })
          }
        </Breadcrumb>
        {/*<Tabs type="card">*/}
        {/*  {*/}
        {/*    tabs.map( (item, key) => {*/}
        {/*      return (*/}
        {/*        <Tabs.TabPane tab={item.tab} key={action + key}>*/}
        {/*          {item.content}*/}
        {/*        </Tabs.TabPane>*/}
        {/*      )*/}
        {/*    })*/}
        {/*  }*/}
        {/*</Tabs>*/}
        {this.props.children}
      </div>
    );
  }
}

export default JYModel;
