import React, { useContext } from 'react';
import styled from 'styled-components';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { theme } from '../styles';
import { StateContext } from '../components/State';
import TextField from '@mui/material/TextField';

function ControlPanel(): React.ReactElement {
  const { priority, paramApiId, selectedDate, setSelectedDate }: any =
    useContext(StateContext);

  return (
    <Container>
      <InfoContainer>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            // displayStaticWrapperAs="desktop"
            openTo="year"
            value={selectedDate}
            ampm={false}
            ampmInClock={false}
            onChange={(newValue) => {
              setSelectedDate(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <InfoRow>
          System API-ID:&nbsp;<b>{paramApiId}</b>
        </InfoRow>
        <InfoRow>
          Priority:&nbsp;<b>{priority == null ? 'loading..' : priority}</b>
        </InfoRow>
      </InfoContainer>
      {/* <Button>Import</Button> */}
    </Container>
  );
}

const InfoContainer: any = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 0 10px 0;
`;

const InfoRow: any = styled.div`
  display: flex;
  flex-direction: row;
  color: ${theme.palette.colors.black};
`;

const Button: any = styled.div`
  display: flex;
  flex-direction: row;
  background: ${theme.palette.colors.white};
  color: ${theme.palette.colors.black};
  border-bottom: 1px solid #ccc;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.55);
  height: 30px;
  border-radius: 2px;
  margin: 0 0 10px 0;
  padding: 0 10px 0 5px;

  &:hover {
    cursor: pointer;
    filter: brightness(95%);
  }
`;

const Container: any = styled.div`
  position: fixed;
  width: 176.24px;
  bottom: 160px;
  left: 10px;
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
