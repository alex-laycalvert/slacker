declare global;

namespace Slacker {
    interface Config {
        apiToken: string | undefined;
        appToken: string | undefined;
    }

    interface Channel {
        id: string;
        name: string;
        topic: string;
        focus: string;
    }

    interface MessageEvent {
        timestamp: string;
        id: string;
        userId: string;
        teamId: string;
        channelId: string;
        channelType: string;
        message: string;
    }
}
