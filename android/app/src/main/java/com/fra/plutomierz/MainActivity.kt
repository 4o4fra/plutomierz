package com.fra.plutomierz

import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.fra.plutomierz.ui.theme.PlutomierzTheme
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.WebSocket
import okhttp3.WebSocketListener
import org.json.JSONObject

class MainActivity : ComponentActivity() {
    private lateinit var webSocket: WebSocket
    private val client = OkHttpClient()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            var plutaValue by remember { mutableIntStateOf(0) }

            LaunchedEffect(Unit) {
                val request = Request.Builder().url(BuildConfig.WEBSOCKET_URL).build()
                webSocket = client.newWebSocket(request, object : WebSocketListener() {

                    override fun onMessage(webSocket: WebSocket, text: String) {
                        val json = JSONObject(text)
                        if (json.has("plutaValue")) {
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
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(contentPadding),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Box(
                            modifier = Modifier
                                .fillMaxSize()
                                .padding(top = 16.dp),
                            contentAlignment = Alignment.TopCenter
                        ) {
                            MotivationalText()
                            Box(
                                modifier = Modifier
                                    .size(300.dp)
                                    .padding(top = 64.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Speedometer(value = plutaValue)
                            }
                        }
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