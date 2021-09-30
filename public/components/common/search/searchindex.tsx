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
  // const indexList: string[] = [];
  // const indicesFromBackend: [] = [];
  const [selectedOptions, setSelected] = useState([]);
  const [indicesFromBackend, setindicesFromBackend] = useState([]);

  const onChange = (selectedOptions) => {
    setSelected(selectedOptions);
  };

  const getIndices = async (dslService: DSLService) => {
    if (indicesFromBackend.length === 0) {
      const indices = (await dslService.fetchIndices()).filter(
        ({ index }) => !index.startsWith('.')
      );
      console.log("indices", indices);
      setindicesFromBackend(indices);
      // for (let i = 0; i < indices.length; i++) {
      //   indicesFromBackend.push({
      //     label: indices[i].index,
      //     // options: indexList,
      //   });
      //   // indexList.push(indices[i].index);
      // }
    }
  };
  console.log("indicesFromBackend", indicesFromBackend)
  useEffect(() => {
    getIndices(options.dslService);
  }, []);



  // const options = [];
  // let groupOptions = [];
  // for (let i = 1; i < 5000; i++) {
  //   groupOptions.push({ label: `option${i}` });
  //   if (i % 25 === 0) {
  //     options.push({
  //       label: `Options ${i - (groupOptions.length - 1)} to ${i}`,
  //       options: groupOptions,
  //     });
  //     groupOptions = [];
  //   }
  // }



  return (
    <EuiComboBox
      placeholder="Select one or more index"
      // options={options}
      // selectedOptions={selectedOptions}
      options={indicesFromBackend.map((index) => {
        return index.index;
      })}
      selectedOptions={selectedOptions}
      onChange={onChange}
    />
  );
}
