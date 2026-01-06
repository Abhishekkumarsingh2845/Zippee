package com.zippee.utils

import android.app.Activity
import android.content.pm.PackageManager
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import android.Manifest

object LocationPermissionHelper {

    const val REQUEST_LOCATION = 123

    private var permissionGrantedCallback: (() -> Unit)? = null

    fun hasLocationPermission(activity: Activity): Boolean {
        return ContextCompat.checkSelfPermission(
            activity,
            Manifest.permission.ACCESS_FINE_LOCATION
        ) == PackageManager.PERMISSION_GRANTED
    }

    fun requestLocationPermission(activity: Activity, onGranted: () -> Unit) {
        if (hasLocationPermission(activity)) {
            onGranted()
        } else {
            // Save callback to call later
            permissionGrantedCallback = onGranted

            ActivityCompat.requestPermissions(
                activity,
                arrayOf(Manifest.permission.ACCESS_FINE_LOCATION),
                REQUEST_LOCATION
            )
        }
    }

    // Call this from MainActivity's onRequestPermissionsResult
    fun onRequestPermissionsResult(
        requestCode: Int,
        grantResults: IntArray
    ) {
        if (requestCode == REQUEST_LOCATION &&
            grantResults.isNotEmpty() &&
            grantResults[0] == PackageManager.PERMISSION_GRANTED
        ) {
            permissionGrantedCallback?.invoke()
            permissionGrantedCallback = null
        }
    }
}
