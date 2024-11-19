package com.fra.plutomierz

import android.content.Context
import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.*
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.fra.plutomierz.ui.theme.PlutomierzTheme
import com.google.firebase.crashlytics.buildtools.reloc.com.google.common.reflect.TypeToken
import com.google.gson.Gson
import kotlinx.coroutines.delay
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.WebSocket
import okhttp3.WebSocketListener
import org.json.JSONObject
import java.io.InputStreamReader
import kotlin.math.cos
import kotlin.math.sin
import kotlin.random.Random

class MainActivity : ComponentActivity() {
    private lateinit var webSocket: WebSocket
    private val client = OkHttpClient()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            var plutaValue by remember { mutableStateOf(0) }

            LaunchedEffect(Unit) {
                val request = Request.Builder().url(BuildConfig.WEBSOCKET_URL).build()
                webSocket = client.newWebSocket(request, object : WebSocketListener() {

                    override fun onMessage(webSocket: WebSocket, text: String) {
                        val json = JSONObject(text)
                        if (json.has("plutaValue")) {
                            val json = JSONObject(text)
                            plutaValue = json.getInt("plutaValue")
                        }

                    }

                    override fun onFailure(
                        webSocket: WebSocket,
                        t: Throwable,
                        response: okhttp3.Response?
                    ) {
                        Log.e("WebSocket", "Connection failed", t)
                    }
                })
            }

            PlutomierzTheme {
                Scaffold { contentPadding ->
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(contentPadding),
                        contentAlignment = Alignment.Center
                    ) {
                        Speedometer(value = plutaValue)
                    }
                }
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        webSocket.close(1000, "Activity destroyed")
        client.dispatcher.executorService.shutdown()
    }
}

@Composable
fun Speedometer(value: Int) {
    val context = LocalContext.current
    val motivationalText by remember { mutableStateOf(getRandomMotivationalText(context)) }
    val isPlutaLevelCritical: Boolean = value > 50 || value < -65
    var isVisible by remember { mutableStateOf(true) }

    if (isPlutaLevelCritical) {
        LaunchedEffect(Unit) {
            while (true) {
                isVisible = !isVisible
                delay(500)
            }
        }
    }

    Box(
        contentAlignment = Alignment.Center,
        modifier = Modifier.size(250.dp)
    ) {
        Canvas(modifier = Modifier.fillMaxSize()) {
            drawArc(
                brush = Brush.sweepGradient(
                    colors = listOf(Color.Red, Color.Red, Color.Yellow, Color.Green),
                    center = center
                ),
                startAngle = 135f,
                sweepAngle = 270f,
                useCenter = false,
                style = Stroke(width = 20f, cap = StrokeCap.Round)
            )
            val angle = 135f + ((value + 75) / 150f) * 270f

            drawLine(
                brush = SolidColor(Color.Black),
                start = center,
                end = center + Offset(
                    x = (size.minDimension / 2 * cos(Math.toRadians(angle.toDouble()))).toFloat(),
                    y = (size.minDimension / 2 * sin(Math.toRadians(angle.toDouble()))).toFloat()
                ),
                strokeWidth = 8f,
                cap = StrokeCap.Round
            )

            drawCircle(
                brush = SolidColor(Color.Black),
                radius = 10f,
                center = center
            )
        }
        Column(
            verticalArrangement = Arrangement.Bottom,
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier
                .fillMaxSize()
                .padding(bottom = 32.dp)
        ) {
            Text(
                text = "$value Plut",
                color = if (isPlutaLevelCritical) Color.Red else Color.Black,
                style = MaterialTheme.typography.titleLarge
            )
            if (isPlutaLevelCritical && isVisible) {
                Text(
                    text = "POZIOM KRYTYCZNY!",
                    color = Color.Red,
                    style = MaterialTheme.typography.bodyLarge
                )
            }
            if (motivationalText.isNotEmpty()) {
                Text(
                    text = motivationalText,
                    color = Color.Blue,
                    style = MaterialTheme.typography.bodyLarge
                )
            }
        }
    }
}

fun getRandomMotivationalText(context: Context): String {
    val inputStream = context.assets.open("motivationalPluta.json")
    val reader = InputStreamReader(inputStream)
    val type = object : TypeToken<List<String>>() {}.type
    val texts: List<String> = Gson().fromJson(reader, type)
    return if (texts.isNotEmpty()) texts[Random.nextInt(texts.size)] else ""
}