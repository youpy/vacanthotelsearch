import React from 'react';
import { compose, withProps, withHandlers } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Circle } from "react-google-maps"

const LocationSelector = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyBhy38F26IWNXwHX3M9lCz-ttxc-LFqyqI",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withHandlers(() => {
    const refs = {
      map: undefined,
      latLng: undefined
    }

    return {
      onMapMounted: () => ref => {
        refs.map = ref
      },
      onClick: () => (event) => {
        refs.latLng = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng()
        };
        refs.map.panTo(refs.latLng);
      },
      onCenterChanged: ({ onLocationChange, radius }) => (event) => {
        onLocationChange(refs.latLng, radius)
      },
      onRadiusChanged: ({ onLocationChange, center }) => (event) => {
        onLocationChange(center, +event.target.value);
      }
    }
  }),
  withScriptjs,
  withGoogleMap
)((props) => {
  return (
    <div>
      <GoogleMap
        defaultZoom={15}
        center={props.center}
        clickableIcons={false}
        ref={props.onMapMounted}
        onClick={props.onClick}
        onCenterChanged={props.onCenterChanged}
      >
        <Circle
          center={props.center}
          radius={props.radius}
        />
      </GoogleMap>
      <div>
        <p className="input-field range-field">
          <input id="radius" type="range" step="10" min="100" max="3000" defaultValue={props.radius} onChange={props.onRadiusChanged} />
        </p>
      </div>
    </div>
  );
});

export default LocationSelector;
