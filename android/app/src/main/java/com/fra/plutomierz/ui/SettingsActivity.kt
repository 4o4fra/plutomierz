package com.fra.plutomierz.ui

import android.os.Bundle
import android.widget.Toast
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
import com.fra.plutomierz.data.PreferencesHelper.getUsername
import com.fra.plutomierz.data.PreferencesHelper.hadUsernameChanged
import com.fra.plutomierz.ui.theme.PlutomierzTheme
import com.fra.plutomierz.util.NotificationUtils
import com.fra.plutomierz.utils.getRandomMotivationalText

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
    var notificationsEnabled by remember { mutableStateOf(true) }
    var username by remember { mutableStateOf(getUsername(context) ?: "") }
    var tapCount by remember { mutableIntStateOf(0) }
    var showEasterEgg by remember { mutableStateOf(false) }

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
            Text("Zmień nazwę Pluty (tylko raz)")
            TextField(
                value = username,
                onValueChange = { username = it },
                label = { Text("Pluta") },
                modifier = Modifier.fillMaxWidth(),
                enabled = !hadUsernameChanged(context)
            )
            Button(
                onClick = {
                    if (username.isNotEmpty()) {
                        if (!hadUsernameChanged(context)) {
                            PreferencesHelper.editUsername(context, username)
                            Toast.makeText(
                                context,
                                "Nazwa użytkownika została zmieniona",
                                Toast.LENGTH_SHORT
                            ).show()
                        } else {
                            Toast.makeText(
                                context,
                                "Nazwa użytkownika może zostać zmieniona tylko raz",
                                Toast.LENGTH_SHORT
                            ).show()
                        }
                    } else {
                        Toast.makeText(
                            context,
                            "Nazwa użytkownika nie została jeszcze ustawiona",
                            Toast.LENGTH_SHORT
                        ).show()
                    }
                },
                modifier = Modifier.padding(top = 8.dp),
                enabled = username.isNotEmpty() && !hadUsernameChanged(context)
            ) {
                Text("Zapisz")
            }
            Spacer(modifier = Modifier.padding(8.dp))
            Button(
                onClick = {
                    tapCount++
                    if (tapCount >= 5) {
                        showEasterEgg = true
                        tapCount = 0
                    }
                },
                modifier = Modifier
                    .padding(top = 8.dp)
            ) {
                Text("DDOS PLUTY BOMBA W ŁĄCZNOŚĆ")
            }
            if (showEasterEgg) {
                Text(
                    text = getRandomMotivationalText(context),
                    modifier = Modifier.padding(top = 16.dp)
                )
            }
        }
    }
}