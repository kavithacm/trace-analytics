/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { uniqueId } from 'lodash';
import { TAB_ID_TXT_PFX } from '../../../../common/constants/explorer';
import { TABLE_ID } from '../../../../common/constants/synthetics';

export const initialTabId: string = uniqueId(TAB_ID_TXT_PFX);
export const initialTable: string = uniqueId(TABLE_ID);