package com.fra.plutomierz.data

import android.content.Context
import android.content.SharedPreferences

object PreferencesHelper {
    private const val PREFS_NAME = "chat_prefs"
    private const val KEY_USERNAME = "username"
    private const val KEY_USERNAME_CHANGED = "username_changed"

    private fun getPreferences(context: Context): SharedPreferences {
        return context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    }

    fun saveUsername(context: Context, username: String) {
        val editor = getPreferences(context).edit()
        editor.putString(KEY_USERNAME, username)
        editor.apply()
    }

    fun editUsername(context: Context, username: String) {
        saveUsername(context, username)
        if (getUsername(context) != username) {
            getPreferences(context).edit().putBoolean(KEY_USERNAME_CHANGED, true).apply()
        }
    }

    fun getUsername(context: Context): String? {
        return getPreferences(context).getString(KEY_USERNAME, null)
    }

    fun hadUsernameChanged(context: Context): Boolean {
        return getPreferences(context).getBoolean(KEY_USERNAME_CHANGED, false)
    }
}