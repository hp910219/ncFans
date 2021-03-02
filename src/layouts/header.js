/**
 * Created by guhongjie on 2019/2/22 0022.
 */
import React from 'react';
import {Link} from 'react-router-dom';
import {
  Menu, Icon
} from 'antd';
import styles from './index.css';
import logo from '@/assets/ncFANs_logo.png';
class Header extends React.Component {
  constructor(props) {
    super(props);
    // 定义初始化状态
    this.state = {
      current: 'index',
      account: props.account
    };
  }

  handleClick = (e) => {
    this.setState({
      current: e.key,
    });
  };
  // 更新默认状态

  componentDidMount(){
    const pathname = window.location.pathname;
    let path = pathname.split('/');
    if(pathname.split('/').length>=3){ this.setState({current:path[1]})}
  }
  handleLogout =()=>{
    this.setState({account: null});
    sessionStorage.removeItem('account');
    sessionStorage.removeItem('access-token');
  };

  render() {
    let theme = 'dark';
    return (
      <div className={styles["header-container"]}>
        <Menu
          onClick={this.handleClick}
          selectedKeys={[this.state.current]}
          mode="horizontal"
          theme={theme}
          style={{lineHeight: '80px', width: '1100px', margin: '0 auto', padding: '0 8px'}}
          // className={styles.normal}
        >
          <Menu.Item key={'ncFANs'}>
            <Link to={'/'}><img src={logo} alt="" height={'40px'}/></Link>
          </Menu.Item>
          <Menu.Item key={'index'}>
            <Link to={'/'}><Icon type="home" />Home</Link>
          </Menu.Item>
          <Menu.Item key={'chip'}>
            <Link to={'/ncFansChip/'}><Icon type="appstore" />ncFANs-CHIP</Link>
          </Menu.Item>
          <Menu.Item key={'annotate'}>
            <Link to={'/Analysis/'}><Icon type="appstore" />ncFANs-NET</Link>
          </Menu.Item>

          <Menu.Item key={'eLNc'}>
            <Link to={'/ncFansELNc/'}><Icon type="appstore" />ncFANs-eLnc</Link>
          </Menu.Item>
          <Menu.Item key={'statistics'}>
            <Link to={'/statistics/'}><Icon type="appstore" />Statistics</Link>
          </Menu.Item>
          <Menu.Item key={'help'}>
            <Link to={'/help/'}><Icon type="question" />Help</Link>
          </Menu.Item>
          <Menu.Item key={'contact'}>
            <Link to={'/Contact/'}><Icon type="contacts" />Contact</Link>
          </Menu.Item>

        </Menu>
      </div>
    );
  }
}

export default Header;
