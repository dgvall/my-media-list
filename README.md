# myTV

myTV is a single page application that allows users to create a personal list of TV shows. Each TV show in a list presents attributes of status (completed, planning, watching, dropped), episode progress, and score.

## Setup

TV shows are searched through the TVmaze API. To add to or update your list, the db.json server must be running. Go to the my-media-list directory in your CLI and then proceed to installation and activation.

### Installation
```bash
npm install -g json-server
```

### Activation
```bash
json-server --watch db.json
```

## API
https://www.tvmaze.com/api
