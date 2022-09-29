# slacker

A TUI for interfacing with Slack.

To use this app, you will need to create a [Slack App](https://api.slack.com/)
and add it to your desired workspace. The app will need to have `socket mode`
enabled for this to work.

## Installation

Currently you need to build this project yourself to run it.

```bash
# Clone the repo
git clone https://github.com/alex-laycalvert/slacker

# Go into the repo
cd /path/to/where/you/cloned/slacker

# Get the env variables
cp .env.example .env

# To run for development
npm run dev

# To run for prod
npm run start
```

## Environment

The following variables need to be set in your `.env`

- `SLACK_API_TOKEN`: This is an OAuth User Token with every read, write, and history scope enabled except for admin ones.
- `SLACK_APP_TOKEN`: This is an App Level Token with every user, channel, group, and im scope enabled from the Events API page.

## Features

Right now this app will connect to your App and will log every single message
sent in your workspace where the Slack App is installed and show you the sending
user's display name, the channel it was sent to, and the message.
