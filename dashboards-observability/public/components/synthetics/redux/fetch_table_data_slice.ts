/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { createSlice } from '@reduxjs/toolkit';
import { initialTable } from '../../../../public/framework/redux/store/shared_state';
import { REDUX_SYNTHETICS_PPL_DATA_SLICE } from '../../../../common/constants/synthetics';

// const initialTable: string = uniqueId(TABLE_ID);

const initialState = {
  [initialTable]: [],
};

export const tableDataSlice = createSlice({
  name: REDUX_SYNTHETICS_PPL_DATA_SLICE,
  initialState,
  reducers: {
    renderTableData: (state, { payload }) => {
      state[payload.tableId] = payload.tableData;
      // console.log("maybe");
    },
    reset: (state, { payload }) => {
      state[payload.tableId] = {};
    },
  },
});

export const { renderTableData, reset } = tableDataSlice.actions;

export const selectTableData = (state: { tableData: any; }) => state.tableData;

export default tableDataSlice.reducer;