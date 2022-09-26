import React, { useContext } from 'react';
import styled from 'styled-components';

import { Theme } from '../styles';
import { StateContext } from '../components/State';

function ControlPanel(): React.ReactElement {
  const { paramPriority, paramApiId }: any = useContext(StateContext);

  return (
    <Container>
      <InfoContainer>
        <InfoRow>
          System API-ID:&nbsp;<b>{paramApiId}</b>
        </InfoRow>
        <InfoRow>
          Priority:&nbsp;<b>{paramPriority}</b>
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
  color: ${Theme.color.black};
`;

const Button: any = styled.div`
  display: flex;
  flex-direction: row;
  background: ${Theme.color.white};
  color: ${Theme.color.black};
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
  font-family: ${Theme.font.primary};
  line-height: 30px;
  text-indent: 1px;
  justify-content: flex-end;
`;

export default ControlPanel;
