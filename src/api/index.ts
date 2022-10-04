import WSocket from 'ws'
import axios from 'axios'

export default class SlackerAPI {
    
    static _instance: SlackerAPI;
    static _config: Slacker.Config;
    static _endpoint: string;
    static _socket: WSocket;

    private constructor () {};

    static initialize (config: Slacker.Config) {
        if (!this._instance) {
            SlackerAPI.getInstance();
        }
        this._config = config;
    }

    static getInstance (): SlackerAPI {
        if (!this._instance) {
            this._instance = new SlackerAPI();
        }
        return this._instance;
    }

    static async getEndpoint (): Promise<string> {
        if (!this._endpoint) {
            const response = await axios.post(
                'https://slack.com/api/apps.connections.open', {}, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + this._config.appToken,
                    }
                }
            );
            if (!response.data.ok) {
                console.error('Error getting API endpoint');
                console.error(response.data.error);
                return '';
            }
            this._endpoint = response.data.url;
        }
        return this._endpoint;
    }

    static async openSocket (callback: (message: Slacker.MessageEvent) => void) {
        if (!this._endpoint) {
            await SlackerAPI.getEndpoint();
        }
        if (!this._socket) {
            this._socket = new WSocket(this._endpoint);
        }

        this._socket.onopen = () => {
        }

        this._socket.onmessage = (event: any) => {
            const data = JSON.parse(event.data)
            if (data.type === 'hello' || data.retry_attempt > 0) {
                return
            }
            const ack = JSON.stringify({
                envelope_id: data.envelope_id
            });
            this._socket.send(ack)
            callback({
                timestamp: data.payload.event.ts as string,
                id: data.payload.event.client_msg_id as string,
                userId: data.payload.event.user as string,
                teamId: data.payload.event.team as string,
                channelId: data.payload.event.channel as string,
                channelType: data.payload.event.channel_type as string,
                message: data.payload.event.text as string,
            })
        }
    }
}
