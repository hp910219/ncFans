
import React from 'react';

import styles from './JYHelp.css';
import {Tooltip, Tag, Icon} from "antd";
class JYHelp extends React.Component{
  render(){
    let {title, placement} = this.props;
    return <Tooltip placement={placement} title={title}>
      <Tag color={'blue'} disabled={true}><Icon type={'question'}/></Tag>
    </Tooltip>
  }
}
export default JYHelp
