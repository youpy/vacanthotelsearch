import React from 'react';
import { compose, withProps, withHandlers } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Circle } from "react-google-maps"
import { SearchBox } from 'react-google-maps/lib/components/places/SearchBox';

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
      latLng: undefined,
      searchBox: undefined
    }

    return {
      onMapMounted: () => ref => {
        refs.map = ref
      },
      onSearchBoxMounted: () => ref => {
        refs.searchBox = ref;
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
      },
      onPlacesChanged: ({ onLocationChange, radius }) => (event) => {
        const places = refs.searchBox.getPlaces();
        const location = places[0].geometry.location;

        refs.latLng = {
          lat: location.lat(),
          lng: location.lng()
        };

        onLocationChange(refs.latLng, radius)
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
        <SearchBox
          ref={props.onSearchBoxMounted}
          controlPosition={1}
          onPlacesChanged={props.onPlacesChanged}
        >
          <input
            type="text"
            placeholder="Customized your placeholder"
            style={{
              background: '#fff',
              boxSizing: `border-box`,
              border: `1px solid transparent`,
              width: `240px`,
              height: `32px`,
              marginTop: `10px`,
              padding: `0 12px`,
              borderRadius: `3px`,
              boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
              fontSize: `14px`,
              outline: `none`,
              textOverflow: `ellipses`,
            }}
          />
        </SearchBox>
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
