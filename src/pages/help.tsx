import React from 'react';
import  "antd/lib/typography/Typography";
import Typography from "antd/lib/typography";
import {Alert, Tabs} from "antd";
import styles from './help.css';
import demoChip from '@/assets/ex_chip.png';
import demoNet from '@/assets/ex_net.png';
import demoELnc from '@/assets/ex_elnc.png';

const {Title, Paragraph, Text} = Typography;

class Help extends React.Component {
  render() {
    let {hash} = window.location;
    let tab = '0';
    if(hash) tab = '1';
    return (
      <div>
        <Alert description={<span>
          NcFANs v2.0 is an updated and full-featured platform for noncoding RNA (ncRNA) functional annotation, which comprises three major modules of ncFANs-CHIP, ncFANs-NET and ncFANs-eLnc.
          &nbsp;
          <a href="http://ncfans.gene.ac/static/workflow.6465a60d.png" target={'_blank'}>See the workflow</a>.
        </span>}/>
        <br/>
        <Tabs defaultActiveKey={tab} type={'card'}>
          <Tabs.TabPane tab={'Manual'} key={'0'}>
            <h2>Example of the output of ncFANs-CHIP</h2>
            <p><a href="http://ncfans.gene.ac/retrieve/?taskid=8d491e02d648481688450f7badccd4f4" target={'_blank'}>go to the demo result</a></p>
            <p>
              In this example, microarray data GSE16919 were used with default parameters.
            </p>
            <p style={{textAlign: 'center'}}>
              <img src={demoChip} alt="" width={'70%'}/>
            </p>
            <h2>Example of the output of ncFANs-NET</h2>
            <p><a href="http://ncfans.gene.ac/retrieve/?taskid=363507a55eb44fefb34281cd40bdcf44" target={'_blank'}>go to the demo result</a></p>
            <p>
              In this example, we aimed to annotate the functions of 3 ncRNAs (lncRNA PVT1, lncRNA LINC00265 and snoRNA AL356356.1) in human colorectal cancer. Therefore, the co-expression and co-methylation networks of TCGA-COAD were selected and 4234 differentially expressed PCGs (PMID: 29374362) served as candidate targets. For the co-expression network, we required the minimum ncRNA-PCG correlation coefficients greater than 0.4, PCG-PCG correlation coefficients greater than 0.5, and TOM greater than 0.01. For the co-methylation network, ncRNA-PCG and PCG-PCG correlation coefficients and TOM should be greater than 0.3, 0.6 and 0, respectively. For the lncRNA-centric regulatory network and RF-based network, default parameters were used. The output results were interpreted in the following figure.
            </p>
            <p style={{textAlign: 'center'}}>
              <img src={demoNet} alt="" width={'70%'}/>
            </p>
            <h2>Example of the output of ncFANs-eLnc</h2>
            <p><a href="http://ncfans.gene.ac/retrieve/?taskid=b2631e730bf44e2491e3afceca2bd593" target={'_blank'}>go to the demo result</a></p>
            <p>
              GRO-seq data (SRA008244) was used in this example. Alignment and Assembly were performed based on STAR and StringTie to generate the de novo transcriptome in GTF format as the input file for our server. Next, the human cell line IMR90 was chosen to identify the elncRNAs. The output result was interpreted in the following figure.
            </p>
            <p style={{textAlign: 'center'}}>
              <img src={demoELnc} alt="" width={'70%'}/>
            </p>

          </Tabs.TabPane>
          <Tabs.TabPane tab={'FAQ'} key={'1'}>
            <div id={'Q1'}>
              <Title level={3}>1.	What is the hub-based method?</Title>
              <p>In the hub-based method, ncRNAs and PCGs respectively serve as the hub and neighbors in the network. The enriched functions of the directly connected PCGs will be assigned to the ncRNA.</p>
            </div>
            <div id={'Q2'}>
              <Title level={3}>2.	What is the module-based method?</Title>
              <p>
                In the module-based method, ncFANs employs the SPICi [1] with default parameters to extract modules from the network. Based on the hypothesis that the tightly connected genes in a certain module always exert similar functions, ncRNAs within a functional module are assigned functions of the PCGs in the same module.
              </p>

            </div>
            <div id={'Q3'}>
              <Typography>
                <Title level={3}>3.	How did we construct the co-expression network in ncFANs-NET?</Title>
              </Typography>
              <p>
                The co-expression network has been well-verified to exhibit great performance for ncRNA functional annotation [2, 3]. The strategy we adopted to construct the co-expression network is shown in the following. First, tissue- and cancer-specific RNA-seq data were respectively downloaded from GTEx and TCGA database. Next, R package WGCNA [4] was used to calculate the Spearman correlation coefficients (Rho), Fisher's asymptotic P-value and topological overlap measure (TOM). A pair of genes with adjusted P-value (FDR correction) &lt; 0.05, Rho and TOM > user-defined cutoff will be considered to be co-expressed.
              </p>
            </div>
            <div id={'Q4'}>
              <Typography>
                <Title level={3}>4.	What is the topological overlap measure (TOM) in co-expression and co-methylation networks?</Title>
              </Typography>
              <p>
                TOM is an approach taken by Ravasz et al. to measure how close pairs of nodes are in a network [5]. They demonstrate the potential of using the set of immediate neighbors of a pair of nodes as a basis for measuring pair-wise similarity. Moreover, two substrates having a higher overlap are more likely to belong to the same functional class than substrates having a lower topological overlap. Therefore, in the co-expression and co-methylation network, TOM is incorporated to better estimate the connectivity property of two correlated genes.
              </p>
            </div>
            <div id={'Q5'}>
              <Typography>
                <Title level={3}> 5.	How did we construct the co-methylation network in ncFANs-NET?</Title>
              </Typography>
              <p>
                Recent studies proposed that co-methylation events of gene pairs always indicated the similar molecular functions they tended to have, and thus can be used for ncRNA functional annotation [6-9]. Our strategy for co-methylation network construction is shown in the following. For normal tissue, BS-seq data were downloaded from MethBank database [10] and classified by methylation type and genomic regions. Each gene has a methylation level in a specific condition of methylation type and region. For cancers, illumina 450K array data were downloaded from TCGA database, of which the probes targeting the promoter regions (+/-2kb around transcription start site) were reserved for further analyses. Next, the transcripts, which have at least 3 probes in promoter regions and the average Spearman correlation coefficients among probes are greater than 0.2, were considered to be valid and reliable records. And the average beta values of the probes targeting the same promoter will be assigned as the methylation level of the transcript. Besides, the methylation level of the transcript should be transformed to the DNA layer. If a gene has multiple qualified isoforms, only the maximum methylation level will be assigned to the gene. After obtaining the methylation levels of the genes, the calculation of correlation was performed using WGCNA R package as described in Q4.
              </p>
            </div>
            <div id={'Q6'}>
              <Typography>
                <Title level={3}>6.	How did we construct the lncRNA-centric regulatory network in ncFANs-NET?</Title>
              </Typography>
              <p>
                LncRNA-centric regulatory network is composed of the lncRNA-PCG relationships detected by multi-Omics data and software. To construct the lncRNA-centric regulatory network, we investigated the lncRNA-PCG relationships in aspects of transcription factor (TF) binding activities, competing endogenous RNA (ceRNA) mechanism, RNA-binding activities and lncRNA-DNA triplexes. The specific workflows of obtaining these relationships are illustrated in the published study [11]. The only difference is that we provided the information of lncRNA-DNA triplexes here which were generated by the software Triplexator [12], but they merely serve as reference for users and are not incorporated into the network construction owing to the limited reliability.
              </p>
            </div>
            <div id={'Q7'}>
              <Typography>
                <Title level={3}>
                  7.	How did we construct the random forest-based lncRNA-PCG interactive network in ncFANs-NET?
                </Title>
              </Typography>
              <p>
                LncRNA-PCG generally interactive network is based on the recently published method [13]. According to the user-defined cutoff, we will obtain the qualified lncRNA-PCG interactions to construct the generally interactive network.
              </p>
            </div>
            <div id={'Q8'}>
              <Typography>
                <Title level={3}>
                  8.	Why uploading BAM file is not recommended? And how can you convert alignment results to assembled transcriptome?
                </Title>
              </Typography>
              <p>
                Owing to the unpredictable download time and storage, we do not recommend users to upload alignment results in .BAM format. You are encouraged to perform de novo assembly locally and then upload GTF file instead. Our strategies for de novo assembly are shown in the following:
              </p>
              <p className={styles['textIndent30']}>a. For RNA-seq data, the software StringTie [14] is used.</p>
              <p className={styles['textIndent45']}>stringtie –p thread_num –o output.gtf input.bam</p>
              <p className={styles['textIndent30']}>b. For GRO-seq data, the software Homer [15] is used.</p>
              <p className={styles['textIndent45']}>homer/bin/makeTagDirectory Homer_tagdir –genome mm10/hg38 input.bam</p>
              <p className={styles['textIndent45']}>homer/bin/findPeaks Homer_tagdir –style groseq –rev –o denovotranscripts.txt –gtf output.gtf</p>
            </div>
            <div id={'Q9'}>
              <Typography>
                <Title level={3}>
                  9.	How did we define the enhancer regions in ncFANs-eLnc?
                </Title>
              </Typography>
              <p>
                Enhancer identification was based on the H3K27ac histone modification data from Cistrome database [16]. Peaks fully located within blacklisted regions or +/-2kb of transcription start sites were filtered out. Given the fact that eRNA transcription region could be wider than the ChIP-seq peaks, we defined the +/-3 kb regions around the middle point of these tentative enhancers as potential eRNA-transcribing enhancers.
              </p>
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab={'Reference'} key={'2'}>
            <p>1.	Jiang P, Singh M. SPICi: a fast clustering algorithm for large biological networks, Bioinformatics 2010;26:1105-1111.</p>
            <p>2.	Leng D, Huang C, Lei KC et al. Co-expression network analysis of lncRNAs and mRNAs in rat liver tissue reveals the complex interactions in response to pathogenic cytotoxicity, Int J Biol Sci 2019;15:2296-2307.</p>
            <p>3.	Liao Q, Liu C, Yuan X et al. Large-scale prediction of long non-coding RNA functions in a coding-non-coding gene co-expression network, Nucleic Acids Res 2011;39:3864-3878.</p>
            <p>4.	Langfelder P, Horvath S. WGCNA: an R package for weighted correlation network analysis, BMC Bioinformatics 2008;9:559.</p>
            <p>5.	Ravasz E, Somera AL, Mongru DA et al. Hierarchical organization of modularity in metabolic networks, Science 2002;297:1551-1555.</p>
            <p>6.	Akulenko R, Helms V. DNA co-methylation analysis suggests novel functional associations between gene pairs in breast cancer samples, Hum Mol Genet 2013;22:3016-3022.</p>
            <p>7.	Liao Q, He W, Liu J et al. Identification and functional annotation of lncRNA genes with hypermethylation in colorectal cancer, Gene 2015;572:259-265.</p>
            <p>8.	Ma X, Yu L, Wang P et al. Discovering DNA methylation patterns for long non-coding RNAs associated with cancer subtypes, Comput Biol Chem 2017;69:164-170.</p>
            <p>9.	Wei Y, Dong S, Zhu Y et al. DNA co-methylation analysis of lincRNAs across nine cancer types reveals novel potential epigenetic biomarkers in cancer, Epigenomics 2019;11:1177-1190.</p>
            <p>10.	Li R, Liang F, Li M et al. MethBank 3.0: a database of DNA methylomes across a variety of species, Nucleic Acids Res 2018;46:D288-D295.</p>
            <p>11.	Zhang Y, Tao Y, Ji H et al. Genome-wide identification of the essential protein-coding genes and long non-coding RNAs for human pan-cancer, Bioinformatics 2019;35:4344-4349.</p>
            <p>12.	Buske FA, Bauer DC, Mattick JS et al. Triplexator: detecting nucleic acid triple helices in genomic and transcriptomic data, Genome Res 2012;22:1372-1381.</p>
            <p>13.	Zhang Y, Yi T, Ji H et al. Designing a general method for predicting the regulatory relationships between long noncoding RNAs and protein-coding genes based on multi-omics characteristics, Bioinformatics 2020;36:2025-2032.</p>
            <p>14.	Pertea M, Pertea GM, Antonescu CM et al. StringTie enables improved reconstruction of a transcriptome from RNA-seq reads, Nat Biotechnol 2015;33:290-295.</p>
            <p>15.	Heinz S, Benner C, Spann N et al. Simple combinations of lineage-determining transcription factors prime cis-regulatory elements required for macrophage and B cell identities, Mol Cell 2010;38:576-589.</p>
            <p>16.	Mei S, Qin Q, Wu Q et al. Cistrome Data Browser: a data portal for ChIP-Seq and chromatin accessibility data in human and mouse, Nucleic Acids Res 2017;45:D658-D662.</p>
            </Tabs.TabPane>
        </Tabs>

      </div>
    )
  }
}

export default Help;
