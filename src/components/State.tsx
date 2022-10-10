import React, { useEffect, useState, createContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from 'react-query';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

import { getPriority } from '../utils/api';

declare const API_KEY: string;

export const StateContext = createContext({});

export const StateProvider = (props) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalService, setModalService] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [widgetLoading, setWidgetLoading] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const [controlUiEnabled, setControlUiEnabled] = useState<boolean>(false);
  const [widget, setWidget] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const location = useLocation();
  const queryClient = useQueryClient();

  //const [paramPriority, setParamPriority] = useState<string>('');
  const [paramApiKey, setParamApiKey] = useState<string>('');
  const [paramApiId, setParamApiId] = useState<string>('');

  const [apiKey, setApiKey] = useState<string>(API_KEY);
  const [priority, setPriority] = useState<Number | null | undefined>(null);

  // Queries
  const priorityQuery = useQuery(
    ['priority', paramApiId],
    () => getPriority(paramApiId),
    {
      enabled: paramApiId !== '',
    },
  );

  useEffect(() => {
    if (location) {
      if (location.pathname === '/control') {
        setControlUiEnabled(true);
      }
    }
  }, [location]);

  useEffect(() => {
    var apiIdFound = false;
    for (const entry of searchParams.entries()) {
      const [param, value] = entry;
      if (param === 'apiId') {
        setParamApiId(value);
        apiIdFound = true;
      }
      if (param === 'apiKey') {
        setParamApiKey(value);
        setApiKey(value);
      }
      // if (param === 'priority') {
      //   setParamPriority(value);
      // }
    }
    if (!apiIdFound) {
      setPriority(1);
    }
  }, [searchParams]);

  useEffect(() => {
    if (priorityQuery.data === null) {
      setPriority(1);
    } else {
      setPriority(priorityQuery.data);
    }
  }, [priorityQuery.data]);

  const handleModalClick = (serviceId: string, widget: any) => {
    if (serviceId === modalService) {
    } else {
      setModalService(serviceId);
    }
    setWidget(widget);
    setWidgetLoading(true);
    setModalOpen(true);

    // fetch and run the citobsdb widget script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(script);
    script.src = require('../assets/citobs.js');

    // a timer to prevent a loading bug
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
    widget,
    setWidget,
    setWidgetLoading,
    handleModalClick,
    controlUiEnabled,
    paramApiKey,
    paramApiId,
    priorityQuery,
    priority,
    apiKey,
    selectedDate,
    setSelectedDate,
  };

  return (
    <StateContext.Provider value={values}>
      {props.children}
    </StateContext.Provider>
  );
};
