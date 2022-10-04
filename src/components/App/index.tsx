import React, { useEffect, useState } from 'react';
import { Box, useApp } from 'ink';
import NavBar from '../NavBar'
import SlackerAPI from '../../api'

const App: React.FC = () => {

    // TODO grab last 100 or so messages on load with a useEffect hook
    // @ts-ignore
    const [messageHistory, setMessageHistory] = useState<Slacker.MessageEvent[]>([]);
    const [channels, setChannels] = useState<Slacker.Channel[]>([]);
    // @ts-ignore
    const [users, setUsers] = useState<Slacker.User[]>([]);

    const { exit } = useApp()

    const handleNewMessage = (messageEvent: Slacker.MessageEvent) => {
        setMessageHistory((prev) => {
            return [...prev, messageEvent];
        });
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
            flexDirection="column"
        >
            <NavBar
                channels={channels}
                exit={quitSlacker}
            />
        </Box>
    )
};

export default App;
