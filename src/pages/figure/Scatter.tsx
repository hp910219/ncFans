
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
    let {data, folder} = this.props;
    data = data || [];

    if(element){
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(element);
      myChart.clear();
      if (data.length > 0) {
        console.log(data);
        data = data.filter((item, index)=> index< 20);
        let data1 = [];
        let yAxis = [];
        data.map((item) => {
          let {
            Number_of_genes_with_this_term_in_this_dataset,
            Total_number_of_genes_with_this_term,
            Function_term,
            FDR
          } = item;
          Function_term = Function_term || '';
          Number_of_genes_with_this_term_in_this_dataset = Number(Number_of_genes_with_this_term_in_this_dataset);
          Total_number_of_genes_with_this_term = Number(Total_number_of_genes_with_this_term);
          let y = Number_of_genes_with_this_term_in_this_dataset/Total_number_of_genes_with_this_term;
          data1 = [
            ...data1,
            {
              value: -Math.log10(Number(FDR)),
              name: Function_term,
              symbolSize: Math.sqrt(Total_number_of_genes_with_this_term)
            }
          ];
          yAxis = [...yAxis, Function_term.substring(0, 50) + (Function_term.length > 50? '...': '')]
        });
        // #00A6A0  Go
        // #95E1D3     KEGG
        let option = {
          color: [folder === 'GO'? '#00A6A0': '#95E1D3'],
          grid: {left: '5%', bottom: '10%', containLabel: true},
          xAxis: {
            name: '-Log10(FDR)', nameLocation: 'middle', nameGap: 30,
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
          series: [{
            data: data1,
            type: 'bar',
            label: {
              formatter: (params)=>{
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
            }
          }]
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
export default Scatter;
