/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import datemath from '@elastic/datemath';
import {
  EuiButtonIcon,
  EuiContextMenuItem,
  EuiContextMenuPanel,
  EuiFlexGroup,
  EuiFlexItem,
  EuiIcon,
  EuiLoadingChart,
  EuiPanel,
  EuiPopover,
  EuiSpacer,
  EuiText,
  EuiToolTip,
} from '@elastic/eui';
import { UTC_DATE_FORMAT } from '../../../../../common/constants/shared';
import React, { useEffect, useMemo, useState } from 'react';
import { CoreStart } from '../../../../../../../src/core/public';
import PPLService from '../../../../services/requests/ppl';
import { displayVisualization, renderSavedVisualization } from '../../helpers/utils';
import './visualization_container.scss';

/*
 * Visualization container - This module is a placeholder to add visualizations in react-grid-layout
 *
 * Props taken in as params are:
 * editMode: boolean to check if the panel is in edit mode
 * visualizationId: unique visualization id
 * visualizationTitle: visualization name
 * query: ppl query to load the visualization
 * pplService: ppl requestor service
 * type: type of visualization [bar, horizontal_bar, line]
 * fromTime: start time in date filter
 * toTime: end time in date filter
 * onRefresh: boolean value to trigger refresh of visualizations
 * cloneVisualization: function to clone a visualization in panel
 * pplFilterValue: string with panel PPL filter value
 * showFlyout: function to show the flyout
 * removeVisualization: function to remove all the visualizations
 */

interface Props {
  http: CoreStart['http'];
  editMode: boolean;
  visualizationId: string;
  savedVisualizationId: string;
  pplService: PPLService;
  fromTime: string;
  toTime: string;
  onRefresh: boolean;
  pplFilterValue: string;
  usedInNotebooks?: boolean;
  fromApp?: boolean;
  switchToEditViz?: any;
  cloneVisualization?: (visualzationTitle: string, savedVisualizationId: string) => void;
  showFlyout?: (isReplacement?: boolean | undefined, replaceVizId?: string | undefined) => void;
  removeVisualization?: (visualizationId: string) => void;
  isLiveTailOn: boolean;
  liveTailName: string;
  sleepTime: number;
  setAbsoluteEndTime: string;
}

export const VisualizationContainer = ({
  http,
  editMode,
  visualizationId,
  savedVisualizationId,
  pplService,
  fromTime,
  toTime,
  onRefresh,
  pplFilterValue,
  usedInNotebooks,
  fromApp,
  switchToEditViz,
  cloneVisualization,
  showFlyout,
  removeVisualization,
  isLiveTailOn,
  liveTailName,
  sleepTime,
  setAbsoluteEndTime,
}: Props) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [disablePopover, setDisablePopover] = useState(false);
  const [visualizationTitle, setVisualizationTitle] = useState('');
  const [visualizationType, setVisualizationType] = useState('');
  const [visualizationMetaData, setVisualizationMetaData] = useState();
  const [visualizationData, setVisualizationData] = useState<Plotly.Data[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState('');
  const onActionsMenuClick = () => setIsPopoverOpen((isPopoverOpen) => !isPopoverOpen);
  const closeActionsMenu = () => setIsPopoverOpen(false);
  const [savedResponse, setSavedResponse] = useState<Plotly.Data[]>([]);
  const [changeSleep, setChangeSleep] = useState(0);
  const [intervalId, setIntervalId] = useState(0);

  let popoverPanel = [
    <EuiContextMenuItem
      key="Edit"
      disabled={disablePopover}
      onClick={() => {
        closeActionsMenu();
        if (fromApp) {
          switchToEditViz(savedVisualizationId);
        } else {
          window.location.assign(`#/event_analytics/explorer/${savedVisualizationId}`);
        }
      }}
    >
      Edit
    </EuiContextMenuItem>,
    <EuiContextMenuItem
      key="Replace"
      disabled={disablePopover}
      onClick={() => {
        closeActionsMenu();
        showFlyout(true, visualizationId);
      }}
    >
      Replace
    </EuiContextMenuItem>,
    <EuiContextMenuItem
      key="Duplicate"
      disabled={disablePopover}
      onClick={() => {
        closeActionsMenu();
        cloneVisualization(visualizationTitle, savedVisualizationId);
      }}
    >
      Duplicate
    </EuiContextMenuItem>,
  ];

  if (usedInNotebooks) {
    popoverPanel = [popoverPanel[0]];
  }

  const loadVisaulization = async () => {
    await renderSavedVisualization(
      http,
      pplService,
      savedVisualizationId,
      fromTime,
      toTime,
      pplFilterValue,
      setVisualizationTitle,
      setVisualizationType,
      setVisualizationData,
      setVisualizationMetaData,
      setIsLoading,
      setIsError,
      savedResponse,
      setSavedResponse,
      isLiveTailOn
    );
  };

  const memoisedVisualizationBox = useMemo(
    () => (
      <div className="visualization-div">
        {isLoading ? (
          <EuiLoadingChart size="xl" mono className="visualization-loading-chart" />
        ) : isError != '' ? (
          <div className="visualization-error-div">
            <EuiIcon type="alert" color="danger" size="s" />
            <EuiSpacer size="s" />
            <EuiText size="s">
              <p>{isError}</p>
            </EuiText>
          </div>
        ) : (
          displayVisualization(visualizationMetaData, visualizationData, visualizationType)
        )}
      </div>
    ),
    [onRefresh, isLoading, isError, visualizationData, visualizationType, visualizationMetaData]
  );

  useEffect(() => {
    loadVisaulization();
  }, [onRefresh]);

  useEffect(() => {
    if (!isLiveTailOn) {
      clearInterval(intervalId);
      setIntervalId(0);
      return;
    }

    if (sleepTime !== changeSleep) {
      clearInterval(intervalId);
      setIntervalId(0);
    }

    const newIntervalId = setInterval(() => {
      setAbsoluteEndTime(datemath.parse(toTime, { roundUp: true })?.utc().format(UTC_DATE_FORMAT));
      loadVisaulization();
    }, sleepTime);
    setIntervalId(newIntervalId);
    setChangeSleep(sleepTime);
    return () => {
      const interval_id = window.setInterval(function(){}, Number.MAX_SAFE_INTEGER);
      for (let i = 1; i < interval_id; i++) {
        window.clearInterval(i);
      }
    }
  }, [isLiveTailOn, sleepTime]);

  useEffect(() => {
    editMode ? setDisablePopover(true) : setDisablePopover(false);
  }, [editMode]);

  return (
    <EuiPanel className="panel-full-width" grow={false}>
      <div className={editMode ? 'mouseGrabber' : ''}>
        <EuiFlexGroup justifyContent="spaceBetween">
          <EuiFlexItem
            style={{
              width: '35%',
            }}
          >
            <EuiText grow={false} className="panels-title-text">
              <EuiToolTip delay="long" position="top" content={visualizationTitle}>
                <h5>{visualizationTitle}</h5>
              </EuiToolTip>
            </EuiText>
          </EuiFlexItem>
          <EuiFlexItem grow={false} className="visualization-action-button">
            {disablePopover ? (
              <EuiIcon
                type="crossInACircleFilled"
                onClick={() => {
                  removeVisualization(visualizationId);
                }}
              />
            ) : (
              <EuiPopover
                button={
                  <EuiButtonIcon
                    aria-label="actionMenuButton"
                    iconType="boxesHorizontal"
                    onClick={onActionsMenuClick}
                  />
                }
                isOpen={isPopoverOpen}
                closePopover={closeActionsMenu}
                anchorPosition="downLeft"
              >
                <EuiContextMenuPanel items={popoverPanel} />
              </EuiPopover>
            )}
          </EuiFlexItem>
        </EuiFlexGroup>
      </div>
      {memoisedVisualizationBox}
    </EuiPanel>
  );
};
