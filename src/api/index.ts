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
            try {
                const response = await axios.post(
                    'https://slack.com/api/apps.connections.open', {}, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' + this._config.appToken,
                        }
                    }
                );
                if (!response.data.ok) {
                    console.error('Error getting API endpoint:', response.data.error);
                    return '';
                }
                this._endpoint = response.data.url;
            } catch (e) {
                console.error(e);
                return '';
            }
        }
        return this._endpoint;
    }

    static async getUsers (): Promise<Slacker.User[]> {
        try {
            const response = await axios.get(
                'https://slack.com/api/users.list', {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Authorization: 'Bearer ' + this._config.apiToken,
                    }
                }
            );
            if (!response.data.ok) {
                console.error('Error gettting users:', response.data.error);
                return [];
            }
            return response.data.members.map((member: any) => {
                return {
                    id: member.id,
                    teamId: member.team_id,
                    deleted: member.deleted,
                    color: member.color,
                    name: member.name,
                    realName: member.profile.real_name,
                    displayName: member.profile.display_name,
                    timezone: member.tz,
                    statusText: member.profile.status_text, 
                    statusEmoji: member.profile.status_emoji, 
                    email: member.profile.email,
                    isAdmin: member.isAdmin,
                    isBot: member.isBot
                }
            });
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    static async getChannels (): Promise<Slacker.Channel[]> {
        try {
            const response = await axios.get(
                'https://slack.com/api/conversations.list', {
                    headers: {
                        'Content-Type': 'application/www-form-urlencoded',
                        Authorization: 'Bearer ' + this._config.apiToken
                    }
                }
            );
            if (!response.data.ok) {
                console.error('Error getting channels:', response.data.error);
                return [];
            }
            return response.data.channels.map((channel: any) => {
                return {
                    id: channel.id,
                    createdBy: channel.creator,
                    name: channel.name,
                    topic: channel.topic.value,
                    purpose: channel.topic.value
                }
            });
        } catch (e) {
            console.error(e)
            return []
        }
    }

    static async getChannelHistory (channelId: string): Promise<Slacker.MessageEvent[]> {
        try {
            const response = await axios.get(
                'https://slack.com/api/conversations.history', {
                    headers: {
                        'Content-Type': 'application/www-form-urlencoded',
                        Authorization: 'Bearer ' + this._config.apiToken
                    },
                    params: {
                        channel: channelId
                    }
                }
            );
            if (!response.data.ok) {
                console.error('Error getting channel history:', response.data.error);
                return [];
            }
            return response.data.messages.map((message: any) => {
                return {
                    timestamp: message.ts,
                    userId: message.user,
                    message: message.text
                }
            });
        } catch (e) {
            console.error('Error getting channel history:', e);
            return [];
        }
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
                userId: data.payload.event.user as string,
                teamId: data.payload.event.team as string,
                channelId: data.payload.event.channel as string,
                channelType: data.payload.event.channel_type as string,
                message: data.payload.event.text as string,
            })
        }
    }

    static closeSocket () {
        if (!this._socket) {
            return;
        }
        this._socket.close();
    }
}
