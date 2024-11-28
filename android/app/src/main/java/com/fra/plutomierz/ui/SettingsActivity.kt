package com.fra.plutomierz.ui

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.fra.plutomierz.ui.theme.PlutomierzTheme
import com.fra.plutomierz.util.NotificationUtils

/**
 * Activity for displaying the settings screen.
 */
class SettingsActivity : ComponentActivity() {
    /**
     * Called when the activity is starting. This is where most initialization should go.
     * @param savedInstanceState If the activity is being re-initialized after previously being shut down then this Bundle contains the data it most recently supplied in onSaveInstanceState(Bundle).
     */
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

/**
 * Composable function for displaying the settings screen.
 * @param onBackPressed Callback function to be invoked when the back button is pressed.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(onBackPressed: () -> Unit) {
    val context = LocalContext.current
    var notificationsEnabled by remember { mutableStateOf(true) }

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
        }
    }
}