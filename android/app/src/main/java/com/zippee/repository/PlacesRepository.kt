package com.zippee.repository

import android.annotation.SuppressLint
import android.content.Context
import com.google.android.gms.location.LocationServices
import com.zippee.model.Place

class PlacesRepository(private val context: Context) {

    private val fusedClient =
        LocationServices.getFusedLocationProviderClient(context)

    @SuppressLint("MissingPermission")
    fun getNearbyPlaces(callback: (List<Place>) -> Unit) {

        fusedClient.lastLocation
            .addOnSuccessListener { location ->

                if (location == null) {
                    callback(emptyList())
                    return@addOnSuccessListener
                }

                val places = listOf(
                    Place(
                        name = "You are here",
                        latitude = location.latitude,
                        longitude = location.longitude,
                        distance = 0.0
                    )
                )

                callback(places)
            }
    }
}
