package com.fra.plutomierz.utils

import android.content.Context
import com.google.firebase.crashlytics.buildtools.reloc.com.google.common.reflect.TypeToken
import com.google.gson.Gson
import java.io.InputStreamReader
import kotlin.random.Random

fun getRandomMotivationalText(context: Context): String {
    val inputStream = context.assets.open("motivationalPluta.json")
    val reader = InputStreamReader(inputStream)
    val type = object : TypeToken<List<String>>() {}.type
    val texts: List<String> = Gson().fromJson(reader, type)
    return if (texts.isNotEmpty()) texts[Random.nextInt(texts.size)] else ""
}