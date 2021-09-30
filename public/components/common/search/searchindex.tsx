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

import { EuiComboBox } from '@elastic/eui';
import React, { useState, useEffect, memo } from 'react';
import DSLService from '../../../services/requests/dsl';

export const IndexDropdown = memo(function indexDropdown(props: any) {
  return <SearchIndex {...props} />;
});

interface Fetch {
  dslService: DSLService;
}

export function SearchIndex(options: Fetch) {

  // console.log("here");
  const [indicesFromBackend, setindicesFromBackend] = useState([]);


  const getIndices = async (dslService: DSLService) => {
    if (indicesFromBackend.length === 0) {
      const indices = (await dslService.fetchIndices()).filter(
        ({ index }) => !index.startsWith('.')
      );
      // console.log("indices", indices);
      // setindicesFromBackend(indices);
      for (let i = 0; i < indices.length; i++) {
        indicesFromBackend.push({
          label: indices[i].index,
        });
      }
    }
  };
  // console.log("indicesFromBackend", indicesFromBackend)
  // console.log("indexList", indexList);
  useEffect(() => {
    getIndices(options.dslService);
  }, []);

  const [selectedOptions, setSelected] = useState(
     []
  );

  const onChange = (selectedOptions) => {
    setSelected(selectedOptions);
  };

  // console.log("setSelected", setSelected);

  return (
    <EuiComboBox
      placeholder="Select one or more index"
      options={indicesFromBackend}
      selectedOptions={selectedOptions}
      onChange={(e) => onChange(e)}
    />
  );
}
