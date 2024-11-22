package com.fra.plutomierz.ui

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.fra.plutomierz.data.PreferencesHelper
import com.fra.plutomierz.data.WebSocketHandler
import org.json.JSONObject

@Composable
fun ChatInput(
    webSocketHandler: WebSocketHandler,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    var username by remember { mutableStateOf(PreferencesHelper.getUsername(context) ?: "") }
    var message by remember { mutableStateOf("") }
    var isUsernameSet by remember { mutableStateOf(username.isNotEmpty()) }

    Column(modifier = modifier.padding(16.dp)) {
        if (!isUsernameSet) {
            OutlinedTextField(
                value = username,
                onValueChange = { username = it },
                label = { Text("Podaj nazwę Pluty") },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 8.dp)
            )
            Button(
                onClick = {
                    if (username.isNotEmpty()) {
                        PreferencesHelper.saveUsername(context, username)
                        isUsernameSet = true
                    }
                },
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("Nastaw")
            }
        } else {
            OutlinedTextField(
                value = message,
                onValueChange = {
                    if (it.length <= 200) {
                        message = it
                    }
                },
                label = { Text("Podaj wiadomość Plutonową") },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 8.dp)
            )
            Button(
                onClick = {
                    if (message.isNotEmpty()) {
                        val json = JSONObject()
                        json.put("username", username)
                        json.put("text", message)
                        webSocketHandler.sendMessage(json.toString())
                        message = ""
                    }
                },
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("Wyplutuj")
            }
        }
    }
}