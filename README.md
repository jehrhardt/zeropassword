# zeropasswd
Simple, privacy friendly Web3 log-in based on WebAuthn.

## How it works
- Web 1: username + password
- Web 2: oAuth 2, log-in with Google, Facbook, Apple, Twitter, auth0, 🤯
- Web 3: username + key pair

## Development
### Prerequisites
- [Node.js](https://nodejs.org/en/) >= 18.0.0
- [Yarn](https://yarnpkg.com/) >= 1.22.0
- [Supabase CLI](https://supabase.io/docs/guides/cli)

### Install dependencies
```
yarn install
```

### Run dev server
```
supabase start
yarn dev
```

### Build
```
yarn lint
yarn build
```
