
import React from 'react';
import echarts from 'echarts';
import {
  saveAsImg
} from '@/pages/utils/request.js';


class MsigBar extends React.Component{
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
    data = data || [];

    if(element){
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(element);
      // #00A6A0  Go
      // #95E1D3     KEGG
      // #F38181     MSig
      myChart.clear();
      if (data.length > 0) {
        console.log(data);
        let option = {
          color: ['#F38181'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: "category",
            data: data.map((item) => {
              return item['Hallmarks'].substring('HALLMARK_'.length, item['Hallmarks'].length);
            }),
            splitLine: {
              lineStyle: {
                type: 'dashed'
              }
            },
            axisLabel: {
              interval: 0,
              rotate: 90,
              fontSize: 8
            }
          },
          yAxis: [
            {
              type: 'value',
              name: '-Log10(FDR)',
              nameLocationGap: 30,
            }
          ],
          series: [
            {
              name: 'Msig',
              type: 'bar',
              barWidth: '60%',
              data: data.map((item) => {
                return {value: -Math.log10(Number(item['FDR'])), name: item['Hallmarks']}
              }),
              // label: {show: true}
            }
          ]
        };
        myChart.setOption({...option, ...saveAsImg()});
      }

      // else return null;
    }
  };
  render(){

    return <div>
      <div ref={(e)=>this.setRefRight(e)} style={{ width: '720px', height: '500px', margin: '0px auto'}}>
        No data
      </div>
    </div>
  }
}
export default MsigBar;
