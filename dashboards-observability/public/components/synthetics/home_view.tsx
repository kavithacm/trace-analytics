/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Chart, Partition, PartitionLayout, Settings } from "@elastic/charts";
import {
  EuiFacetButton,
  EuiFlexGroup,
  EuiFlexItem,
  EuiText,
  EuiFacetGroup,
  EuiSpacer,
  EuiPageContent,
  EuiBasicTable,
  EuiLink,
  EuiFieldText,
  EuiSuperDatePicker,
  ShortDate,
  OnTimeChangeProps,
  EuiButtonGroup,
  EuiPanel,
  EuiInMemoryTable,
} from "@elastic/eui";
import { EUI_CHARTS_THEME_DARK } from "@elastic/eui/dist/eui_charts_theme";
import { DurationRange } from "@elastic/eui/src/components/date_picker/types";
import { uiSettingsService } from "../../../common/utils";
import PPLService from "../../../public/services/requests/ppl";
import React, { ChangeEvent, useEffect, useState } from "react";
import { onTimeChange } from "../custom_panels/helpers/utils";
import { PPLReferenceFlyout } from "../common/helpers";
import { LatencyMap } from "./plots/latency_map";
import { 
  TEST_SUITE_NAME_FIELD, 
  DOWNLOAD_TIME_FIELD, 
  START_TIME_FIELD, 
  STATUS_CODE_FIELD, 
  STATUS_FIELD, 
  URL_FIELD, 
  TABLE_REFRESH_INTERVAL_TIME,
  SUIT_ID} from '../../../common/constants/synthetics'
import { useFetchSynthetics } from './ppl/fetch_ppl';
import { useSelector } from 'react-redux';
import { selectTableData } from './redux/fetch_table_data_slice';
import { initialTable } from '../../../public/framework/redux/store/shared_state';
import { TestDetailsFlyout } from './helpers/test_details_flyout';

interface LogHistoryProps {
  pplService: PPLService;
};

export const SyntheticHomeTab = ({
  pplService,
}: LogHistoryProps) => {
  
  const [filterVal, setFilterVal] = useState('');  // stores extra filter to add onto queries
  const [isHelpFlyoutVisible, setHelpIsFlyoutVisible] = useState(false);
  const [pieChartLogs, setPieChartLogs] = useState<Array<Record<string, any>>>([]); // stores pie chart results

  const [testDetailsFlyoutVisible, setTestDetailsFlyoutVisible] = useState(false); // keeps track of if the test details flyout is visible
  const [testDetailsObj, setTestDetailsObj] = useState<Record<string, any>>({}); // store test suite object to show in test details flyout
  const [pplFilterValue, setPPLFilterValue] = useState('');  // has current filter typed into bar
  // below states used for date/time picker
  const [recentlyUsedRanges, setRecentlyUsedRanges] = useState<DurationRange[]>([]);
  const [start, setStart] = useState<ShortDate>('now-4h');
  const [end, setEnd] = useState<ShortDate>('now');
  const [timeVal, setTimeVal] = useState("");  // stores time value added onto queries
  const { fetchTableData, queryAccumulator } = useFetchSynthetics({
    pplService,
    });
  const tableData = useSelector(selectTableData)[initialTable];
  // console.log("table data: ",tableData);
  
  
  const showHelpFlyout = () => {
    setHelpIsFlyoutVisible(true);
  };

  const closeHelpFlyout = () => {
    setHelpIsFlyoutVisible(false);
  };

  const showTestDetailsFlyout = (item: Record<string, any>) => {
    setTestDetailsObj(item);
    setTestDetailsFlyoutVisible(true);
  };

  const closeTestDetailsFlyout = () => {
    setTestDetailsObj({});
    setTestDetailsFlyoutVisible(false);
  };


  let helpFlyout;
  if (isHelpFlyoutVisible) {
    helpFlyout = <PPLReferenceFlyout module="synthetics" closeFlyout={closeHelpFlyout} />;
  }

  let testDetailsFlyout;
  if (testDetailsFlyoutVisible) {
    testDetailsFlyout = (
      <TestDetailsFlyout testSuiteObject={testDetailsObj} closeFlyout={closeTestDetailsFlyout} />
    );
  }

  const updateQueryComponents = async () => {
    // pplServiceRequestor(finalPieQuery, 'data', setPieChartLogs);
    const finalHistoryQuery = queryAccumulator(
      start,
      end,
      filterVal
    );
    fetchTableData(finalHistoryQuery, 'jsonData', initialTable);
  };


  // here for when enter key is pressed on ppl bar, to apply changes to query from what is inputted into PPL bar
  const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (pplFilterValue === '') {
        setFilterVal('')
      } else {
        setFilterVal(pplFilterValue);
      }
      updateQueryComponents();
    }
  };

  // onchange has to be here to allow for changes to PPL bar (might be used later on for autocomplete?)
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPPLFilterValue(e.target.value);
    // setFilterVal(e.target.value);
  };

  const onDatePickerChange = (props: OnTimeChangeProps) => {
    onTimeChange(
      props.start,
      props.end,
      recentlyUsedRanges,
      setRecentlyUsedRanges,
      setStart,
      setEnd
    );
    setStart(props.start);
    setEnd(props.end);
    updateQueryComponents();
  };

  const columns = [
    {
      field: STATUS_FIELD,
      name: 'Status',
      sortable: true,
    },
    {
      field: TEST_SUITE_NAME_FIELD,
      name: 'Test Suite',
      render: (testSuite: string) => (
        <EuiLink href={`#${testSuite}`} target="_blank">
          {testSuite}
        </EuiLink>
      ),
      mobileOptions: {
        show: false,
      },
      sortable: true,
    },
    {
      field: SUIT_ID,
      name: 'Id',
      sortable: true,
    },
    // {
    //   field: URL_FIELD,
    //   name: 'URL',
    //   render: (url: string) => (
    //     <EuiLink href={`${url}`} target="_blank">
    //       {url}
    //     </EuiLink>
    //   ),
    //   mobileOptions: {
    //     show: false,
    //   },
    //   sortable: true,
    // },
    // {
    //   field: STATUS_CODE_FIELD,
    //   name: 'Status Code',
    //   sortable: true,
    // },
    {
      field: DOWNLOAD_TIME_FIELD,
      name: 'Latency',
      sortable: true,
    },
    {
      field: START_TIME_FIELD,
      name: 'Latest Time Polled',
      type: 'date',
      render: (date: Date) => {
        const datet: Date = new Date(date);
        // needed to convert date into local time, as the index stores times in UTC and this page
        // incorrectly reads it as local time (while being UTC) so the time will be off by the timezoneoffset
        const utcdate: Date = new Date(datet.getTime() - datet.getTimezoneOffset() * 60 * 1000);
        return utcdate.toString();
      },
      sortable: true,
    },
  ];

  // getRowProps allows for the rows to be clicked on, and to provide Test-Suite specific flyouts
  const getRowProps = (item: Record<string, any>) => {
    const { url, testSuiteName } = item;
    return {
      onClick: () => {
        console.log(`Clicked row ${testSuiteName} ${url} ${item}`);
        showTestDetailsFlyout(item);
      },
    };
  };

  useEffect(() => {
    updateQueryComponents();
  }, [filterVal]);

  // will pull from index logs every 5 seconds to update at that interval
  useEffect(() => {
    const interval = setInterval(() => {
      updateQueryComponents();    
    }, TABLE_REFRESH_INTERVAL_TIME);
    return () => clearInterval(interval);
  }, [filterVal]);

  return (
    <>
      <EuiFlexGroup gutterSize="s">
        <EuiFlexItem>
          <EuiFieldText
            placeholder="Use PPL 'where' clauses to add filters on all visualizations [where url = 'https://www.opensearch.org/']"
            value={pplFilterValue}
            fullWidth={true}
            onChange={onChange}
            onKeyPress={onKeyPress}
            // disabled={inputDisabled}
            append={
              <EuiLink
                aria-label="ppl-info"
                onClick={showHelpFlyout}
                style={{ padding: '10px' }}
              >
                PPL
              </EuiLink>
            }
          />
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiSuperDatePicker
            dateFormat={uiSettingsService.get('dateFormat')}
            start={start}
            end={end}
            onTimeChange={onDatePickerChange}
            recentlyUsedRanges={recentlyUsedRanges}
            onRefresh={() => {setFilterVal(pplFilterValue);
              console.log("comes here");
            }}
            // isDisabled={dateDisabled}
          />
        </EuiFlexItem>
      </EuiFlexGroup>
      <EuiSpacer size="m" />
      <LatencyMap
        pieChartLogs ={pieChartLogs}
      />
      <EuiSpacer size="xl" />
      <EuiFlexGroup>
        <EuiFlexItem grow={false} align-items="center">
          <EuiText>
            Synthetics History
          </EuiText>
        </EuiFlexItem>
        {/* <EuiFlexItem grow={false}>
          <EuiFacetGroup layout="horizontal" gutterSize="none">
            <EuiFacetButton onClick={() => {fetchTableData(ALL_LOGS_QUERY + filterVal + timeVal, "jsonData", setHistoryLogs)
                                            setHistoryQuery(ALL_LOGS_QUERY + filterVal + timeVal)}}>
              All
            </EuiFacetButton>
          </EuiFacetGroup>
        </EuiFlexItem> */}
      </EuiFlexGroup>
      <EuiSpacer size="s" />
      <EuiPageContent>
      <EuiInMemoryTable
          items={tableData}
          columns={columns}
          rowProps={getRowProps}
          pagination={{
            initialPageSize: 10,
            pageSizeOptions: [5, 10, 20],
          }}
          sorting={{
            sort: {
              field: TEST_SUITE_NAME_FIELD,
              direction: 'asc',
            },
          }}
          allowNeutralSort={false}
        />
      </EuiPageContent>
      {helpFlyout}
      {testDetailsFlyout}
    </>
  );
}