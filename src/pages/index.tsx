import React from 'react';
import { Form, Button, Input, Typography, Row, Col, Card, Popover, Icon} from 'antd';
import logo2 from '@/assets/LOGO2.png';
const {Title} = Typography;
import {
  get_args
} from './utils/request';
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class ResultRetrieve extends React.Component {
  constructor(props){
    super(props);
  }
  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }

  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    // Only show error after a field is touched.
    const usernameError = isFieldTouched('task_id') && getFieldError('task_id');
    return (
      <Form layout="inline" onSubmit={this.props.handleSubmit}>
        <Form.Item
          // initialValue={this.props.taskid}
          validateStatus={usernameError ? 'error' : ''} help={usernameError || ''} label={'Input your task id here'}>
          {getFieldDecorator('task_id', {
            initialValue: this.props.taskid
            //rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input
              //prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Input your task id here"
            />,
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>
            search
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
const ResultForm = Form.create({ name: 'result_retrieve' })(ResultRetrieve);
class Index extends React.Component {
  constructor(props) {
    // To disabled submit button at the beginning.
    super(props);
    let args = get_args();
    let {taskid} = args;
    this.state = {
      task_info: null, content: '', loading: true, taskid, unmarked: [],
      activateKey: 'data',
      visible_Database: false,
    };
  }
  componentWillMount(){
  }
  saveFormRef = (formRef, k) => { this[k] = formRef; };
  handleSubmit = e => {
    this.setState({content: '', task_log: '', unmarked: []});
    e.preventDefault();

    this.SearchForm.props.form.validateFields((err, values) => {
      if (!err) {
        let {task_id} = values;
        window.open('/retrieve/?taskid=' + task_id);
      }
    });
  };
  render() {
    let tools = [
      {
        type: 'info',
        title: 'ncFANs-CHIP',
        icon: <Icon type={'border-outer'}/>,
        demo: 'http://ncfans.gene.ac/retrieve/?taskid=8d491e02d648481688450f7badccd4f4',
        msg: <span>
          For the functional annotation of ncRNAs based on microarray data
        </span>,
        detail: <p style={{paddingLeft: '0'}}>
          <b>ncFANs-CHIP</b> retains the original function for microarray data analysis.
          In this module, we first re-annotate the probes of the user-uploaded microarray data to not only mRNA and lncRNAs but also miRNAs, snoRNAs, snRNAs, rRNAs and tRNAs. Next, gene expression levels will be calculated to construct the coding-noncoding co-expression network.
          Besides, if comparable samples under two conditions are provided, differential expression analyses are also supported.
          Finally, <a href="/help/?#Q1">hub-</a>  and <a href="/help/?#Q2">module-based methods</a>  are used to discover the connected protein-coding genes (PCGs) of the query ncRNA in the co-expression network, and the functions of PCGs will be assigned to ncRNA.
        </p>
      },
      {
        type: 'warning',
        title: 'ncFANs-NET',
        icon: <Icon type={'deployment-unit'}/>,
        demo: 'http://ncfans.gene.ac/retrieve/?taskid=363507a55eb44fefb34281cd40bdcf44&',
        msg: <span>
          For the data-free functional annotation based on the pre-built networks
        </span>,
        detail: <p style={{paddingLeft: '0'}}>
          <b>ncFANs-NET</b> is designed for functional annotation of ncRNAs based on four kinds of relational networks
          including normal tissue- and disease-specific <a href="/help/?#Q3">co-expression networks</a>
          , <a href="/help/?#Q5">co-methylation networks</a> ,
          general <a href="/help/?#Q6">lncRNA-centric regulatory networks</a>  and <a href="/help/?#Q7">random forest-based lncRNA-PCG interactive network</a> . Different from the co-expression network in ncFANs-CHIP, networks in this module are pre-built by using the large-scale sequencing data from public databases and algorithms, and thus, should be more robust and valid. Therefore, users only need to input their ncRNAs of interest and select the background networks. The connected PCGs of the query ncRNA in different networks and the corresponding functions will be separately shown in the output interface. Besides, after obtaining the ncRNA-PCG relationships in different networks, users can easily choose to merge or intersect them to generate a more comprehensive or reliable result.
        </p>
      },
      {
        type: 'success',
        title: 'ncFANs-eLnc',
        icon: <span role="img" aria-label="node-index" className="anticon anticon-node-index"><svg
          viewBox="64 64 896 896" focusable="false" data-icon="node-index" width="1em" height="1em" fill="currentColor"
          aria-hidden="true"><defs><style></style></defs><path
          d="M843.5 737.4c-12.4-75.2-79.2-129.1-155.3-125.4S550.9 676 546 752c-153.5-4.8-208-40.7-199.1-113.7 3.3-27.3 19.8-41.9 50.1-49 18.4-4.3 38.8-4.9 57.3-3.2 1.7.2 3.5.3 5.2.5 11.3 2.7 22.8 5 34.3 6.8 34.1 5.6 68.8 8.4 101.8 6.6 92.8-5 156-45.9 159.2-132.7 3.1-84.1-54.7-143.7-147.9-183.6-29.9-12.8-61.6-22.7-93.3-30.2-14.3-3.4-26.3-5.7-35.2-7.2-7.9-75.9-71.5-133.8-147.8-134.4-76.3-.6-140.9 56.1-150.1 131.9s40 146.3 114.2 163.9c74.2 17.6 149.9-23.3 175.7-95.1 9.4 1.7 18.7 3.6 28 5.8 28.2 6.6 56.4 15.4 82.4 26.6 70.7 30.2 109.3 70.1 107.5 119.9-1.6 44.6-33.6 65.2-96.2 68.6-27.5 1.5-57.6-.9-87.3-5.8-8.3-1.4-15.9-2.8-22.6-4.3-3.9-.8-6.6-1.5-7.8-1.8l-3.1-.6c-2.2-.3-5.9-.8-10.7-1.3-25-2.3-52.1-1.5-78.5 4.6-55.2 12.9-93.9 47.2-101.1 105.8-15.7 126.2 78.6 184.7 276 188.9 29.1 70.4 106.4 107.9 179.6 87 73.3-20.9 119.3-93.4 106.9-168.6zM329.1 345.2a83.3 83.3 0 11.01-166.61 83.3 83.3 0 01-.01 166.61zM695.6 845a83.3 83.3 0 11.01-166.61A83.3 83.3 0 01695.6 845z"></path></svg></span>,
        demo: 'http://ncfans.gene.ac/retrieve/?taskid=b2631e730bf44e2491e3afceca2bd593',
        msg: <span>
          For the identification of enhancer-derived lncRNAs
        </span>,
        detail: <p>
          <b>ncFANs-eLnc</b> enables expedite identification of enhancer-derived lncRNAs
          which possibly exert enhancer-like function.
          In this module, users either provide the enhancer regions or
          select the <a href="/help/?#Q9">cell- and tissue-specific enhancers</a>  pre-annotated based on H3K27ac modification.
          Novel lncRNAs with transcription start site located in enhancers will be sought from the de novo assembled transcriptome
          in GTF format (highly recommended) or <a href="/help/?#Q8">alignment results in BAM format</a>  uploaded by users and defined as enhancer-derived lncRNAs.
        </p>
      },
    ];
    return (
      <Typography style={{textAlign: 'center'}}>
        <Title level={4}>Result Retrieve</Title>
        <ResultForm
          wrappedComponentRef={(form)=>this.saveFormRef(form, 'SearchForm')}
          handleSubmit={this.handleSubmit}
          taskid={this.state.taskid}
        />
        {/*<div>*/}
        {/*  (Go to the demo result:&nbsp;*/}
        {/*  <a href="http://ncfans.gene.ac/retrieve/?taskid=8d491e02d648481688450f7badccd4f4" target={'_blank'}>ncFANs-CHIP</a>,&nbsp;*/}
        {/*  <a href="http://ncfans.gene.ac/retrieve/?taskid=363507a55eb44fefb34281cd40bdcf44&tab=12" target={'_blank'}>ncFANs-NET</a>,&nbsp;*/}
        {/*  <a href="http://ncfans.gene.ac/retrieve/?taskid=b2631e730bf44e2491e3afceca2bd593" target={'_blank'}>ncFANs-eLnc</a>*/}
        {/*  )*/}
        {/*</div>*/}
        <br/>
        <div style={{paddingLeft: '0', listStylePosition: 'inside'}}>
          <Title level={4}>Analytical Tools</Title>
          <Row gutter={16}>
            {
              tools.map((tool, index)=>{
                let {title, msg, detail, demo, icon} = tool;
                return <Col span={24/tools.length} key={index} style={{textAlign: 'center'}}>
                  <Card bodyStyle={{padding: '12px'}} style={{borderColor: '#2E74A3', borderWidth: '4px'}}>
                    <div>
                      <p style={{fontSize: '24px'}}>{icon}</p>
                      <Title level={4}><b>{title}</b></Title>
                      <p style={{marginTop: '20px'}}>{msg}</p>
                      <p style={{marginTop: '40px'}}>
                        <Popover overlayStyle={{width: '30%'}} content={<div>{detail}</div>} >
                          <Button>More</Button>
                        </Popover>
                        &nbsp;
                        <a href={demo} target={'_blank'}>Go to the demo</a>
                      </p>
                    </div>
                  </Card>

                </Col>
              })
            }
          </Row>
        </div>
        {/*<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>*/}
        {/*<p>*/}
        {/*  <Title level={4}>NcFANs v2.0 is an updated and full-featured platform for noncoding RNA (ncRNA) functional annotation, which comprises three major modules:</Title>*/}
        {/*</p>*/}
        {/*<p style={{paddingLeft: '0'}}>*/}
        {/*  1.<b>ncFANs-CHIP</b> retains the original function for microarray data analysis.*/}
        {/*  In this module, we first re-annotate the probes of the user-uploaded microarray data to not only mRNA and lncRNAs but also miRNAs, snoRNAs, snRNAs, rRNAs and tRNAs. Next, gene expression levels will be calculated to construct the coding-noncoding co-expression network.*/}
        {/*  Besides, if comparable samples under two conditions are provided, differential expression analyses are also supported.*/}
        {/*  Finally, <a href="/help/?#Q1">hub-</a>  and <a href="/help/?#Q2">module-based methods</a>  are used to discover the connected protein-coding genes (PCGs) of the query ncRNA in the co-expression network, and the functions of PCGs will be assigned to ncRNA.*/}
        {/*</p>*/}
        {/*<p style={{paddingLeft: '0'}}>*/}
        {/*  2.<b>ncFANs-NET</b> is designed for functional annotation of ncRNAs based on four kinds of relational networks*/}
        {/*  including normal tissue- and disease-specific <a href="/help/?#Q3">co-expression networks</a>*/}
        {/*  , <a href="/help/?#Q5">co-methylation networks</a> ,*/}
        {/*  general <a href="/help/?#Q6">lncRNA-centric regulatory networks</a>  and <a href="/help/?#Q7">random forest-based lncRNA-PCG interactive network</a> . Different from the co-expression network in ncFANs-CHIP, networks in this module are pre-built by using the large-scale sequencing data from public databases and algorithms, and thus, should be more robust and valid. Therefore, users only need to input their ncRNAs of interest and select the background networks. The connected PCGs of the query ncRNA in different networks and the corresponding functions will be separately shown in the output interface. Besides, after obtaining the ncRNA-PCG relationships in different networks, users can easily choose to merge or intersect them to generate a more comprehensive or reliable result.*/}
        {/*</p>*/}
        {/*<p>*/}
        {/*  3.<b>ncFANs-eLnc</b> enables expedite identification of enhancer-derived lncRNAs*/}
        {/*  which possibly exert enhancer-like function.*/}
        {/*  In this module, users either provide the enhancer regions or*/}
        {/*  select the <a href="/help/?#Q9">cell- and tissue-specific enhancers</a>  pre-annotated based on H3K27ac modification.*/}
        {/*  Novel lncRNAs with transcription start site located in enhancers will be sought from the de novo assembled transcriptome*/}
        {/*  in GTF format (highly recommended) or <a href="/help/?#Q8">alignment results in BAM format</a>  uploaded by users and defined as enhancer-derived lncRNAs.*/}
        {/*</p>*/}
        {/*<p>*/}
        {/*  Altogether, ncFANs v2.0 draws on the strengths from the proposed methods of ncRNA functional annotation and integrates them into an all-round online service. It is expected that our new ncFANs will serve as a powerful booster for uncovering the regulatory mechanisms of ncRNAs.*/}
        {/*</p>*/}
        {/*<p style={{textAlign: 'center'}}>*/}
        {/*  <img src={workflow} alt="" width={'80%'}/>*/}
        {/*</p>*/}

      </Typography>
    )
  }
}

export default Index;
