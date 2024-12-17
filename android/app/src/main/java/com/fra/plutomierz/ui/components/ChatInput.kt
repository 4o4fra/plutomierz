package com.fra.plutomierz.ui.components

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
    var username = PreferencesHelper.getUsername(context) ?: ""
    var message by remember { mutableStateOf("") }
    var isUsernameSet by remember { mutableStateOf(username.isNotEmpty()) }
    var usernameError by remember { mutableStateOf(false) }
    var messageError by remember { mutableStateOf(false) }

    Column(modifier = modifier.padding(8.dp)) {
        if (!isUsernameSet) {
            OutlinedTextField(
                value = username,
                onValueChange = {
                    username = it
                    usernameError = !isValidUsername(it)
                },
                label = { Text("Podaj nazwę Pluty") },
                isError = usernameError,
                singleLine = true,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 8.dp)
            )
            if (usernameError) {
                Text(
                    text = "Nazwa użytkownika musi mieć od 3 do 16 znaków",
                    color = MaterialTheme.colorScheme.error,
                    style = MaterialTheme.typography.bodySmall
                )
            }
            Button(
                onClick = {
                    if (isValidUsername(username)) {
                        PreferencesHelper.saveUsername(context, username)
                        isUsernameSet = true
                    } else {
                        usernameError = true
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
                    message = it
                    messageError = !isValidMessage(it)
                },
                label = { Text("Podaj wiadomość Plutonową") },
                isError = messageError,
                singleLine = true,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 8.dp)
            )
            if (messageError) {
                Text(
                    text = "Wiadomość musi mieć od 1 do 200 znaków",
                    color = MaterialTheme.colorScheme.error,
                    style = MaterialTheme.typography.bodySmall
                )
            } else {
                Spacer(modifier = Modifier.height(8.dp))
            }
            Button(
                onClick = {
                    val trimmedMessage = message.trim().replace(Regex("\\s+"), " ")
                    if (isValidMessage(trimmedMessage)) {
                        val json = JSONObject()
                        json.put("username", username)
                        json.put("text", trimmedMessage)
                        webSocketHandler.sendMessage(json.toString())
                        message = ""
                    } else {
                        messageError = true
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 8.dp)
            ) {
                Text("Wyplutuj")
            }
        }
    }
}

fun isValidUsername(username: String): Boolean {
    return username.length in 3..16
}

fun isValidMessage(message: String): Boolean {
    return message.length in 1..200
}