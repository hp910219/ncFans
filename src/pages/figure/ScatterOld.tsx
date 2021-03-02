
import React from 'react';
import echarts from 'echarts';
import {
  saveAsImg
} from '@/pages/utils/request.js';


class Scatter extends React.Component{
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
      myChart.clear();
      if (data.length > 0) {
        console.log(data);
        let data1 = [];
        let yAxis = [];
        data.map((item) => {
          let {
            Pvalue,
            Number_of_genes_with_this_term_in_this_dataset,
            Total_number_of_genes_with_this_term,
            Function_term,
          } = item;
          Number_of_genes_with_this_term_in_this_dataset = Number(Number_of_genes_with_this_term_in_this_dataset);
          Total_number_of_genes_with_this_term = Number(Total_number_of_genes_with_this_term);
          let y = Number_of_genes_with_this_term_in_this_dataset/Total_number_of_genes_with_this_term;
          data1 = [
            ...data1,
            {
              value: -Math.log2(Number(Pvalue)),
              name: Function_term,
              symbolSize: Math.sqrt(Total_number_of_genes_with_this_term)
            }
          ];
          yAxis = [...yAxis, Function_term]
        });
        let option = {
          grid: {left: '5%', bottom: '10%', containLabel: true},
          xAxis: {
            splitLine: {
              lineStyle: {
                type: 'dashed'
              }
            }
          },
          yAxis: {
            data: yAxis,
            splitLine: {
              lineStyle: {
                type: 'dashed'
              }
            },
            scale: true,
            containLabel: true
          },
          visualMap: [
            {
              left: 'right',
              bottom: '5%',
              dimension: 6,
              min: 0,
              max: 50,
              itemHeight: 120,

              precision: 0.1,
              text: ['-log2(PValue)'],
              textGap: 30,
              textStyle: {
                // color: '#fff'
              },
              inRange: {
                colorLightness: [1, 0.5]
              },
              outOfRange: {
                color: ['rgba(255,255,255,.2)']
              },
              controller: {
                inRange: {
                  color: ['rgb(129, 227, 238)']
                },
                outOfRange: {
                  color: ['rgb(25, 183, 207)']
                }
              }
            }
          ],
          series: [{
            data: data1,
            type: 'scatter',
            label: {
              formatter: (params)=>{
                console.log(params);
                let {data: item} = params;
                let {name, value} = params;
                return name + '\n' + (value.toFixed(2))
              }
            },
            emphasis: {
              label: {
                show: true,
                position: 'top'
              }
            },
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(25, 100, 150, 0.5)',
              shadowOffsetY: 5,
              color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
                offset: 0,
                color: 'rgb(129, 227, 238)'
              }, {
                offset: 1,
                color: 'rgb(25, 183, 207)'
              }])
            }
          }]
        };
        myChart.setOption({...option, ...saveAsImg});
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
export default Scatter;
