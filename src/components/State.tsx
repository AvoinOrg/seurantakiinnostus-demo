import React, { useState, createContext } from 'react';

export const StateContext = createContext({});

export const StateProvider = (props) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalService, setModalService] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [widgetLoading, setWidgetLoading] = useState<boolean>(false);

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
  };

  return (
    <StateContext.Provider value={values}>
      {props.children}
    </StateContext.Provider>
  );
};
