package com.fra.plutomierz.ui

import android.content.Context
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.fra.plutomierz.data.PreferencesHelper
import com.fra.plutomierz.ui.theme.PlutomierzTheme
import com.fra.plutomierz.util.NotificationUtils

class SettingsActivity : ComponentActivity() {
    @OptIn(ExperimentalMaterial3Api::class)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            PlutomierzTheme {
                SettingsScreen { finish() }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(onBackPressed: () -> Unit) {
    val context = LocalContext.current
    val sharedPreferences = context.getSharedPreferences("app_preferences", Context.MODE_PRIVATE)
    var notificationsEnabled by remember { mutableStateOf(true) }
    var nickname by remember { mutableStateOf(PreferencesHelper.getUsername(context) ?: "") }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Ustawienia Pluty") },
                navigationIcon = {
                    IconButton(onClick = { onBackPressed() }) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = "Back"
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primaryContainer
                )
            )
        }
    ) { contentPadding ->
        Column(
            modifier = Modifier
                .padding(contentPadding)
                .padding(16.dp)
        ) {
            Text("Powiadomienia o codziennym skrócie Pluty")
            Switch(
                checked = notificationsEnabled,
                onCheckedChange = { enabled ->
                    notificationsEnabled = enabled
                    if (enabled) {
                        NotificationUtils.setDailyReminder(context)
                    } else {
                        NotificationUtils.cancelDailyReminder(context)
                    }
                }
            )
            Spacer(modifier = Modifier.padding(8.dp))
            Text("Zmień nazwę Pluty")
            TextField(
                value = nickname,
                onValueChange = { nickname = it },
                label = { Text("Pluta") },
                modifier = Modifier.fillMaxWidth()
            )
            Button(
                onClick = {
                    sharedPreferences.edit().putString("nickname", nickname).apply()
                },
                modifier = Modifier.padding(top = 8.dp)
            ) {
                Text("Zapisz")
            }
        }
    }
}