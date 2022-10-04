import React, { useEffect, useState } from 'react';
import { Box, Text, useFocus, useInput } from 'ink';

const QUIT = 'q';
const COLLAPSE = 'c';
const MOVE_UP = 'k';
const MOVE_DOWN = 'j';

interface Props {
    channels: Slacker.Channel[];
    selectChannel: (id: string) => void;
    currentChannelId: string | null | undefined;
    exit: () => void;
    height?: number | string;
    width?: number | string;
}

const NavBar: React.FC<Props> = ({
    channels,
    selectChannel,
    currentChannelId,
    exit,
    height,
    width,
}) => {
    if (!height) {
        height = '100%';
    }
    if (!width) {
        width = '15%';
    }

    const { isFocused } = useFocus({
        autoFocus: true
    });
    
    // @ts-ignore
    useInput((input, key) => {
        if (isFocused) {
            switch (input) {
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
                case COLLAPSE:
                    setChannelsCollapsed(!channelsCollapsed)
                    break;
                case QUIT:
                    exit();
                    break;
            }
            if (key.return) {
                const selecteChannelId = channels[selectedChannel]?.id;
                if (!selecteChannelId) return;
                selectChannel(selecteChannelId);
            }
        }
    });

    const [channelsCollapsed, setChannelsCollapsed] = useState<boolean>(false);
    const [selectedChannel, setSelectedChannel] = useState<number>(-1);

    useEffect(() => {
    }, [])
        
    return (
        <Box
            height={height}
            width={width}
            margin={0}
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
                    const isCurrentChannel = channel.id === currentChannelId;
                    const channelIcon = isCurrentChannel ? '   ' : '  ';
                    return (
                        <Text
                            color={isSelectedChannel && isFocused ? 'magenta' : 'white'}
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
