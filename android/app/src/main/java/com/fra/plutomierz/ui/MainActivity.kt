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
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.fra.plutomierz.BuildConfig
import com.fra.plutomierz.data.WebSocketHandler
import com.fra.plutomierz.ui.components.ChatHistory
import com.fra.plutomierz.ui.components.ChatInput
import com.fra.plutomierz.ui.components.MotivationalText
import com.fra.plutomierz.ui.components.PlutaChart
import com.fra.plutomierz.ui.components.Plutometer
import com.fra.plutomierz.ui.components.TopBar
import com.fra.plutomierz.ui.theme.PlutomierzTheme
import com.fra.plutomierz.util.NotificationUtils
import com.github.mikephil.charting.data.Entry
import com.github.mikephil.charting.data.LineData
import com.github.mikephil.charting.data.LineDataSet
import isNetworkAvailable
import kotlinx.coroutines.launch
import org.json.JSONObject
import java.util.Calendar

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

    private fun parseMessage(msg: JSONObject): Triple<String, String, String> {
        return Triple(
            msg.getString("username"),
            msg.getString("text"),
            "${msg.getString("timestamp").substring(0, 10)} ${
                msg.getString("timestamp").substring(11, 19)
            }"
        )
    }

    @OptIn(ExperimentalMaterial3Api::class)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            val scope = rememberCoroutineScope()
            var plutaValue by remember { mutableDoubleStateOf(0.0) }
            var activeUsers by remember { mutableIntStateOf(1) }
            var chatHistory by remember { mutableStateOf(listOf<Triple<String, String, String>>()) }
            var plutaLog by remember { mutableStateOf<List<Pair<Double, String>>?>(null) }
            var switchCount by remember { mutableIntStateOf(0) }
            var firstSwitchTime by remember { mutableLongStateOf(0L) }

            webSocketHandler = WebSocketHandler(
                onMessageReceived = { text ->
                    val json = JSONObject(text)
                    when (json.getString("type")) {
                        "history" -> {
                            val messages = json.getJSONArray("messages")
                            val history = mutableListOf<Triple<String, String, String>>()
                            for (i in 0 until messages.length()) {
                                val msg = messages.getJSONObject(i)
                                history.add(
                                    parseMessage(msg)
                                )
                            }
                            chatHistory = history.reversed()
                        }

                        "message" -> {
                            val msg = json.getJSONObject("message")
                            chatHistory = listOf(
                                parseMessage(msg)
                            ) + chatHistory
                        }

                        "pluta" -> {
                            plutaValue = json.getDouble("value")
                        }

                        "activeUsers" -> {
                            activeUsers = json.getInt("count")
                        }

                        "plutaLog" -> {
                            val values = json.getJSONArray("value")
                            val log = plutaLog?.toMutableList() ?: mutableListOf()
                            for (i in 0 until values.length()) {
                                val entry = values.getJSONObject(i)
                                val newEntry = Pair(
                                    entry.getDouble("plutaValue"),
                                    entry.getString("created_at")
                                )
                                if (!log.contains(newEntry)) {
                                    log.add(newEntry)
                                }
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
                                    val currentTime = System.currentTimeMillis()
                                    if (firstSwitchTime == 0L || currentTime - firstSwitchTime > 10000) {
                                        firstSwitchTime = currentTime
                                        switchCount = 0
                                    }
                                    if (switchCount < 5) {
                                        switchCount++
                                        if (plutaLog == null) {
                                            val calendar = Calendar.getInstance()
                                            calendar.add(Calendar.DAY_OF_YEAR, -1)
                                            val message = JSONObject().apply {
                                                put("type", "getPlutaLog")
                                                put("dateRangeInMs", 86400000) // 24h
                                            }
                                            webSocketHandler.sendMessage(message.toString())
                                        } else {
                                            plutaLog = null
                                        }
                                    } else {
                                        scope.launch {
                                            snackbarHostState.showSnackbar("Nie klikaj za dużo!")
                                        }
                                    }
                                },
                            contentAlignment = Alignment.TopCenter
                        ) {
                            if (plutaLog == null) {
                                MotivationalText()
                                Box(
                                    modifier = Modifier
                                        .height(300.dp)
                                        .fillMaxWidth()
                                        .padding(top = 64.dp),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Plutometer(value = plutaValue)
                                }
                            } else {
                                val entries = plutaLog!!.mapIndexed { index, pair ->
                                    Entry(index.toFloat(), pair.first.toFloat())
                                }

                                val dataSet = LineDataSet(entries, "Pluta log").apply {
                                    color = android.graphics.Color.RED
                                    lineWidth = 2f
                                    setDrawCircles(false)
                                }

                                val lineData = LineData(dataSet)

                                PlutaChart(lineData = lineData)
                            }
                        }
                        Row(
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "Czat Pluty",
                                style = MaterialTheme.typography.titleLarge,
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Icon(
                                imageVector = Icons.Default.Person,
                                contentDescription = "Active Users",
                                tint = MaterialTheme.colorScheme.secondary
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = "$activeUsers",
                                style = MaterialTheme.typography.titleLarge,
                                color = MaterialTheme.colorScheme.secondary
                            )
                        }
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