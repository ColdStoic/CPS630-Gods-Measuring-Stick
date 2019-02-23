/**
* Handles a message event from the main context.
* @param {WorkerMessageEvent} event The message event.
*/
function handleMessageEvent(event) {
// Do something with the message.
//console.log('Worker received message:', event.data);
// Send the message back to the main context.

self.postMessage('!n Your '+event.data+ ' message was received.');
}
// Register the message event handler.
self.addEventListener('message', handleMessageEvent);