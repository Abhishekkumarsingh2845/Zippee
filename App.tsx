import React, { useEffect, useState, useRef } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { NativeModules } from 'react-native';

const { PlacesModule } = NativeModules;

type Place = {
  name: string;
  latitude: number;
  longitude: number;
};

export default function App() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    if (!PlacesModule?.getNearbyPlaces) {
      setPlaces([
        {
          name: 'Udyog Vihar II, Gurugram',
          latitude: 28.4971,
          longitude: 77.0825,
        },
        { name: 'India Gate', latitude: 28.6129, longitude: 77.2295 },
        { name: 'Connaught Place', latitude: 28.6315, longitude: 77.2167 },
      ]);
      return;
    }

    PlacesModule.getNearbyPlaces()
      .then((result: Place[]) => {
        setPlaces(Array.isArray(result) ? result : []);
      })
      .catch(() => {
        setError('Failed to load nearby places');
      });
  }, []);

  const getDistanceInKm = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) => {
    const toRad = (v: number) => (v * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

    return +(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(2);
  };

  const handleMarkerPress = (place: Place) => {
    setSelectedPlace(place);
    mapRef.current?.animateToRegion(
      {
        latitude: place.latitude,
        longitude: place.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      },
      500,
    );
  };

  return (
    <View style={styles.container}>
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.mapWrapper}>
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFill}
          showsUserLocation
          onUserLocationChange={e => {
            const { latitude, longitude } = e.nativeEvent.coordinate;
            setUserLocation({ latitude, longitude });
          }}
          initialRegion={{
            latitude: 28.61,
            longitude: 77.2,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {places.map((place, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: place.latitude,
                longitude: place.longitude,
              }}
              onPress={() => handleMarkerPress(place)}
            >
              <Callout tooltip>
                <View style={styles.calloutCard}>
                  <Text style={styles.calloutTitle}>{place.name}</Text>
                  {userLocation && (
                    <Text style={styles.calloutDistance}>
                      {getDistanceInKm(
                        userLocation.latitude,
                        userLocation.longitude,
                        place.latitude,
                        place.longitude,
                      )}{' '}
                      km away
                    </Text>
                  )}
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      </View>

      {selectedPlace && userLocation && (
        <View style={styles.bottomCard}>
          <Text style={styles.bottomTitle}>{selectedPlace.name}</Text>
          <Text style={styles.bottomDistance}>
            {getDistanceInKm(
              userLocation.latitude,
              userLocation.longitude,
              selectedPlace.latitude,
              selectedPlace.longitude,
            )}{' '}
            km away
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },

  mapWrapper: {
    flex: 1,
    margin: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },

  errorBanner: {
    position: 'absolute',
    top: 40,
    alignSelf: 'center',
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 10,
  },

  errorText: { color: '#C62828', fontWeight: '600' },

  calloutCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    width: 180,
    elevation: 4,
  },

  calloutTitle: { fontWeight: '700', fontSize: 14, marginBottom: 4 },
  calloutDistance: { fontSize: 12, color: '#555' },

  bottomCard: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    elevation: 6,
    alignItems: 'center',
  },

  bottomTitle: { fontSize: 16, fontWeight: '700' },
  bottomDistance: { marginTop: 4, fontSize: 14, color: '#555' },
});
