import { Card } from 'antd';
import { FormattedMessage } from 'umi';
import React from 'react';
import { Pie } from './Charts';
import Yuan from '../utils/Yuan';
import styles from '../style.less';

const ProportionSales = ({
  loading,
  salesPieData,
}) => (
  <Card
    loading={loading}
    className={styles.salesCard}
    bordered={false}
    title={
      <FormattedMessage
        id="dashboardanalysis.analysis.the-proportion-of-sales"
        defaultMessage="The Proportion of Sales"
      />
    }
    style={{
      height: '100%',
    }}
  >
    <div>
      <h4
        style={{
          marginTop: 8,
          marginBottom: 32,
        }}
      >
        <FormattedMessage id="dashboardanalysis.analysis.visits" defaultMessage="Sales" />
      </h4>
      <Pie
        hasLegend
        subTitle={<FormattedMessage id="dashboardanalysis.analysis.visits" defaultMessage="Sales" />}
        total={() => <Yuan>{salesPieData.reduce((pre, now) => now.y + pre, 0)}</Yuan>}
        data={salesPieData}
        valueFormat={value => <Yuan>{value}</Yuan>}
        height={248}
        lineWidth={4}
      />
    </div>
  </Card>
);

export default ProportionSales;
