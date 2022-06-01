/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { EuiButtonGroup, EuiFlexGroup, EuiFlexItem, EuiPanel, EuiSpacer } from "@elastic/eui";
import { PanelTitle } from "../../trace_analytics/components/common/helper_functions";
import { Plt } from "../../visualizations/plotly/plot";
import React, { useState } from "react";


export function LatencyMap({
    pieChartLogs,
}:{
    pieChartLogs:any
}) {
    const [chartToggleIdSelected, setChartToggleIdSelected] = useState(`Line`);

    const onChartIdChange = (optionId: React.SetStateAction<string>) => {
      setChartToggleIdSelected(optionId);
    };
  
    const chartToggleButtons = [
      {
        id: `Line`,
        label: 'Line',
      },
      {
        id: `Map`,
        label: 'Map',
      },
      {
        id: `Network`,
        label: 'Network',
      },
    ];
return (
    <EuiPanel>
        <PanelTitle title="Latency" />
        <EuiSpacer size="m" />
        <EuiButtonGroup
          legend="Map button group"
          options={chartToggleButtons}
          idSelected={chartToggleIdSelected}
          onChange={(id) => onChartIdChange(id)}
          color="primary"
          buttonSize="s"
        />
        <EuiFlexGroup>
        {/* <EuiFlexItem>
          <Plt
            data={[{
              values: pieChartLogs[0],
              labels: pieChartLogs[1],
              type: 'Line'
            }]}
            layout={{
              height: 250,
              width: 250
            }}
          />
          </EuiFlexItem> */}
          <EuiFlexItem>
          <Plt
              data={[
                {
                  type: 'scattergeo',
                  locationmode: 'USA-states',
                  lat: [47.8948, 39.0437],
                  lon: [-122.1987, -77.4875],
                  mode: 'lines',
                  line: {
                    width: 1,
                    color: 'red',
                  },
                  // opacity: opacityValue
                },
                {
                  type: 'scattergeo',
                  locationmode: 'USA-states',
                  lat: [47.8948, 37.7621],
                  lon: [-122.1987, -122.3971],
                  mode: 'lines',
                  line: {
                    width: 1,
                    color: 'red',
                  },
                  // opacity: opacityValue
                },
                {
                  type: 'scattergeo',
                  locationmode: 'USA-states',
                  lat: [47.8948, 37.7749],
                  lon: [-122.1987, -122.4194],
                  mode: 'lines',
                  line: {
                    width: 1,
                    color: 'red',
                  },
                  // opacity: opacityValue
                },
                {
                  type: 'scattergeo',
                  locationmode: 'USA-states',
                  lat: [47.8948, 47.6062],
                  lon: [-122.1987, -122.3321],
                  mode: 'lines',
                  line: {
                    width: 1,
                    color: 'red',
                  },
                  // opacity: opacityValue
                },
                {
                  type: 'scattergeo',
                  locationmode: 'USA-states',
                  lat: [47.8948, 43.7001],
                  lon: [-122.1987, -79.4163],
                  mode: 'lines',
                  line: {
                    width: 1,
                    color: 'red',
                  },
                  // opacity: opacityValue
                },
                {
                  type: 'scattergeo',
                  locationmode: 'USA-states',
                  lat: [47.8948, 39.0437],
                  lon: [-122.1987, -77.4875],
                  mode: 'lines',
                  line: {
                    width: 1,
                    color: 'red',
                  },
                  // opacity: opacityValue
                },
                {
                  type: 'scattergeo',
                  locationmode: 'USA-states',
                  lat: [47.8948, 39.0437],
                  lon: [-122.1987, -77.4875],
                  mode: 'lines',
                  line: {
                    width: 1,
                    color: 'red',
                  },
                  // opacity: opacityValue
                },
                {
                  type: 'scattergeo',
                  locationmode: 'USA-states',
                  lat: [47.8948, 39.0437],
                  lon: [-122.1987, -77.4875],
                  mode: 'lines',
                  line: {
                    width: 1,
                    color: 'red',
                  },
                  // opacity: opacityValue
                },
                {
                  type: 'scattergeo',
                  locationmode: 'USA-states',
                  lat: [47.8948, 39.0437],
                  lon: [-122.1987, -77.4875],
                  mode: 'lines',
                  line: {
                    width: 1,
                    color: 'red',
                  },
                  // opacity: opacityValue
                },
              ]}
              layout={{
                height: 750,
                width: 1200,
                geo: {
                  scope: 'world',
                  showcountries: true,
                  projection: {
                    type: 'natural earth',
                  },
                  showland: true,
                  landcolor: 'rgb(243,243,243)',
                  countrycolor: 'rgb(204,204,204)',
                  fitbounds: 'locations',
                },
              }}
            />
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiPanel>
 );
}