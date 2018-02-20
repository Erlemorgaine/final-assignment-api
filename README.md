# Express Batches API

RESTful Express API for Batches on top of MongoDB.

## Authentication

Create a User with the following attributes:

| Attribute | Type   | Description   |
|-----------|--------|---------------|
| name      | string | Full name     |
| email     | string | Email address |
| password  | string | Password      |

Use the following endpoints to deal with initial authentication and the user.

| HTTP Verb | Path        | Description |
|-----------|-------------|--------------|
| `POST`    | `/users`    | Create a user account |
| `POST`    | `/sessions` | Log in with email and password, and retrieve a JWT token |
| `GET`     | `/users/me` | Retrieve own user data |

To authorize further requests, use Bearer authentication with the provided JWT token:

```
Authorization: Bearer <token here>
```

_**Note**: See `db/seed.js` for an example._

## Batches

**Note:** See `models/batch.js` for the Batch schema attributes.

| HTTP Verb | Path | Description |
|-----------|------|--------------|
| `GET` | `/batches` | Retrieve all batches |
| `POST` | `/batches` | Create a batch* |
| `GET` | `/batches/:id` | Retrieve a single batch by it's `id` |
| `PUT` | `/batches/:id` | Update a batch with a specific `id`* |
| `PATCH` | `/batches/:id` | Patch (partial update) a batch with a specific `id`* |
| `DELETE` | `/batches/:id` | Destroy a single batch by it's `id`* |
| | | _* Needs authentication_ |

_**Note**: Run `yarn run seed` to seed some initial batches._
