
import React from 'react';
import echarts from 'echarts';
import {Spin} from "antd";
import {
  saveAsImg
} from '@/pages/utils/request.js';


class Network extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      activeModuleIndex: 0,
      activeModuleTagIndex: 0,
      visible: false
    }
  }
  componentWillMount(): void {

  }
  setRefRight = (element) => {
    let {data} = this.props;
    data = data || {};
    let {nodes, edges, categories, legend} = data;
    nodes = nodes || [];
    edges = edges || [];
    console.log(nodes.length, edges.length);
    if (element && nodes.length > 0 && edges.length > 0 && nodes.length <1000 && edges.length < 5000) {
      console.log(nodes);
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(element);
      let option = {
        // title: {text: 'Module'+ (activeNetworkIndex+1) + ' NetWork'},
        color: [
          'rgb(254,122,0)',
          '#91c7ae',
          '#F38181',
          '#00A6A0',
          '#FCE38A',
          '#95E1D3',
          '#91C7AE',
          '#FFA5A5',
          '#E9904E',
          '#80D6FF',
          '#93B1C6',
          '#878ECD',
          '#586B8F',
          '#F06868',
          '#6EB6FF',
          '#FFED78',
        ],
        animation: false,
        legend: {
          data: legend,
          orient: 'vertical',  //垂直显示
          // y: 'center',    //延Y轴居中
          x: 'right', //居右显示
        },
        ...saveAsImg('network'),
        series: [{
          type: 'graph',
          layout: 'force',
          animation: false,
          // animationDuration: 10,
          label: {
            position: 'right',
            formatter: '{b}',
            color: '#666',

            // show: true,
            // fontSize: '28px'
          },
          draggable: true,
          roam: true,
          nodes,
          edges,
          symbolSize: 10,
          categories,
          zoom: nodes.length > 50? 1: 4,
          // force: {
          //   edgeLength: [100, 300],
          //   repulsion: 50,
          //   gravity: 0.2
          // },
          force: {
            // edgeLength: nodes.length< 20? 200: [5, 50],
            // repulsion: nodes.length< 20? 100: 20,
            edgeLength: [5, 100],
            repulsion: [5, 50],
            // repulsion: 100,
            gravity: 0.2
          },

        }]
      };
      myChart.setOption(option);
      // this.setState({nodes, edges})
    }
    else return ''

  };
  render(){
    return <div>
      <div ref={(e)=>this.setRefRight(e)} style={{ textAlign: 'center', width: '720px', height: '500px', margin: '0px auto'}}>
        <Spin spinning={true} style={{marginTop: '30%'}}/>
      </div>
    </div>
  }
}
export default Network;
