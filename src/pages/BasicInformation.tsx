
import React from 'react';
import {Button, Tag, Icon, Divider} from "antd";
import styles from './BasicInformation.css';
import echarts from 'echarts';
import JYTable from "@/pages/utils/JYTable";
import {get_file_content, saveAsImg} from '@/pages/utils/request.js';

class BasicInformation extends React.Component{
  constructor(props){
    super(props);
    this.state = {}
  }
  componentWillMount(): void {
    let {data} = this.props;
    console.log(data);
    let {basicInfoPath, GTEx_mean_exp, TCGA_mean_exp} = data;
    if(basicInfoPath){
      get_file_content({file_name: basicInfoPath}, (res)=>{
        let {data} = res;
        data = data || [];
        let {Gene_id, Name} = data[0];
        this.setState({dataSource: data || [], Gene_id, Name});
      });
      get_file_content({file_name: GTEx_mean_exp}, (res)=>{
        let {data} = res;
        this.setState({GTEx_mean_exp: data || [], dataKey: 'GTEx_mean_exp'});
      });
      get_file_content({file_name: TCGA_mean_exp}, (res)=>{
        let {data} = res;
        this.setState({TCGA_mean_exp: data || []});
      })
    }
  }
  setRefT = (element) => {
    let {Gene_id, dataKey} = this.state;
    let items = this.state[dataKey] || [];
    let xAxis = [];
    let data = [];
    let data2 = [];
    items.map((dItem)=>{
      let {Gene, Tissue, ['Mean(FPKM)']: Expr} = dItem;
      Tissue = Tissue || '';
      Expr = Number(Expr).toFixed(2);
      if(Gene_id === Gene) {
        if (dataKey === 'TCGA_mean_exp') {
          let {Cancer, Sample_type} = dItem;
          let [sample_type, n] = Sample_type.split('(');
          let x = Cancer;

          let bItem = { name: Sample_type, value: Expr, n};
          if(Sample_type.startsWith('Normal')) data = [...data, bItem];
          else data2 = [...data2, bItem];
          if(xAxis.indexOf(x) === -1)xAxis = [...xAxis, x];
        } else{
          let ts = Tissue.split('(');
          let x = ts[0];
          let n = Tissue.substring(x.length);
          xAxis = [...xAxis, x];
          data = [...data, {name: n, value: Expr}];
        }
      }
    });
    if(element){
      var myChart = echarts.init(element);
      let datas = [{name: 'Tissue', data}];
      let legend = ['Tissue'];
      if(data2.length > 0) {
        legend = ['Normal', 'Tumor'];
        datas[0].name = 'Normal';
        datas = [...datas, {name: 'Tumor', data: data2}];
      }
      myChart.clear();
      // #91C7AE normal
      // #FFA5A5  tumor

      if (items.length > 0) {
        // 基于准备好的dom，初始化echarts实例

        let option = {
          // title: {text: data.length},
          legend: {data: legend, top: '30', right: '25%'},
          color: ['#91C7AE', '#FFA5A5'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: (param)=>{
              console.log(param);
              // let {data} = param;
              return param[0].axisValue + '<br/>' + param.map((p)=>p.data.name + ':' + p.data.value).join('<br/>');
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          ...saveAsImg(),
          xAxis: [
            {
              // type: 'category',
              data: xAxis,
              splitLine: {
                lineStyle: {
                  type: 'dashed'
                }
              },
              axisLabel: {
                interval: 0,
                rotate: 90,
                fontSize: 10,
                margin: 3
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: 'Mean(FPKM)',
              // nameLocationGap: 40
            }
          ],
          series: datas.map((d)=>{
            return {
              name: d.name,
              type: 'bar',
              barWidth: '30%',
              data: d.data,
              label: {
                // formatter: '{c}  {name|{a}}',
                formatter: (param) =>{
                  return param.data.name
                }
              }
            }
          })
        };
        myChart.setOption(option);
      }
    }
  };
  render(){
    let {data} = this.props;
    let {basicInfoPath, GTEx_mean_exp, TCGA_mean_exp} = data;
    let {dataSource} = this.state;
    dataSource = dataSource || [];
    let columns = [
      {
        title: 'ncRNA', dataIndex: 'Name', searchable: true, render: (LncRNA, record)=>{
          let {Gene_id} = record;
          return <span>
            <a href={'https://www.genecards.org/cgi-bin/carddisp.pl?gene=' + Gene_id}>
              {LncRNA}
            </a>
          </span>
        }
      },
      {
        dataIndex: 'Gene_id', title: 'Ensemble_GeneID'
      },
      {
        dataIndex: 'Transcript_id', title: 'Ensemble_TransID'
      },
      {
        dataIndex: 'Location', render:(v, record)=>{
          let {Chr: chr, Start: start, End: end} = record;
          return <span>
            {chr}: {start} - {end}
          </span>
        }
      },
      {
        dataIndex: 'Strand'
      },

      {
        dataIndex: 'Expression',
        width: '300px',
        render: (Expression, record)=>{
          let {Gene_id, Name} = record;
          return <span>
            <Tag color={'blue'} onClick={()=> this.setState({Expression, Gene_id, Name, dataKey: 'GTEx_mean_exp'})}>
              <Icon type={'bar-chart'}/>
              <Divider type={'vertical'}/>
              Normal tissue
              {/*<Button onClick={()=> this.setState({Expression, Ensembl_gid})}>Normal tissue</Button>*/}
            </Tag>
            <Tag color={'orange'} onClick={()=> this.setState({Expression, Gene_id, Name, dataKey: 'TCGA_mean_exp'})}>
              <Icon type={'eye'}/>
              <Divider type={'vertical'}/>
              Cancer tissue
            </Tag>
          </span>
        }
      }
    ];
    let props = {dataSource, columns, dataPath: basicInfoPath,
      btns: [
        {text: 'Download genomic information', dataPath: basicInfoPath},
        {text: 'Download cancer tissue expression', dataPath: TCGA_mean_exp},
        {text: 'Download normal tissue expression', dataPath: GTEx_mean_exp},
      ]
    };
    return <div>
      <h2>Genomic Information</h2>
      <JYTable {...props}/>
      <h2>
        Expression - {this.state.Name}
      </h2>
      <div ref={(ele)=>this.setRefT(ele)} style={{ width: '100%', height: '560px', margin: '0px auto'}}></div>
    </div>
  }
}
export default BasicInformation;
