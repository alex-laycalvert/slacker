import React, { useEffect, useState } from 'react';
import { useApp, useInput, Box, Text } from 'ink';
import SlackerAPI from '../../api'

interface Props {
}

const App: React.FC<Props> = ({
}) => {

    // TODO grab all users and channels in workspace
    // TODO grab last 100 or so messages on load with a useEffect hook
    const [messageHistory, setMessageHistory] = useState<Slacker.MessageEvent[]>([]);

    const { exit } = useApp()

    const handleNewMessage = (messageEvent: Slacker.MessageEvent) => {
        setMessageHistory((prev) => {
            return [...prev, messageEvent];
        });
    }

    // @ts-ignore
    useInput((input, key) => {
        if (input === 'q') {
            // TODO clear terminal when exiting
            exit();
        }
    });

    useEffect(() => {
        SlackerAPI.openSocket(handleNewMessage);
    }, [])

    return (
        <Box
            height={process.stdout.rows}
            width={process.stdout.columns}
            borderStyle="single"
        >
            {messageHistory.map((message) => {
                return (
                    <Box width="100%">
                        <Text>{message.message}</Text>
                    </Box>
                )
            })}
        </Box>
    )
};

export default App;
