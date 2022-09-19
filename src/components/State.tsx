import React, { useEffect, useState, createContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from 'react-query';
import { useLocation } from 'react-router-dom';

export const StateContext = createContext({});

export const StateProvider = (props) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalService, setModalService] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [widgetLoading, setWidgetLoading] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const [controlUiEnabled, setControlUiEnabled] = useState<boolean>(false);
  const location = useLocation();
  const queryClient = useQueryClient();

  const [priority, setPriority] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [apiId, setApiId] = useState<string>('');

  // Queries
  // const query = useQuery('todos', getTodos);

  useEffect(() => {
    if (location) {
      if (location.pathname === '/control') {
        setControlUiEnabled(true);
      }
    }
  }, [location]);

  useEffect(() => {
    for (const entry of searchParams.entries()) {
      const [param, value] = entry;
      if (param === 'editorApiId') {
        setApiId(value);
      }
      if (param === 'apiKey') {
        setApiKey(value);
      }
      if (param === 'priority') {
        setPriority(value);
      }
    }
  }, [searchParams]);

  const handleModalClick = (serviceId: string) => {
    if (serviceId === modalService) {
    } else {
      setModalService(serviceId);
    }
    setWidgetLoading(true);
    setModalOpen(true);

    // fetch and run the citobsdb widget script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(script);
    script.src = 'https://www.jarviwiki.fi/common/citobsembed.js';

    const timer = setInterval(() => {
      const divs: HTMLCollectionOf<Element> =
        document.getElementsByClassName('CitObsO311Widget');
      if (divs.length > 0 && divs[0].children.length > 0) {
        clearInterval(timer);
        setWidgetLoading(false);
      }
    }, 100);
  };

  const values = {
    modalOpen,
    setModalOpen,
    modalService,
    setModalService,
    loading,
    setLoading,
    widgetLoading,
    setWidgetLoading,
    handleModalClick,
    controlUiEnabled,
    apiKey,
    apiId,
    priority,
  };

  return (
    <StateContext.Provider value={values}>
      {props.children}
    </StateContext.Provider>
  );
};
