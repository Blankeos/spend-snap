<h1>💸 Spend Snap</h1>

Receipt-collation software I'm building for fun for a use-case at my company
where we have to collate receipts from a trip for claims later on.

Could be a start-up idea, idk.

- [📺 Tech Stack](#%F0%9F%93%BA-tech-stack)
- [Requirements](#requirements)
- [🚀 Get started](#%F0%9F%9A%80-get-started)

## 📺 Tech Stack

- **Solid**
- **Vike** (I just like it better than Solid-Start because it feels like Svelte for me, also more customizable like making it pass `req` and `res` into my `pageContext`, separate files for `+data.ts`, `+config.ts`. It's a bit verbose in the beginning but it becomes quite pragmatic overtime.))
- **Hono** - thanks to Vike, I can run it on any web framework of my choosing.
- **Turso** + **Drizzle ORM**
- **Backblaze** - File Uploads (LocalStack for S3 in localhost)
- **Lucia**

## Requirements

- [x] Docker Desktop
- [x] Bun

## 🚀 Get started

1. Clone

```sh
git clone https://github.com/blankeos/spend-snap.git
cd spend-snap
```

2. LocalStack (S3) - For dev only

```sh
# Run localstack to check docker-compose.yml
bun s3:create

# AWS Configure first (Just use placeholders: https://github.com/localstack/localstack/issues/8424)
aws configure
AWS Access Key ID [****************test]: test
AWS Secret Access Key [****************test]: test
Default region name [us-east-1]: ap-southeast-1
Default output format [None]:

# Create a bucket in s3.
aws --endpoint-url=http://localhost:4566 s3api create-bucket --bucket spend-snap --region us-east-1

# List buckets
aws --endpoint-url=http://localhost:45666 s3api list-buckets
```

3.

<!-- # SolidStart

Everything you need to build a Solid project, powered by [`solid-start`](https://start.solidjs.com);

## Creating a project

```bash
# create a new project in the current directory
npm init solid@latest

# create a new project in my-app
npm init solid@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

Solid apps are built with _presets_, which optimise your project for deployment to different environments.

By default, `npm run build` will generate a Node app that you can run with `npm start`. To use a different preset, add it to the `devDependencies` in `package.json` and specify in your `app.config.js`.

## This project was created with the [Solid CLI](https://solid-cli.netlify.app) -->
