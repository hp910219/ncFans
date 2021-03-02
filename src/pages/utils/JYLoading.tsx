
import React from 'react';

import styles from './JYLoading.css';
class JYLoading extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      dots: '.'
    }
  }
  componentWillMount(): void {
    this.timer=setInterval(()=>{
      let {dots} = this.state;
      let len = dots.length;
      if(len < 6) dots += '.';
      else dots = '';
      this.setState({dots})
    }, 1000)
  }

  render(){
    return <span>
      {this.state.dots}
    </span>
  }
}
export default JYLoading;
