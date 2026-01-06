// import React, { useEffect, useState, useRef } from 'react';
// import { Text, StyleSheet } from 'react-native';
// import MapView, { Marker, Region } from 'react-native-maps';
// import { NativeModules } from 'react-native';

// const { PlacesModule } = NativeModules;

// type Place = {
//   name: string;
//   latitude: number;
//   longitude: number;
//   distance: number;
// };

// export default function App() {
//   const [places, setPlaces] = useState<Place[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const mapRef = useRef<MapView | null>(null); // 🔹 reference to map
//   const [selectedPlace, setSelectedPlace] = useState<Place | null>(null); // 🔹 track focused marker

//   useEffect(() => {
//     if (!PlacesModule || !PlacesModule.getNearbyPlaces) {
//       console.warn('PlacesModule not available, using fallback');

//      setPlaces([
//   {
//     name: 'Udyog Vihar II, Gurugram', // Your mock address
//     latitude: 28.4971,               // Latitude from Google Maps
//     longitude: 77.0825,              // Longitude from Google Maps
//     distance: 0,                     // Initial distance (React Native can calculate dynamically)
//   },
//   {
//     name: 'India Gate',
//     latitude: 28.6129,
//     longitude: 77.2295,
//     distance: 1,
//   },
//   {
//     name: 'Connaught Place',
//     latitude: 28.6315,
//     longitude: 77.2167,
//     distance: 2,
//   },
// ]);

//       return;
//     }

//     PlacesModule.getNearbyPlaces()
//       .then((result: any) => {
//         if (Array.isArray(result)) setPlaces(result);
//         else
//           setPlaces([
//             {
//               name: 'Fallback Location',
//               latitude: 28.61,
//               longitude: 77.2,
//               distance: 0,
//             },
//           ]);
//       })
//       .catch((e: any) => {
//         setError(e?.message ?? 'Failed to load places');
//         setPlaces([
//           {
//             name: 'Error Fallback Location',
//             latitude: 28.61,
//             longitude: 77.2,
//             distance: 0,
//           },
//         ]);
//       });
//   }, []);

//   // 🔹 Function to focus map on selected marker
//   const focusOnMarker = (place: Place) => {
//     setSelectedPlace(place);

//     mapRef.current?.animateToRegion(
//       {
//         latitude: place.latitude,
//         longitude: place.longitude,
//         latitudeDelta: 0.02, // zoom in
//         longitudeDelta: 0.02,
//       },
//       500, // animation duration
//     );
//   };

//   return (
//     <>
//       {error && <Text style={styles.error}>{error}</Text>}

//       <MapView
//         ref={mapRef} // 🔹 attach ref to map
//         style={styles.map}
//         showsUserLocation={true} // ✅ Shows blue dot for current location
//         followsUserLocation={true}
//         initialRegion={{
//           latitude: 28.61,
//           longitude: 77.2,
//           latitudeDelta: 0.05,
//           longitudeDelta: 0.05,
//         }}
//       >
//         {places.map((place, index) => (
//           <Marker
//             key={index}
//             coordinate={{
//               latitude: place.latitude,
//               longitude: place.longitude,
//             }}
//             title={place.name}
//             description={`${place.distance} km away`}
//             onPress={() => focusOnMarker(place)} // 🔹 focus on tap
//           />
//         ))}
//       </MapView>

//       {/* 🔹 Optional: show focused place info at bottom */}
//       {selectedPlace && (
//         <Text style={styles.infoBox}>
//           {selectedPlace.name} - {selectedPlace.distance} km away
//         </Text>
//       )}
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   map: {
//     flex: 1,
//   },
//   error: {
//     position: 'absolute',
//     top: 40,
//     alignSelf: 'center',
//     backgroundColor: '#fff',
//     padding: 8,
//     zIndex: 1,
//   },
//   infoBox: {
//     position: 'absolute',
//     bottom: 50,
//     left: 20,
//     right: 20,
//     backgroundColor: 'white',
//     padding: 12,
//     borderRadius: 8,
//     textAlign: 'center',
//     fontWeight: 'bold',
//     zIndex: 2,
//   },
// });

import React, { useEffect, useState, useRef } from 'react';
import { Text, StyleSheet } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { NativeModules } from 'react-native';

const { PlacesModule } = NativeModules;

type Place = {
  name: string;
  latitude: number;
  longitude: number;
  distance: number;
};

export default function App() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    if (!PlacesModule || !PlacesModule.getNearbyPlaces) {
      console.warn('PlacesModule not available, using fallback');

      setPlaces([
        {
          name: 'Udyog Vihar II, Gurugram',
          latitude: 28.4971,
          longitude: 77.0825,
          distance: 0,
        },
        {
          name: 'India Gate',
          latitude: 28.6129,
          longitude: 77.2295,
          distance: 1,
        },
        {
          name: 'Connaught Place',
          latitude: 28.6315,
          longitude: 77.2167,
          distance: 2,
        },
      ]);

      return;
    }

    PlacesModule.getNearbyPlaces()
      .then((result: Place[]) => {
        if (Array.isArray(result)) setPlaces(result);
        else
          setPlaces([
            {
              name: 'Fallback Location',
              latitude: 28.61,
              longitude: 77.2,
              distance: 0,
            },
          ]);
      })
      .catch((e: any) => {
        setError(e?.message ?? 'Failed to load places');
        setPlaces([
          {
            name: 'Error Fallback Location',
            latitude: 28.61,
            longitude: 77.2,
            distance: 0,
          },
        ]);
      });
  }, []);

  // 🔹 Focus map and show info when marker is tapped
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
    <>
      {error && <Text style={styles.error}>{error}</Text>}

    <MapView
  ref={mapRef}
  style={styles.map}
  showsUserLocation={true}
  followsUserLocation={true}
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
      coordinate={{ latitude: place.latitude, longitude: place.longitude }}
      onPress={() => handleMarkerPress(place)}
    >
      {/* 🔹 Custom callout */}
      <Callout>
    <Text style={{ fontWeight: 'bold' }}>{place.name}</Text>
    <Text>{place.distance} km away</Text>
  </Callout>
    </Marker>
  ))}
</MapView>


      {/* 🔹 Info box shows selected marker's name + distance */}
      {selectedPlace && (
        <Text style={styles.infoBox}>
          {selectedPlace.name} - {selectedPlace.distance} km away
        </Text>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
  error: {
    position: 'absolute',
    top: 40,
    alignSelf: 'center',
    backgroundColor: '#fff',
    padding: 8,
    zIndex: 1,
  },
  infoBox: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    textAlign: 'center',
    fontWeight: 'bold',
    zIndex: 2,
  },
});
