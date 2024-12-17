# WebSocket API Documentation

This document provides detailed information about the WebSocket API used in the Plutomierz project.

## Overview

The WebSocket API is used to establish a connection between the client and the server, allowing for real-time
communication between the two.

## Connection

To establish a WebSocket connection, use the following URL:

`ws://localhost:3000/`

## Messages

### Request Format

All messages sent to the server should be in JSON format. Below is an example of a request message:

```json
{
  "type": "messageType",
  "payload": {
    "key1": "value1",
    "key2": "value2"
  }
}
```

### Response Format

All messages received from the server will also be in JSON format. Below is an example of a response message:

```json
{
  "type": "responseType",
  "payload": {
    "key1": "value1",
    "key2": "value2"
  }
}
```

### Message Types

#### Client to Server

- **chatMessage**: Sends a chat message to the server.
    - Fields:
        - `type` (string): The type of the message, should be "chatMessage".
        - `username` (string): The username of the sender.
        - `text` (string): The text content of the message.
    - Example:
      ```json
      {
        "type": "chatMessage",
        "username": "user123",
        "text": "Hello, World!"
      }
      ```
- **getPlutaLog**: Requests the Pluta log for a specified date range.
    - Fields:
        - `type` (string): The type of the message, should be "getPlutaLog".
        - `dateRangeInMs` (number): The date range in milliseconds.
    - Example:
      ```json
      {
        "type": "getPlutaLog",
        "dateRangeInMs": 86400000
      }
      ```
    - Note: The `dateRangeInMs` field is optional. If not provided, the server will return the entire Pluta log.
    - Note: The `dateRangeInMs` field should be a positive integer representing the number of milliseconds in the date
      range.

#### Server to Client

- **Pluta**: Sends the Pluta value to the client. Sent periodically every 15 seconds.
    - Fields:
        - `type` (string): The type of the message, should be "Pluta".
        - `value` (number): The Pluta value.
    - Example:
      ```json
      {
        "type": "Pluta",
        "value": 5
      }
      ```

- **chatMessage**: Sends a chat message to the client. Sent when a new chat message is received.
    - Fields:
        - `type` (string): The type of the message, should be "chatMessage".
        - `username` (string): The username of the sender.
        - `text` (string): The text content of the message.
        - `timestamp` (string): The timestamp of the message in ISO 8601 format.
    - Example:
      ```json
      {
        "type": "message",
        "message": {
          "type": "chatMessage",
          "username": "Kamil",
          "text": "halko",
          "timestamp": "2024-12-17T12:53:03.844Z"
        }
      }
      ```

- **history**: Sends the chat history to the client. Sent when a client connects.
    - Fields:
        - `type` (string): The type of the message, should be "history".
        - `messages` (array): An array of chat messages.
    - Example:
      ```json
      {
        "type": "history",
        "messages": [
          {
            "username": "Kamil",
            "text": "Halo!",
            "timestamp": "2024-12-17T12:53:03.844Z"
          },
          {
            "username": "Paweł",
            "text": "Cześć!",
            "timestamp": "2024-12-17T12:54:21.532Z"
          }
        ]
      }
      ```

- **plutaLog**: Sends the Pluta log to the client in response to a `getPlutaLog` request.
    - Fields:
        - `type` (string): The type of the message, should be "plutaLog".
        - `value` (array): An array of objects containing `plutaValue` (number) and `created_at` (string in ISO 8601
          format).
        - `dateRangeInMs` (number): The date range in milliseconds.
    - Example:
      ```json
      {
        "type": "plutaLog",
        "value": [
          {
            "plutaValue": 23.3,
            "created_at": "2024-12-17T12:54:21.532Z"
          },
          {
            "plutaValue": 28.9,
            "created_at": "2024-12-17T11:08:49.116Z"
          }
        ],
        "dateRangeInMs": 86400000
      }
      ```

- **activeUsers**: Sends the count of active users to the client when the count changes.
    - Fields:
        - `type` (string): The type of the message, should be "activeUsers".
        - `count` (number): The count of active users.
    - Example:
      ```json
      {
        "type": "activeUsers",
        "count": 2
      }
      ```

## Error Handling

In case of an error, the server will send an error message in the following format:

```json
{
  "type": "error",
  "message": "Error message"
}
```