## Getting Started

First, install the dependencies:

```bash
npm install
```

You can now run the app:

```bash
docker compose up

```

The app is available on [http://localhost:3000](http://localhost:3000).

### Stripe

To setup Stripe, you first need to define three variables in a `.env` file at the root of the project:

```
STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET
```

## A quick tour

### Helpers

More details can be found in each file, but here's a quick overview of the various available helpers.

#### `libs/api.ts`

This file exposes helpers to call the API from the client side. You can use `useQuery` to make `GET` calls, and `useMutation` to make `POST`, `PUT` or `DELETE` calls. It will automatically forward the current user JWT.

#### `libs/endpoint.ts`

This file exposes helpers to create API endpoint on the server side. More information on how to setup an API endpoint can be found in [the API section of this documentation](#api).

#### `libs/form.ts`

This file exposes a hook generator. It allows you to generate a hook that will validate your form data.

#### `libs/jwt.ts`

This file exposes functions to create and read a JWT. If you want to add metadata to the JWT, this is where to do it.

#### `libs/prisma.ts`

This file exposes an instanciated Prisma client.

#### `libs/products.ts`

This file exposes an async function to fetch products information. For more information, see the [Stripe section](#stripe).

#### `libs/Result.ts`

This file exposes a simple Result object, to handle errors in a more functional (and typed) manner.

#### `libs/session.ts`

This file exposes a hook to manage user sessions.

### Components

This project comes with various ready to use components.

### Documentation

The documentation is built with components.

### API

To setup a new endpoint:
