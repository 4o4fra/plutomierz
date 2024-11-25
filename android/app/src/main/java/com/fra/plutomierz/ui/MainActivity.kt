package com.fra.plutomierz.ui

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.fra.plutomierz.BuildConfig
import com.fra.plutomierz.data.WebSocketHandler
import com.fra.plutomierz.ui.theme.PlutomierzTheme
import org.json.JSONObject

class MainActivity : ComponentActivity() {
    private lateinit var webSocketHandler: WebSocketHandler

    @OptIn(ExperimentalMaterial3Api::class)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            var plutaValue by remember { mutableIntStateOf(0) }
            var chatHistory by remember { mutableStateOf(listOf<Pair<String, String>>()) }

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
                            plutaValue = json.getInt("value")
                        }
                    }
                },
                onFailure = { t ->
                    // TODO
                }
            )

            LaunchedEffect(Unit) {
                webSocketHandler.connect(BuildConfig.WEBSOCKET_URL)
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
                                IconButton(onClick = { /* TODO */ }) {
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
                    }
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
                                Speedometer(value = plutaValue)
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
    }

    override fun onDestroy() {
        super.onDestroy()
        webSocketHandler.close()
    }
}