package com.zippee.bridge

import com.facebook.react.bridge.*
import com.zippee.utils.LocationPermissionHelper

class PlacesModule(
    private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "PlacesModule"

    @ReactMethod
    fun getNearbyPlaces(promise: Promise) {
        val activity = currentActivity
        if (activity == null) {
            promise.reject("NO_ACTIVITY", "Activity not found")
            return
        }

        // ✅ Check permission & request if needed
        LocationPermissionHelper.requestLocationPermission(activity) {
            // This block runs ONLY after permission is granted

            // 🔹 Use mock nearby places
            val nearbyPlaces = listOf(
                Place("Udyog Vihar II, Gurugram", 28.4971, 77.0825, 0.0),
                Place("India Gate", 28.6129, 77.2295, 1.0),
                Place("Connaught Place", 28.6315, 77.2167, 2.0)
            )

            val array = Arguments.createArray()
            for (place in nearbyPlaces) {
                val map = Arguments.createMap()
                map.putString("name", place.name)
                map.putDouble("latitude", place.latitude)
                map.putDouble("longitude", place.longitude)
                map.putDouble("distance", place.distance)
                array.pushMap(map)
            }

            promise.resolve(array)
        }
    }

    // 🔹 Simple data class for a place
    data class Place(
        val name: String,
        val latitude: Double,
        val longitude: Double,
        val distance: Double
    )
}
