import React, { useState, useEffect } from 'react';
import { Box, Text, useFocus, useInput } from 'ink';
import SlackerAPI from '../../api/index';

const QUIT = 'q';
const MOVE_UP = 'k';
const MOVE_DOWN = 'j';

interface Props {
    channel: Slacker.Channel | null | undefined;
    exit: () => void;
    users: Slacker.User[];
    height?: number | string;
    width?: number | string;
}

const ChatDisplay: React.FC<Props> = ({
    channel,
    exit,
    height,
    width
}) => {
    if (!height) {
        height = '100%';
    }
    if (!width) {
        width = '100%';
    }

    const { isFocused } = useFocus();

    // @ts-ignore
    useInput((input, key) => {
        if (isFocused) {
            switch (input) {
                case MOVE_UP:
                    break;
                case MOVE_DOWN:
                    break;
                case QUIT:
                    exit();
                    break;
            }
        }
    });

    // @ts-ignore
    const [messageHistory, setMessageHistory] = useState<Slacker.MessageEvent[]>([]);
    
    useEffect(() => {
        if (!channel) return;
        setMessageHistory([]);
        const getChannelHistory = async () => {
            const slackMessageHistory = await SlackerAPI.getChannelHistory(channel.id);
            setMessageHistory(slackMessageHistory);
        }
        getChannelHistory();
    }, [channel]);

    return (
        <Box
            height={height}
            width={width}
            margin={0}
            borderStyle="single"
            borderColor={isFocused ? 'magenta' : 'white'}
            flexDirection="column-reverse"
        >
            {messageHistory.map((message) => {
                return (
                    <Text>{message.userId}&gt; {message.message}</Text>
                );
            })}
        </Box>
    )
};

export default ChatDisplay;
