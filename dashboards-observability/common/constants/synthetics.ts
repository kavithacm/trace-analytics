/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */
export const BASE_QUERY = "search source = observability-synthetics-logs | sort - startTime | dedup url, testSuiteName";
export const ALL_LOGS_QUERY = BASE_QUERY + " | sort testSuiteName, url";
export const LATENCY_MAP_ID = 'latency_map_id_';
export const TABLE_ID = 'table_id_';

//redux
export const REDUX_SYNTHETICS_PPL_DATA_SLICE = 'pplDataSlice';


//field constants
export const START_TIME_FIELD = 'startTime';
export const URL_FIELD = 'url';
export const STATUS_FIELD = 'status';
export const STATUS_CODE_FIELD = 'response.status';
export const TEST_SUITE_NAME_FIELD = 'testSuiteName';
export const DOWNLOAD_TIME_FIELD = 'downloadTimeMs';
export const SUIT_ID = 'syntheticsSuiteId';

export const TABLE_REFRESH_INTERVAL_TIME = 50000; // 50 seconds

export const TIMING_FIELDS = [
  'starttransferTimeMs',
  'pretransferTimeMs',
  'sslTimeMs',
  'redirectTimeMs',
  'connectionTimeMs',
  'dnsTimeMs',
];
export const REDIRECT_TIMING_FIELD = 'redirectTimeMs';
export const STARTTRANSFER_TIMING_FIELD = 'starttransferTimeMs';
export const CONTENT_SIZE_FIELD = 'contentSizeKB';
export const DOWNLOAD_SPEED_FIELD = 'speedDownloadBytesPerSec';
export const PRIMARY_IP_FIELD = 'primaryIP';