import React, { useEffect, useState } from 'react';
import MapView, { Polyline, Marker } from 'react-native-maps';
import openMap from 'react-native-open-maps';
import * as Location from 'expo-location';

export function Map(props) {
  const { name } = props;
  const location = { latitude: 9.379627, longitude: -83.691854 }

  const openAppMap = () => {
    openMap({
      latitude: location.latitude,
      longitude: location.longitude,
      zoom: 19,
      query: name,
    });
  };

  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      console.log('Current location:', location.coords);
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  if (!currentLocation) {
    return null;
  }

  const initialRegion = {
    latitude: (currentLocation.latitude + location.latitude) / 2,
    longitude: (currentLocation.longitude + location.longitude) / 2,
    latitudeDelta: Math.abs(currentLocation.latitude - location.latitude) * 2,
    longitudeDelta: Math.abs(currentLocation.longitude - location.longitude) * 2,
  };

  return (
    <MapView
      style={{ flex: 1, height: 400 }}
      initialRegion={initialRegion}
      onPress={openAppMap}
      scrollEnabled={false}
      zoomEnabled={true}
    >
      <Marker coordinate={currentLocation} title="Your Location" />
      <Marker coordinate={location} title={name} />

      <Polyline
        coordinates={[
          { latitude: currentLocation.latitude, longitude: currentLocation.longitude },
          { latitude: location.latitude, longitude: location.longitude },
        ]}
        strokeColor="#000"
        strokeWidth={3}
      />
    </MapView>
  );
}
