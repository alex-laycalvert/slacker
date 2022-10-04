import React, { useEffect, useState } from 'react';
import { Box, Text, useFocus, useInput } from 'ink';

const MOVE_UP = 'k';
const MOVE_DOWN = 'j';

interface Props {
    channels: Slacker.Channel[];
    exit: () => void;
    height?: number | string;
    width?: number | string;
}

const NavBar: React.FC<Props> = ({
    channels,
    exit,
    height,
    width,
}) => {

    if (!height) {
        height = '100%';
    }
    if (!width) {
        width = 20;
    }

    const { isFocused } = useFocus({
        autoFocus: true
    });
    
    // @ts-ignore
    useInput((input, key) => {
        if (isFocused) {
            switch (input) {
                case 'q':
                    exit();
                    break;
                case MOVE_UP:
                    if (selectedChannel - 1 < 0) {
                        setSelectedChannel(channels.length - 1)
                    } else {
                        setSelectedChannel(selectedChannel - 1);
                    }
                    break;
                case MOVE_DOWN:
                    if (selectedChannel + 1 >= channels.length) {
                        setSelectedChannel(0)
                    } else {
                        setSelectedChannel(selectedChannel + 1);
                    }
                    break;
            }
            if (key.return) {
                setCurrentChannel(selectedChannel);
            }
        }
    });

    // @ts-ignore
    const [channelsCollapsed, setChannelsCollapsed] = useState<boolean>(false);
    const [selectedChannel, setSelectedChannel] = useState<number>(-1);
    const [currentChannel, setCurrentChannel] = useState<number>(-1);

    useEffect(() => {
    }, [channels])
        
    return (
        <Box
            height={height}
            width={width}
            paddingY={3}
            paddingX={1}
            flexDirection="column"
            borderStyle="single"
            borderColor={isFocused ? 'magenta' : 'white'}
        >
            <Text>{channelsCollapsed ? '' : ''} Channels:</Text>
            {
                !channelsCollapsed &&
                channels.map((channel, i) => {
                    const isSelectedChannel = i === selectedChannel;
                    const isCurrentChannel = i === currentChannel;
                    const channelIcon = isCurrentChannel ? '   ' : '  ';
                    return (
                        <Text
                            color={isSelectedChannel ? 'magenta' : 'white'}
                            bold={isSelectedChannel || isCurrentChannel}
                        >
                              {channelIcon}#{channel.name}
                        </Text>
                    )
                })
            }
        </Box>
    )
};

export default NavBar;
