package com.fra.plutomierz.ui.components

import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.fra.plutomierz.utils.getRandomMotivationalText

@Composable
fun MotivationalText() {
    val context = LocalContext.current

    val motivationalText by remember { mutableStateOf(getRandomMotivationalText(context)) }
    Text(
        text = motivationalText,
        style = MaterialTheme.typography.bodyLarge,
        modifier = Modifier.padding(16.dp)
    )
}