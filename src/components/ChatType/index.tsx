import React, { useState } from 'react';
import { Box, useFocus } from 'ink';
import TextInput from 'ink-text-input'

interface Props {
    sendMessage: (message: string) => void;
    height?: number | string;
    width?: number | string;
}

const ChatType: React.FC<Props> = ({
    sendMessage,
    height,
    width
}) => {
    if (!height) {
        height = '100%';
    }
    if (!width) {
        width = '100%';
    }

    const [message, setMessage] = useState<string>('');

    const handleSubmit = () => {
        if (!message || message.trim() === '') return;
        sendMessage(message);
    }

    const { isFocused } = useFocus();

    return (
        <Box
            height={height}
            width={width}
            margin={0}
            borderStyle="single"
            borderColor={isFocused ? 'magenta' : 'white'}
            flexDirection="column-reverse"
        >
            <TextInput
                focus={isFocused}
                value={message}
                onChange={setMessage}
                onSubmit={handleSubmit}
            />
        </Box>
    )
};

export default ChatType;
