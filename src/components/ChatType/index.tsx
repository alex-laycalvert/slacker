import React, { useState } from 'react';
import { Box, Text, useFocus, useInput } from 'ink';
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

    const { isFocused } = useFocus();

    useInput((input, key) => {
        if (!isFocused) return;
        if (input === 'b' && key.meta) {
            setBold(!bold);
        }
        if (input === 'i' && key.meta) {
            setItalic(!italic);
            setMessage('');
        }
        if (input === '_') {
            setItalic(!italic);
        }
    });

    const [message, setMessage] = useState<string>('');
    const [bold, setBold] = useState<boolean>(false);
    const [italic, setItalic] = useState<boolean>(false);

    const handleSubmit = () => {
        if (!message || message.trim() === '') return;
        sendMessage(message);
        setMessage('');
    }

    return (
        <Box
            height={height}
            width={width}
            margin={0}
            borderStyle="single"
            borderColor={isFocused ? 'magenta' : 'white'}
            flexDirection="column"
        >
            <Box
                width={width}
            >
                <Box
                    width={5}
                    borderStyle="single"
                    borderColor="white"
                    paddingX={1}
                >
                    <Text
                        bold={bold}
                        color={bold ? 'magenta' : 'white'}
                    ></Text>
                </Box>
                <Box
                    width={5}
                    borderStyle="single"
                    borderColor="white"
                    paddingX={1}
                >
                    <Text
                        bold={italic}
                        color={italic ? 'magenta' : 'white'}
                    ></Text>
                </Box>
            </Box>
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
