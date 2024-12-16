package com.fra.plutomierz.ui

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.*
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.runtime.*
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.fra.plutomierz.BuildConfig
import com.fra.plutomierz.data.WebSocketHandler
import com.fra.plutomierz.ui.theme.PlutomierzTheme
import com.fra.plutomierz.util.NotificationUtils
import isNetworkAvailable
import kotlinx.coroutines.launch
import org.json.JSONObject

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
            var chatHistory: List<Triple<String, String, String>> by remember {
                mutableStateOf(
                    listOf<Triple<String, String, String>>()
                )
            }

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
                    topBar = {
                        TopAppBar(
                            title = { Text("Plutomierz") },
                            colors = TopAppBarDefaults.topAppBarColors(
                                containerColor = MaterialTheme.colorScheme.primaryContainer
                            ),
                            actions = {
                                IconButton(onClick = {
                                    val intent =
                                        Intent(this@MainActivity, SettingsActivity::class.java)
                                    startActivity(intent)
                                }) {
                                    Icon(
                                        imageVector = Icons.Default.Settings,
                                        contentDescription = "Settings"
                                    )
                                }
                                IconButton(onClick = {
                                    val intent = Intent(
                                        Intent.ACTION_VIEW,
                                        Uri.parse("https://www.youtube.com/watch?v=OUiV7umwMUs")
                                    )
                                    startActivity(intent)
                                }) {
                                    Icon(
                                        imageVector = Icons.Default.PlayArrow,
                                        contentDescription = "Pluty porada"
                                    )
                                }
                            }
                        )
                    },
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
                                Plutometer(value = plutaValue)
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