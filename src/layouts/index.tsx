import React from 'react';
// import DocumentTitle from 'react-document-title';
import styles from './index.css';
import Header from './header';
import logo from '@/assets/ncFANs_logo.png';
import logo2 from '@/assets/LOGO2.png';
import {LocaleProvider, Layout, Divider, BackTop } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import en_US from 'antd/lib/locale-provider/en_US';
import PropTypes from "prop-types";
export type BasicLayoutComponent<P> = React.SFC<P>;


export interface BasicLayoutProps extends React.Props<any> {
  history?: History;
  location?: Location;
}

const BasicLayout: BasicLayoutComponent<BasicLayoutProps> = props => {
  const pathname = location.pathname;
  console.log('pathname', pathname, pathname === '/');
  let isRetrieve = pathname.indexOf('/retrieve/') > -1;
  let isIndex = pathname === '/';
  return (
    <LocaleProvider locale={en_US}>
      <div>
        <div className={styles.normal}>
          <Header className={styles["text-center"]}/>
          {
            isIndex? <div style={{width: '100%', background: '#F2F2F2', textAlign: 'center'}}>
              <div className={styles["index-layout-container"]}>
                <p style={{textAlign: 'center'}}>
                  <img src={logo2} alt="" width={'60%'}/>
                </p>
                <p style={{textAlign: 'center'}}>
                  NcFANs v2.0 is an updated and full-featured platform for the functional annotation of noncoding RNAs (ncRNAs), which comprises three major modules: ncFANs-CHIP, ncFANs-NET and ncFANs-eLnc.
                </p>
              </div>
            </div>: ''
          }
          <div className={styles[isRetrieve? 'layout-container-retrieve': "layout-container"]}>

            {props.children}
            <Divider/>
            {
              isIndex? <p style={{textAlign: 'center'}}>If you have any problems or suggestions, please feel free to <a href="/Contact/">contact</a> us. </p>: ''
            }
            <BackTop>
              <div className={styles['ant-back-top-inner']}>UP</div>
            </BackTop>
          </div>
        </div>

        <Layout.Footer style={{ paddingTop: '15px', paddingBottom: '10px', textAlign: 'center', marginTop: '50px'}}>
          Copyright © 2020. <span>All rights reserved.</span>
        </Layout.Footer>
      </div>
    </LocaleProvider>
  );
};
BasicLayout.contextTypes = { router: PropTypes.object.isRequired };

export default BasicLayout;
