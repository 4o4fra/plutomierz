package com.fra.plutomierz.ui

import android.Manifest
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.runtime.*
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.drawscope.drawIntoCanvas
import androidx.compose.ui.graphics.nativeCanvas
import androidx.compose.ui.unit.dp
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.fra.plutomierz.BuildConfig
import com.fra.plutomierz.data.WebSocketHandler
import com.fra.plutomierz.ui.components.ChatHistory
import com.fra.plutomierz.ui.components.ChatInput
import com.fra.plutomierz.ui.components.MotivationalText
import com.fra.plutomierz.ui.components.Plutometer
import com.fra.plutomierz.ui.components.TopBar
import com.fra.plutomierz.ui.theme.PlutomierzTheme
import com.fra.plutomierz.util.NotificationUtils
import isNetworkAvailable
import kotlinx.coroutines.launch
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Locale

class MainActivity : ComponentActivity() {
    private lateinit var webSocketHandler: WebSocketHandler
    private val snackbarHostState = SnackbarHostState()
    private val handler = Handler(Looper.getMainLooper())
    private val retryInterval = 5000L

    private val retryRunnable = object : Runnable {
        override fun run() {
            if (isNetworkAvailable(this@MainActivity)) {
                webSocketHandler.connect(BuildConfig.WEBSOCKET_URL)
            } else {
                handler.postDelayed(this, retryInterval)
            }
        }
    }

    @OptIn(ExperimentalMaterial3Api::class)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            val scope = rememberCoroutineScope()
            var plutaValue by remember { mutableDoubleStateOf(0.0) }
            var chatHistory by remember { mutableStateOf(listOf<Pair<String, String>>()) }
            var plutaLog by remember { mutableStateOf<List<Pair<Double, String>>?>(null) }

            webSocketHandler = WebSocketHandler(
                onMessageReceived = { text ->
                    val json = JSONObject(text)
                    when (json.getString("type")) {
                        "history" -> {
                            val messages = json.getJSONArray("messages")
                            val history = mutableListOf<Pair<String, String>>()
                            for (i in 0 until messages.length()) {
                                val msg = messages.getJSONObject(i)
                                history.add(Pair(msg.getString("username"), msg.getString("text")))
                            }
                            chatHistory = history.reversed()
                        }

                        "message" -> {
                            val msg = json.getJSONObject("message")
                            chatHistory = listOf(
                                Pair(
                                    msg.getString("username"),
                                    msg.getString("text")
                                )
                            ) + chatHistory
                        }

                        "pluta" -> {
                            plutaValue = json.getDouble("value")
                        }

                        "plutaLog" -> {
                            val values = json.getJSONArray("value")
                            val log = mutableListOf<Pair<Double, String>>()
                            for (i in 0 until values.length()) {
                                val entry = values.getJSONObject(i)
                                log.add(
                                    Pair(
                                        entry.getDouble("plutaValue"),
                                        entry.getString("created_at")
                                    )
                                )
                            }
                            plutaLog = log
                        }
                    }
                },
                onFailure = { t ->
                    scope.launch {
                        snackbarHostState.showSnackbar("Utracono Plutę. Sprawdź swój intrenat.")
                    }
                    handler.postDelayed(retryRunnable, retryInterval)
                }
            )

            LaunchedEffect(Unit) {
                if (isNetworkAvailable(this@MainActivity)) {
                    webSocketHandler.connect(BuildConfig.WEBSOCKET_URL)
                } else {
                    scope.launch {
                        snackbarHostState.showSnackbar("Nie można połączyć z Plutą. Sprawdź intrenat.")
                    }
                    handler.postDelayed(retryRunnable, retryInterval)
                }
            }

            PlutomierzTheme {
                Scaffold(
                    topBar = { TopBar() },
                    snackbarHost = { SnackbarHost(snackbarHostState) }
                ) { contentPadding ->
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(contentPadding),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Box(
                            modifier = Modifier
                                .padding(top = 16.dp)
                                .clickable {
                                    if (plutaLog == null) {
                                        val calendar = Calendar.getInstance()
                                        calendar.add(Calendar.DAY_OF_YEAR, -1)
                                        val date = SimpleDateFormat(
                                            "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
                                            Locale.getDefault()
                                        ).format(calendar.time)
                                        val message = JSONObject().apply {
                                            put("type", "getPlutaLog")
                                            put("date", date)
                                        }
                                        webSocketHandler.sendMessage(message.toString())
                                    } else {
                                        plutaLog = null
                                    }
                                },
                            contentAlignment = Alignment.TopCenter
                        ) {
                            if (plutaLog == null) {
                                MotivationalText()
                                Box(
                                    modifier = Modifier
                                        .size(300.dp)
                                        .padding(top = 64.dp),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Plutometer(value = plutaValue)
                                }
                            } else {
                                Canvas(modifier = Modifier.size(300.dp)) {
                                    val maxValue = plutaLog!!.maxOf { it.first }
                                    val minValue = plutaLog!!.minOf { it.first }
                                    val range = maxValue - minValue
                                    val stepX = size.width / (plutaLog!!.size - 1)
                                    val stepY = size.height / range

                                    drawIntoCanvas { canvas ->
                                        val paint = android.graphics.Paint().apply {
                                            color = android.graphics.Color.RED
                                            strokeWidth = 4f
                                        }

                                        for (i in 0 until plutaLog!!.size - 1) {
                                            val x1 = i * stepX
                                            val y1 =
                                                (size.height - (plutaLog!![i].first - minValue).toFloat() * stepY)
                                            val x2 = (i + 1) * stepX
                                            val y2 =
                                                (size.height - (plutaLog!![i + 1].first - minValue).toFloat() * stepY)
                                            canvas.nativeCanvas.drawLine(
                                                x1,
                                                y1.toFloat(), x2, y2.toFloat(), paint
                                            )
                                        }
                                    }
                                }
                            }
                        }
                        Text(
                            text = "Czat Pluty",
                            style = MaterialTheme.typography.titleLarge,
                        )
                        Column(
                            modifier = Modifier
                                .fillMaxSize(),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            ChatHistory(
                                chatHistory = chatHistory,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .fillMaxHeight(0.6f)
                                    .padding(4.dp)
                            )
                            ChatInput(
                                webSocketHandler = webSocketHandler,
                                modifier = Modifier
                                    .fillMaxWidth()
                            )
                        }
                    }
                }
            }
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(
                    this,
                    Manifest.permission.POST_NOTIFICATIONS
                ) != PackageManager.PERMISSION_GRANTED
            ) {
                ActivityCompat.requestPermissions(
                    this,
                    arrayOf(Manifest.permission.POST_NOTIFICATIONS),
                    1
                )
            }
        }

        NotificationUtils.createNotificationChannel(this)
        NotificationUtils.setDailyReminder(this)
    }

    override fun onDestroy() {
        super.onDestroy()
        webSocketHandler.close()
        handler.removeCallbacks(retryRunnable)
    }
}