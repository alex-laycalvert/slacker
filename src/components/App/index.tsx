import React, { useEffect, useState } from 'react';
import { Box, useApp } from 'ink';
import NavBar from '../NavBar'
import SlackerAPI from '../../api'
import ChatDisplay from '../ChatDisplay/index';

const App: React.FC = () => {

    // TODO grab last 100 or so messages on load with a useEffect hook
    // @ts-ignore
    const [messageHistory, setMessageHistory] = useState<Slacker.MessageEvent[]>([]);
    const [channels, setChannels] = useState<Slacker.Channel[]>([]);
    const [users, setUsers] = useState<Slacker.User[]>([]);
    const [currentChannel, setCurrentChannel] = useState<Slacker.Channel | null>(null)

    const { exit } = useApp()

    const handleNewMessage = (messageEvent: Slacker.MessageEvent) => {
        setMessageHistory((prev) => {
            return [...prev, messageEvent];
        });
    }

    const selectChannel = (id: string) => {
        const slackChannel = channels.find((c) => c.id === id);
        if (!slackChannel) return;
        setCurrentChannel(slackChannel);
    }

    const quitSlacker = () => {
        exit();
        SlackerAPI.closeSocket();
    }

    useEffect(() => {
        const getUsers = async () => {
            const slackUsers = await SlackerAPI.getUsers();
            setUsers(slackUsers);
        }
        const getChannels = async () => {
            const slackChannels = await SlackerAPI.getChannels();
            setChannels(slackChannels);
        }
        SlackerAPI.openSocket(handleNewMessage);
        getUsers();
        getChannels();
    }, [])

    return (
        <Box
            height={process.stdout.rows}
            width={process.stdout.columns}
            borderStyle="single"
        >
            <NavBar
                channels={channels}
                selectChannel={selectChannel}
                currentChannelId={currentChannel?.id}
                exit={quitSlacker}
            />
            <ChatDisplay
                channel={currentChannel}
                exit={quitSlacker}
                users={users}
            />
        </Box>
    )
};

export default App;
