declare global;

namespace Slacker {
    interface Config {
        apiToken: string | undefined;
        appToken: string | undefined;
    }

    interface User {
        id: string;
        teamId: string;
        deleted: boolean;
        color: string;
        name: string;
        realName: string;
        displayName: string;
        timezone: string;
        statusText: string;
        statusEmoji: string;
        email: string;
        isAdmin: boolean;
        isBot: boolean;
    }

    interface Channel {
        id: string;
        createdBy: string;
        name: string;
        topic: string;
        focus: string;
    }

    interface MessageEvent {
        timestamp: string;
        userId: string;
        teamId?: string;
        channelId?: string;
        channelType?: string;
        message: string;
    }
}
