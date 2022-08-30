import React, { useContext } from 'react';
import styled from 'styled-components';
import { MapContainer } from 'react-leaflet';

import { StateContext } from '../components/State';
import { Theme } from '../styles';
import Loading from './Loading';
import SeurantaMap from './SeurantaMap';

declare const API_KEY: string;

const defaultPosition: any = [65.449704, 26.839269];
const defaultZoom = 6;

type Props = {};

const Main: React.FC<Props> = ({}) => {
  const { modalOpen, setModalOpen, modalService, loading }: any =
    useContext(StateContext);

  return (
    <Container>
      <div style={{ display: modalOpen ? 'flex' : 'none', flex: 1 }}>
        {modalOpen && (
          <ModalContainer>
            <ModalButton onClick={() => setModalOpen(false)}>X</ModalButton>
            <Widget
              dangerouslySetInnerHTML={{
                __html: modalOpen ? (
                  createWidgetBody(modalService)
                ) : (
                  <div></div>
                ),
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
  background-color: ${Theme.color.primary};
`;

const MapContainerStyled: any = styled(MapContainer)`
  display: flex;
  flex: 1;
  background: ${Theme.color.primary};
  font-family: ${Theme.font.secondary};
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

const createWidgetBody = (serviceId: string) => `
  <div class="CitObsO311Widget"
    data-type="SingleServiceQuestionnaire"
    data-service_code="${serviceId}"
    data-show-service_name="true"
    data-show-service_description="true"
    data-show-map="true"
    data-map-height="300"
    data-show-obses="true"
    data-obses-max_age="90"
    data-obses-radius="9"
    data-obses-label=""
    data-obses-color=""
    data-obses-cluster="true"
    data-show-questionnaire="true"
    data-images-count="2"
    data-api-key="${API_KEY}"
  ></div>`;

export default Main;
