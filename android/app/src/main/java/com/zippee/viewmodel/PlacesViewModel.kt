package com.zippee.viewmodel

import android.content.Context
import com.zippee.model.Place
import com.zippee.repository.PlacesRepository

class PlacesViewModel(context: Context) {

    private val repository = PlacesRepository(context)

    fun loadPlaces(onResult: (List<Place>) -> Unit) {
        repository.getNearbyPlaces { places ->
            onResult(places)
        }
    }
}
