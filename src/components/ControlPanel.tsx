import React, { useContext } from 'react';
import styled from 'styled-components';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { getUnixTime } from 'date-fns';

import { theme } from '../styles';
import { StateContext } from '../components/State';
import TextField from '@mui/material/TextField';
import anticipatedInputWidget from '../utils/widgets/anticipatedInputWidget';
import reportsWidget from '../utils/widgets/reportsWidget';
import siteWidget from '../utils/widgets/siteWidget';
import triggeringEventWidget from '../utils/widgets/triggeringEventWidget';

function ControlPanel(): React.ReactElement {
  const {
    handleModalClick,
    priority,
    paramApiId,
    paramEditorApiPriorityLevel,
    selectedDate,
    setSelectedDate,
    updateSearchParams,
    apiKey,
    extraParams,
    UIPriorityLevel,
    viewParamsRef,
  }: any = useContext(StateContext);

  const handleAnticipatedClick = () => {
    const newWidget = anticipatedInputWidget(
      apiKey,
      [
        viewParamsRef.current.lat,
        viewParamsRef.current.lon,
        viewParamsRef.current.zoom,
      ],
      extraParams.citobsParams,
    );
    handleModalClick('anticipated', newWidget);
  };

  const handleReportsClick = () => {
    const newWidget = reportsWidget(
      apiKey,
      [
        viewParamsRef.current.lat,
        viewParamsRef.current.lon,
        viewParamsRef.current.zoom,
      ],
      extraParams.citobsParams,
    );
    handleModalClick('reports', newWidget);
  };

  const handleSiteCick = () => {
    const newWidget = siteWidget(
      apiKey,
      [
        viewParamsRef.current.lat,
        viewParamsRef.current.lon,
        viewParamsRef.current.zoom,
      ],
      extraParams.citobsParams,
    );
    handleModalClick('site', newWidget);
  };

  const handleTriggeringClick = () => {
    const newWidget = triggeringEventWidget(
      apiKey,
      [
        viewParamsRef.current.lat,
        viewParamsRef.current.lon,
        viewParamsRef.current.zoom,
      ],
      extraParams.citobsParams,
    );
    handleModalClick('triggering', newWidget);
  };

  return (
    <>
      <TopRightContainer>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            // displayStaticWrapperAs="desktop"
            openTo="year"
            value={selectedDate}
            ampm={false}
            ampmInClock={false}
            inputFormat={'dd/MM/yyyy HH:mm'}
            onChange={(newValue) => {
              setSelectedDate(newValue);
              updateSearchParams({ time: getUnixTime(newValue) });
            }}
            PaperProps={{
              sx: {
                margin: '10px -25px 0 0',
                zIndex: 2500,
              },
            }}
            PopperProps={{
              sx: {
                zIndex: 2500,
              },
            }}
            DialogProps={{
              sx: {
                zIndex: 2500,
              },
            }}
            renderInput={(params) => (
              <TextField
                sx={{
                  bgcolor: 'background.paper',
                  boxShadow: 1,
                  borderRadius: 2,
                  minWidth: 300,
                }}
                {...params}
              />
            )}
          />
        </LocalizationProvider>
        <InfoContainer>
          <InfoRow>
            System API-ID:&nbsp;<b>{paramApiId === '' ? 'none' : paramApiId}</b>
          </InfoRow>
          <InfoRow>
            Priority:&nbsp;<b>{priority == null ? 'loading..' : priority}</b>
          </InfoRow>
          {paramEditorApiPriorityLevel != null && (
            <InfoRow>
              Editor Priority:&nbsp;
              <b>{paramEditorApiPriorityLevel}</b>
            </InfoRow>
          )}
        </InfoContainer>
      </TopRightContainer>
      <BottomRightContainer>
        {UIPriorityLevel >= 3 && (
          <Button onClick={handleSiteCick}>Setting monitoring site</Button>
        )}
        {UIPriorityLevel >= 3 && (
          <Button onClick={handleAnticipatedClick}>
            Setting anticipated data input service type
          </Button>
        )}
        {UIPriorityLevel >= 3 && (
          <Button onClick={handleTriggeringClick}>
            Setting triggering event
          </Button>
        )}
        {UIPriorityLevel >= 2 && (
          <Button onClick={handleReportsClick}>Reports and requests</Button>
        )}
      </BottomRightContainer>
    </>
  );
}

const InfoContainer: any = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px 0 10px 0;
  align-items: flex-end;
  pointer-events: none !important;
`;

const InfoRow: any = styled.div`
  display: flex;
  flex-direction: row;
  color: ${theme.palette.colors.black};
  width: 150x;
`;

const Button: any = styled.div`
  display: flex;
  flex-direction: row;
  background: ${theme.palette.colors.white};
  color: ${theme.palette.colors.black};
  border-bottom: 1px solid #ccc;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.55);
  height: 40px;
  border-radius: 2px;
  margin: 0 0 10px 0;
  padding: 0 10px 0 5px;
  line-height: 40px;

  &:hover {
    cursor: pointer;
    filter: brightness(95%);
  }
`;

const TopRightContainer: any = styled.div`
  position: fixed;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
  flex: 1;
  z-index: 2000;
  font: bold 18px;
  font-size: 18px;
  font-family: ${theme.typography.primary};
  line-height: 30px;
  text-indent: 1px;
  justify-content: flex-end;
  pointer-events: none;
  > * {
    pointer-events: auto;
  }
`;

const BottomRightContainer: any = styled.div`
  position: fixed;
  bottom: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
  flex: 1;
  z-index: 2000;
  font: bold 18px;
  font-size: 18px;
  font-family: ${theme.typography.primary};
  line-height: 30px;
  text-indent: 1px;
  justify-content: flex-end;
`;

export default ControlPanel;
