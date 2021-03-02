import React from 'react';
import  "antd/lib/typography/Typography";
import Typography from "antd/lib/typography";
import {down_file} from './utils/request';
import download from "@/pages/kobas/download";
const {Title, Paragraph, Text} = Typography;

class Download extends React.Component {
  download = (file_path)=>{
    down_file({file_path});
  };
  render() {
    return (
      <Typography>
        <Title>KOBAS Backend Databases Release Notes:</Title>
        <Title level={2}>Current Release</Title>
        <Title level={3}>December 20, 2019</Title>
        <ul>
          <li>The total of species has been increased from 4325 to 5945.</li>
          <li>The annotation and enrichment process of lncRNAs genes for human and mouse have been added.</li>
          <li> A more portable stand-alone version in pre-built docker image is available.</li>
        </ul>
        <Title>KOBAS Algorithm and Function Update Notes:</Title>
        <ul>
          <li>Gene Set Enrichment Analysis (GSEA) algorithm has been added in the standalone version of KOBAS (kobas-2.1.1). You can go to "Download" for the new KOBAS.</li>
        </ul>
        <Title level={1}>Standalone version of Kobas 2.0</Title>
        <Paragraph>Download <a onClick={()=>this.download('/gpfs/www/kobas3/site/kobas-2.1.1/kobas-2.1.1.tar.gz')}>kobas-2.1.1.tar.gz</a></Paragraph>
        <br/>
        <Title level={1}>Standalone version of Kobas 3.0</Title>
        <Paragraph>Download <a onClick={()=>this.download('/gpfs/www/kobas3/site/kobas-2.1.1/kobas-3.0.3.tar.gz')}>kobas-3.0.3.tar.gz</a>, update on February 19, 2017.</Paragraph>
        <br/>
        <Title level={1}>Download the database of kobas 3.0 via <a href="ftp://ftp.cbi.pku.edu.cn/pub/KOBAS_3.0_DOWNLOAD/">FTP</a> service.</Title>
        <br/>
      </Typography>
    )
  }
}

export default Download;
