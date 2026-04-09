# Playwithfriends

Source code for playwithfriends.link
The page is a game collection targeted at gamers who want to play with friends, e.g. in a remote setting or couch gaming.

## Tech

Server Side generated Angular app with static hosting on github pages. Code mostly AI generated.

## Development server

To start a local development server, run:

```bash
npm run start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

`npm run start` also watches `src/data/games/*.json` and regenerates `src/data/games/index.json` automatically when game files change.

## Formatting

```bash
# format all supported files
npm run format

# check formatting in CI/local without writing
npm run format:check
```

## Lima sandbox (minimal)

### 1) Config file

Install Lima once:

```bash
brew install lima
```

Use the committed file `./lima-agent.yaml` (already in this repo).

### 2) Commands you need most

```bash
# create/start VM
limactl start --name pwf-agent ./lima-agent.yaml
```
