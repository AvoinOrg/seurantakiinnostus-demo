import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import Locate from 'leaflet.locatecontrol';

export default function LocateControl() {
  const map = useMap();

  useEffect(() => {
    // geo locate props
    const locateOptions = {
      position: 'topright',
      maxZoom: 19,
      strings: {
        title: 'Locate me',
      },
      onActivate: () => {}, // callback before engine starts retrieving locations
    };

    //@ts-ignore
    const lc = new Locate(locateOptions);
    // console.log(lc);
    lc.addTo(map);
    return () => {
      lc.remove();
    };
  }, [map]);

  return null;
}
