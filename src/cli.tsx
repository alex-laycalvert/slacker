import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import App from './components/App';

const cli = meow(`
	Usage
	  $ slacker

	Options
		--name  Your name

	Examples
	  $ slacker --name=Jane
	  Hello, Jane
`, {
	flags: {
		name: {
			type: 'string'
		}
	}
});

render(<App name={cli.flags.name}/>);
