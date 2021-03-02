import { IConfig } from 'umi-types'; // ref: https://umijs.org/config/

const config: IConfig = {
  treeShaking: true,
  routes: [
    {
      path: '/',
      component: '../layouts/index',
      routes: [
        {
          path: '/download',
          component: './download',
        },
        {
          path: '/help',
          component: './help',
        },
        {
          path: '/task_id',
          component: './task_id',
        },
        {
          path: '/task_id',
          component: './task_id',
        },
        {
          path: '/retrieve2',
          component: './retrieve2',
        },
        {
          path: '/retrieve2',
          component: './retrieve2',
        },
        {
          path: '/retrieve/Combine',
          component: './retrieve/Combine',
        },
        {
          path: '/retrieve/ChipDif',
          component: './retrieve/ChipDif',
        },
        {
          path: '/retrieve',
          component: './retrieve',
        },
        {
          path: '/Analysis',
          component: './Analysis',
        },
        {
          path: '/BasicInformation',
          component: './BasicInformation',
        },
        {
          path: '/CoExpression/NetworkInfo',
          component: './CoExpression/NetworkInfo',
        },
        {
          path: '/CoExpression',
          component: './CoExpression',
        },
        {
          path: '/ProteinInteraction',
          component: './ProteinInteraction',
        },
        {
          path: '/figure/MsigBar',
          component: './figure/MsigBar',
        },
        {
          path: '/figure/Network',
          component: './figure/Network',
        },
        {
          path: '/figure/Scatter',
          component: './figure/Scatter',
        },
        {
          path: '/ncFansChip',
          component: './ncFansChip',
        },
        {
          path: '/ncFansNET',
          component: './ncFansNET',
        },
        {
          path: '/ncFansELNc',
          component: './ncFansELNc',
        },
        {
          path: '/ncFansELNc',
          component: './ncFansELNc',
        },
        {
          path: '/elncRetrieve',
          component: './elncRetrieve',
        },
        {
          path: '/ChipRetrieve',
          component: './ChipRetrieve',
        },
        {
          path: '/statistics',
          component: './statistics',
        },
        {
          path: '/utils/JYHelp',
          component: './utils/JYHelp',
        },
        {
          path: '/Contact',
          component: './Contact',
        },
        {
          path: '/',
          component: '../pages/index',
        },
      ],
    },
  ],
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: true,
        dynamicImport: false,
        title: 'ncFANs',
        dll: false,
        routes: {
          exclude: [
            /models\//,
            /services\//,
            /model\.(t|j)sx?$/,
            /service\.(t|j)sx?$/,
            /components\//,
          ],
        },
      },
    ],
  ],
};
export default config;
