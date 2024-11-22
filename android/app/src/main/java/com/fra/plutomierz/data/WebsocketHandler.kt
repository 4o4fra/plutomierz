package com.fra.plutomierz.data

import android.util.Log
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.Response
import okhttp3.WebSocket
import okhttp3.WebSocketListener

class WebSocketHandler(
    private val onMessageReceived: (String) -> Unit,
    private val onFailure: (Throwable) -> Unit
) {
    private val client = OkHttpClient()
    lateinit var webSocket: WebSocket

    fun connect(url: String) {
        val request = Request.Builder().url(url).build()
        webSocket = client.newWebSocket(request, object : WebSocketListener() {
            override fun onMessage(webSocket: WebSocket, text: String) {
                onMessageReceived(text)
            }

            override fun onFailure(
                webSocket: WebSocket,
                t: Throwable,
                response: Response?
            ) {
                Log.e("WebSocket", "Connection failed", t)
                onFailure(t)
            }
        })
    }

    fun sendMessage(message: String) {
        webSocket.send(message)
    }

    fun close() {
        webSocket.close(1000, "Activity destroyed")
        client.dispatcher.executorService.shutdown()
    }
}