import React, { useEffect, useState, createContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
  const navigate = useNavigate();
  const [controlUiEnabled, setControlUiEnabled] = useState<boolean>(false);
  const [widget, setWidget] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const location = useLocation();
  const queryClient = useQueryClient();

  //const [paramPriority, setParamPriority] = useState<string>('');
  const [paramApiKey, setParamApiKey] = useState<string>('');
  const [paramApiId, setParamApiId] = useState<string>('');
  const [paramEditorApiPriorityLevel, setParamEditorApiPriorityLevel] =
    useState<string>('');
  const [viewParams, setViewParamas] = useState<any>(null);

  const [apiKey, setApiKey] = useState<string>(API_KEY);
  const [priority, setPriority] = useState<Number | null | undefined>(1);

  // Queries
  const priorityQuery = useQuery(
    ['priority', paramApiId],
    () => getPriority(paramApiId),
    {
      enabled: paramApiId !== '',
      initialData: priority,
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
    if (isFirstLoad) {
      setIsFirstLoad(false);
      const newViewParams: any = {};
      for (const entry of searchParams.entries()) {
        const [param, value] = entry;
        if (param === 'apiId') {
          setParamApiId(value);
          setPriority(null);
        }
        if (param === 'apiKey') {
          setParamApiKey(value);
          setApiKey(value);
        }
        if (param === 'editorApiPriorityLevel') {
          setParamEditorApiPriorityLevel(value);
        }

        if (param === 'time') {
          setSelectedDate(new Date(value));
        }

        if (!viewParams) {
          if (param === 'lat') {
            newViewParams.lat = Number(value);
          }
          if (param === 'lon') {
            newViewParams.lon = Number(value);
          }
          if (param === 'zoom') {
            newViewParams.zoom = Number(value);
          }
        }
      }

      if (!viewParams) {
        setViewParamas(newViewParams);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (priorityQuery.isFetched) {
      if (priorityQuery.data === null) {
        setPriority(1);
      } else {
        setPriority(priorityQuery.data);
      }
    }
  }, [priorityQuery.isFetched]);

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

  const updateSearchParams = (params: any) => {
    for (const [key, value] of Object.entries(params)) {
      if (searchParams.get(key) != null) {
        if (value === '' || value == null) {
          searchParams.delete(key);
        } else {
          // @ts-ignore
          searchParams.set(key, value);
        }
      } else {
        // @ts-ignore
        searchParams.append(key, value);
      }
    }
    navigate(`?${searchParams.toString()}`, { replace: true });
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
    paramEditorApiPriorityLevel,
    priorityQuery,
    priority,
    apiKey,
    selectedDate,
    setSelectedDate,
    viewParams,
    updateSearchParams,
  };

  return (
    <StateContext.Provider value={values}>
      {props.children}
    </StateContext.Provider>
  );
};
