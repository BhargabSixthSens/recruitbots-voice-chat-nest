import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'ws';

@WebSocketGateway({
  path: '/call',
  cors: {
    origin: '*', // Adjust as needed
  },
})
export class CallGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    // Extract botId and userId from the URL query string
    const url = new URL(client.url, `http://${client.headers.host}`);
    const botId = url.searchParams.get('botId');
    const userId = url.searchParams.get('userId');

    console.log(
      'Client connected:',
      client.id,
      'Bot ID:',
      botId,
      'User ID:',
      userId,
    );
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    console.log('Incoming message:', data);
    return { event: 'message', data };
  }
}
