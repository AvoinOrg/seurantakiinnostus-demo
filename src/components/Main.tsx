import React, { useContext } from 'react';
import styled from 'styled-components';
import { MapContainer } from 'react-leaflet';

import { StateContext } from '../components/State';
import { theme } from '../styles';
import Loading from './Loading';
import SeurantaMap from './SeurantaMap';

const defaultPosition: any = [65.449704, 26.839269];
const defaultZoom = 6;

type Props = {};

const Main: React.FC<Props> = ({}) => {
  const { modalOpen, setModalOpen, widget, loading }: any =
    useContext(StateContext);

  return (
    <Container>
      <div style={{ display: modalOpen ? 'flex' : 'none', flex: 1 }}>
        {modalOpen && (
          <ModalContainer>
            <ModalButton onClick={() => setModalOpen(false)}>X</ModalButton>
            <Widget
              dangerouslySetInnerHTML={{
                __html: modalOpen ? widget : <div></div>,
              }}
            />
            {loading && (
              <LoadingContainer>
                <Loading />
              </LoadingContainer>
            )}
          </ModalContainer>
        )}
      </div>
      <div style={{ display: modalOpen ? 'none' : 'flex', flex: 1 }}>
        <MapContainerStyled zoom={defaultZoom} center={defaultPosition}>
          <SeurantaMap></SeurantaMap>
        </MapContainerStyled>
      </div>
    </Container>
  );
};

const Container: any = styled.div`
  display: flex;
  flex: 1;
  background-color: ${theme.palette.primary.main};
`;

const MapContainerStyled: any = styled(MapContainer)`
  display: flex;
  flex: 1;
  background: ${theme.palette.primary.main};
  font-family: ${theme.typography.secondary};
  background: white;
`;

const ModalContainer: any = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: white;
  overflow: scroll;
  overflow-x: scroll;
  padding: 5px 10px 10px 10px;
  display: flex;
  flex-direction: column;
  color: black;
`;

const ModalButton: any = styled.p`
  position: fixed;
  top: 5px;
  right: 30px;
  font-size: 1.5rem;
  color: black;
  &:hover {
    cursor: pointer;
  }
`;

const Widget: any = styled.div`
  margin: auto;
`;

const LoadingContainer: any = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export default Main;
