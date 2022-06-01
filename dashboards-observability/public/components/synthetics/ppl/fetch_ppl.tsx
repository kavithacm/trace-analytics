/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import PPLService from '../../../../public/services/requests/ppl';
import React from 'react';
import { useDispatch } from 'react-redux';
import { batch } from 'react-redux';
import { renderTableData } from '../redux/fetch_table_data_slice';
import { PPL_INDEX_REGEX, PPL_DATE_FORMAT } from '../../../../common/constants/shared';
import datemath from '@elastic/datemath';
import { BASE_QUERY, START_TIME_FIELD} from '../../../../common/constants/synthetics';

interface IFetchSyntheticsParams {
    pplService: PPLService;
//   requestParams: { tabId: string };
}

export const useFetchSynthetics = ({ pplService }: IFetchSyntheticsParams) => {
  const dispatch = useDispatch();
  
  const fetchTableData = async (
    query: string,
    type: string,
    id: string,
  ) => {
    // console.log("id in fetch_ppl: ",id);
    await pplService
      .fetch({ query: query, format: 'viz' })
      .then((res) => {
        let tempVal = [];
        for (const field of Object.keys(res[type])) {
          tempVal.push(res[type][field]);
        }
        batch(() => {
          dispatch(
            renderTableData({
              tableId: id,
              tableData: tempVal,
            })
          );
        });
        // result(tempVal);
        console.log("tempVal: ",tempVal);
      })
      .catch((error: Error) => {
        // setIsError(error.stack);
        console.error(error);
      })
      .finally(() => {
        // setIsLoading(false);
      });
  };

  const queryAccumulator = (
    startTime: string,
    endTime: string,
    panelFilterQuery: string
  ) => {
    // console.log("start time in acc:", startTime);
    // console.log("start time in acc:", endTime);
    const indexMatchArray = BASE_QUERY.match(PPL_INDEX_REGEX);
    if (indexMatchArray == null) {
      throw Error('index not found in Query');
    }
    const indexPartOfQuery = indexMatchArray[0];
    const filterPartOfQuery = BASE_QUERY.replace(PPL_INDEX_REGEX, '');
    const timeQueryFilter = ` | where ${START_TIME_FIELD} >= '${convertDate(startTime)}' and ${START_TIME_FIELD} <= '${convertDate(endTime)}'`;
    const pplFilterQuery = panelFilterQuery === '' ? '' : ` | ${panelFilterQuery}`;
    console.log("inside accumulator: ", indexPartOfQuery + timeQueryFilter + pplFilterQuery + filterPartOfQuery);
    return indexPartOfQuery + timeQueryFilter + pplFilterQuery + filterPartOfQuery;
  };

  const convertDate = (time: string) => {
    return datemath.parse(time, { roundUp: true })?.utc().format(PPL_DATE_FORMAT);
  }

  return {
      fetchTableData,
      queryAccumulator
  };
};
