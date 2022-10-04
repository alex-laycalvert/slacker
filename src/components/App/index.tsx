import React, { useEffect } from 'react';
import { Box, useApp, useInput } from 'ink';

interface Props {
}

const App: React.FC<Props> = ({
}) => {

    const { exit } = useApp()

    // @ts-ignore
    useInput((input, key) => {
        if (input === 'q') {
            // TODO clear terminal when exiting
            exit()
        }
    });

    useEffect(() => {
    }, [])

    return (
        <Box
            height={process.stdout.rows}
            width={process.stdout.columns}
            borderStyle="single"
        >
        </Box>
    )
};

export default App;
