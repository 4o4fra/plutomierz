package com.fra.plutomierz.receiver

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat

class PlutaReminderReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val notification = NotificationCompat.Builder(context, "pluta_channel")
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentTitle("Uwaga Pluta!")
            .setContentText("Skrót Pluty PDW!")
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .build()

        with(NotificationManagerCompat.from(context)) {
            if (areNotificationsEnabled()) {
                notify(1, notification)
            }
        }
    }
}