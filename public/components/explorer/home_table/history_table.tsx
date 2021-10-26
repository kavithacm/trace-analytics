/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 *
 * Modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

import React, { useState, useRef, useEffect } from 'react';

import {
  EuiBasicTable,
  EuiSpacer,
} from '@elastic/eui';
import { uniqueId, get } from 'lodash';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { changeQuery } from '../slices/query_slice';
import { initialTabId } from '../../../framework/redux/store/shared_state';
import { RAW_QUERY } from '../../../../common/constants/explorer';

interface TableData {
  savedHistory: any;
  savedQuerySearch: (searchQuery: string, selectedDateRange: any) => void;
  savedQueryChange: (query: string, index: string) => void;
  savedTimeChange: (timeRange: Array<string>) => void;
}

export function Table(options: TableData) {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(3);
  const hisRef = useRef();
  hisRef.current = pageIndex;
  const thisRef = useRef();
  thisRef.current = pageSize;

  // const query= "search source=opensearch_dashboards_sample_data_logs | where utc_time > timestamp('2021-07-01 00:00:00') and utc_time < timestamp('2021-07-02 00:00:00')";

  const onTableChange = ({ page = {} }) => {
    const { index: pageIndex, size: pageSize } = page;

    setPageIndex(pageIndex);
    setPageSize(pageSize);
  };

  // console.log('history table: ', options.savedHistory);
  const columns = [
    {
      field: 'query',
      name: 'Name',
      onClick: (item) => {
        // console.log("item: ", item.target.value)
        options.savedQuerySearch(item.queryy, item.date)
      },
      render: (item)=>{return item.name},
    },
    {
      field: 'description',
      name: 'Description',
    },
  ];

  // onClick: (item) => {
  //   dispatch(
  //     changeQuery({
  //       tabId,
  //       query: {
  //         [RAW_QUERY]: queries.query,
  //         [SELECTED_DATE_RANGE]: queries.
  //       },
  //     })
  //   );
  //   history.push('/event_analytics/explorer');
  // },

  let queries = options.savedHistory.map((h) => {
    return {
      query: {
      name:    h?.savedVisualization?.name || h?.savedQuery?.name || '',
      queryy: h?.savedVisualization?.query || h?.savedQuery?.query || '',
        date: h?.savedVisualization?.selected_date_range || h?.savedQuery?.selected_date_range || ''
      },
      name: h?.savedVisualization?.name || h?.savedQuery?.name || '',
      description: h?.savedVisualization?.description || h?.savedQuery?.description || '',
      object: h,
      date: h?.savedVisualization?.selected_date_range || h?.savedQuery?.selected_date_range || ''
    };
  });

  console.log('queries: ', queries);
  const totalItemCount = queries.length;

  const pagination = {
    pageIndex,
    pageSize,
    totalItemCount,
    pageSizeOptions: [3, 5, 10],
  };

  return (
    <div>
      <EuiSpacer size="xl" />
      <EuiBasicTable
        items={queries.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize)}
        columns={columns}
        pagination={pagination}
        onChange={onTableChange}
        // onClick={options.savedQuerySearch(queries.query, queries.date)}
      />
    </div>
  );
}
