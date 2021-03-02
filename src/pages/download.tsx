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
        <Title>ncFANs Backend Databases Release Notes:</Title>
        <Title level={2}>Current Release</Title>
        <Title level={3}>December 20, 2019</Title>
        <ul>
          <li>The total of species has been increased from 4325 to 5945.</li>
          <li>The annotation and enrichment process of lncRNAs genes for human and mouse have been added.</li>
          <li> A more portable stand-alone version in pre-built docker image is available.</li>
        </ul>
        <Title level={3}>August 22, 2016</Title>
        <ul>
          <li>ProteinID (INSDC protein accession) IDs, called "Refseq Protein ID" in ncFANs have been supported for many species.The GI IDs have been removed because of the NCBI's announcement to eliminate GI's.</li>
          <li>The total of species has been increased from 4048 (last release, December 12, 2015 ) to 4325.</li>
          <li>These databases (PID, BioCarta, FunDO, GAD ) have not been updated in past two years. If you want them back, please email us.</li>
          <li>However, if have any questions or suggestions about ncFANs, please email to ncFANs@mail.cbi.pku.edu.cn</li>
        </ul>

        <Title level={1}>Download the pre-built docker via <a href="ftp://ftp.cbi.pku.edu.cn/pub/ncFANs_3.0_DOWNLOAD/docker/">FTP</a> service.</Title>
        <br/>
      </Typography>
    )
  }
}

export default Download;
