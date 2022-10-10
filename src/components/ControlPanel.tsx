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
      </InfoContainer>
      {/* <Button>Import</Button> */}
    </Container>
  );
}

const InfoContainer: any = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px 0 10px 0;
  align-items: flex-end;
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
`;

export default ControlPanel;
