
import React from 'react';
import {Icon, Divider} from "antd";
import styles from './Connect.css';

export default function() {
  return (
    <div>
      <h1>Contact us</h1>
      <Divider orientation={'left'}><Icon type={'user'}/> <strong>Professor Yi Zhao</strong></Divider>
      <p><Icon type={'mail'}/> <a href="mailto:zhaoyi@ict.ac.cn">zhaoyi@ict.ac.cn</a></p>
      {/*<Divider orientation={'left'}><Icon type={'environment'}/></Divider>*/}
      <p><Icon type={'environment'}/> <strong>Institute of Computing Technology, Chinese Academy of Sciences</strong></p>
      <p><Icon type={'environment'}/> No.6, South Road, Zhongguancun Academy of Science, Haidian District, Beijing, China</p>
      <br></br>
      <Divider orientation={'left'}><Icon type={'user'}/> <strong>Professor Qi Liao </strong></Divider>
      <p><Icon type={'mail'}/> <a href="mailto:liaoqi@nbu.edu.cn">liaoqi@nbu.edu.cn</a></p>
      <p>
        <Icon type={'environment'}/>
        <strong>
          Department of Preventative Medicine, Medical School of Ningbo University
        </strong>
      </p>
      <p><Icon type={'environment'}/> No.818, Fenghua Road, Jiangbei District, Ningbo City, Zhejiang Province, China</p>
    </div>
  );
}
