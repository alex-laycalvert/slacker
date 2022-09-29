if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const axios = require('axios')
const Socket = require('ws')

interface User {
    id: string;
    isBot: boolean;
    teamId: string;
    name: string;
    deleted: boolean;
    color: string;
    realName: string;
    displayName: string;
    realNameNormalized: string;
    displayNameNormalized: string;
    statusText: string;
    statusEmoji: string;
    email: string;
    tz: string;
    tzLabel: string;
    tzOffset: number;
}

interface Channel {
    id: string;
    name: string;
    topic: string;
    purpose: string;
}

const getEndpoint = async (): Promise<string> => {
    const response = await axios.post('https://slack.com/api/apps.connections.open', null, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Bearer ' + process.env.SLACK_APP_TOKEN
        }
    })
    if (!response.data.ok) {
        console.error(response.data.error)
        return null
    }
    return response.data.url
}

const getUsers = async (): Promise<User[]> => {
    const response = await axios.get('https://slack.com/api/users.list', {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Bearer ' + process.env.SLACK_API_TOKEN
        }
    })
    if (!response.data.ok) {
        console.error(response.data.error)
        return []
    }
    return response.data.members.map((member) => {
        return {
            id: member.id,
            teamId: member.team_id,
            name: member.name,
            color: member.color,
            isBot: member.is_bot,
            deleted: member.deleted,
            realName: member.profile.real_name,
            displayName: member.profile.display_name,
            realNameNormalized: member.profile.real_name_normalized,
            displayNameNormalized: member.profile.display_name_normalized,
            email: member.profile.email,
            tz: member.tz,
            tzLabel: member.tz_label,
            tzOffset: member.tz_offset,
            statusText: member.profile.status_text,
            statusEmoji: member.profile.status_emoji,
        }
    })
}

const getChannels = async (): Promise<Channel[]> => {
    const response = await axios.get('https://slack.com/api/conversations.list', {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Bearer ' + process.env.SLACK_API_TOKEN
        }
    })
    if (!response.data.ok) {
        console.error(response.data.error)
        return []
    }
    return response.data.channels.map((channel) => {
        return {
            id: channel.id,
            name: channel.name_normalized,
            topic: channel.topic.value,
            purpose: channel.purpose.value,
        }
    })
}

const start = async () => {
    const users = await getUsers()
    const channels = await getChannels()
    const endpoint = await getEndpoint()
    const socket = new Socket(endpoint)
    let latestEventTime = Math.floor(Date.now() / 1000)

    socket.onopen = (e) => {
        console.log('Socket Opened')
    }

    socket.onmessage = (e) => {
        const data = JSON.parse(e.data)
        if (data.type === 'hello') return
        const payload = data.payload
        if (payload.event_time > latestEventTime) {
            const sendingUser = users.find((u) => u.id === payload.event.user)
            const channel = channels.find((c) => c.id === payload.event.channel)
            console.log(sendingUser.displayNameNormalized + ' #' + channel.name + '> ' + payload.event.text)
            latestEventTime = payload.event_time
        }
    }
}

start()
