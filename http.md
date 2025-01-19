# HTTP Tutorial

## 1. What is HTTP?

HTTP (Hypertext Transfer Protocol) is the foundation of data communication on the web. It is a request-response protocol where:

- A client (e.g., a browser) sends an HTTP request to a server.
- The server processes the request and sends back an HTTP response.

## 2. HTTP Methods

HTTP methods define the action to be performed on a resource. The most common methods are:

| Method   | Description                                      |
|----------|--------------------------------------------------|
| GET      | Retrieve data from the server.                   |
| POST     | Send data to the server to create a new resource.|
| PUT      | Send data to the server to update an existing resource. |
| DELETE   | Request the server to delete a resource.         |
| PATCH    | Partially update an existing resource.           |
| HEAD     | Retrieve only the headers of a response (no body).|
| OPTIONS  | Retrieve the supported HTTP methods for a resource.|

## 3. Deep Dive into Each HTTP Method

### 1. GET

**Purpose:** Retrieve data from the server.

**Idempotent:** Yes (repeating the request has no side effects).

**Safe:** Yes (does not modify the resource).

**Theory:** Used to fetch data from the server. Data is sent in the URL as query parameters (e.g., `/users?id=1`).

**Practical Example:**

```typescript
import http from 'http';

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/users') {
        const users = [
            { id: 1, name: 'John Doe' },
            { id: 2, name: 'Jane Smith' },
        ];
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users));
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Not Found' }));
    }
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
```

**Request:** `GET /users`

**Response:**

```json
[
    { "id": 1, "name": "John Doe" },
    { "id": 2, "name": "Jane Smith" }
]
```

### 2. POST

**Purpose:** Send data to the server to create a new resource.

**Idempotent:** No (repeating the request may create multiple resources).

**Safe:** No (modifies the resource).

**Theory:** Used to submit data to the server (e.g., form submissions). Data is sent in the request body.

**Practical Example:**

```typescript
import http from 'http';

let users: { id: number; name: string }[] = [];

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/users') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const newUser = JSON.parse(body);
            newUser.id = users.length + 1;
            users.push(newUser);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newUser));
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Not Found' }));
    }
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
```

**Request:** `POST /users`

```json
{ "name": "Alice" }
```

**Response:**

```json
{ "id": 1, "name": "Alice" }
```

### 3. PUT

**Purpose:** Send data to the server to update an existing resource.

**Idempotent:** Yes (repeating the request has no side effects).

**Safe:** No (modifies the resource).

**Theory:** Used to update an entire resource. The client sends the complete updated resource in the request body.

**Practical Example:**

```typescript
import http from 'http';

let users = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
];

const server = http.createServer((req, res) => {
    if (req.method === 'PUT' && req.url?.startsWith('/users/')) {
        const userId = parseInt(req.url.split('/')[2]);
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const updatedUser = JSON.parse(body);
            const userIndex = users.findIndex(u => u.id === userId);
            if (userIndex === -1) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'User not found' }));
            } else {
                users[userIndex] = { ...users[userIndex], ...updatedUser };
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(users[userIndex]));
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Not Found' }));
    }
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
```

**Request:** `PUT /users/1`

```json
{ "name": "John Smith" }
```

**Response:**

```json
{ "id": 1, "name": "John Smith" }
```

### 4. DELETE

**Purpose:** Request the server to delete a resource.

**Idempotent:** Yes (repeating the request has no side effects).

**Safe:** No (modifies the resource).

**Theory:** Used to delete a resource identified by a URL.

**Practical Example:**

```typescript
import http from 'http';

let users = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
];

const server = http.createServer((req, res) => {
    if (req.method === 'DELETE' && req.url?.startsWith('/users/')) {
        const userId = parseInt(req.url.split('/')[2]);
        const userIndex = users.findIndex(u => u.id === userId);
        if (userIndex === -1) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'User not found' }));
        } else {
            users.splice(userIndex, 1);
            res.writeHead(204);
            res.end();
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Not Found' }));
    }
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
```

**Request:** `DELETE /users/1`

**Response:** `204 No Content`

### 5. PATCH

**Purpose:** Partially update an existing resource.

**Idempotent:** Yes (repeating the request has no side effects).

**Safe:** No (modifies the resource).

**Theory:** Used to update specific fields of a resource without sending the entire resource.

**Practical Example:**

```typescript
import http from 'http';

let users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
];

const server = http.createServer((req, res) => {
    if (req.method === 'PATCH' && req.url?.startsWith('/users/')) {
        const userId = parseInt(req.url.split('/')[2]);
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const updatedFields = JSON.parse(body);
            const userIndex = users.findIndex(u => u.id === userId);
            if (userIndex === -1) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'User not found' }));
            } else {
                users[userIndex] = { ...users[userIndex], ...updatedFields };
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(users[userIndex]));
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Not Found' }));
    }
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
```

**Request:** `PATCH /users/1`

```json
{ "email": "john.doe@example.com" }
```

**Response:**

```json
{ "id": 1, "name": "John Doe", "email": "john.doe@example.com" }
```

## 4. Summary of HTTP Methods

| Method | Use Case                      | Idempotent | Safe |
|--------|-------------------------------|------------|------|
| GET    | Retrieve data                 | Yes        | Yes  |
| POST   | Create a new resource         | No         | No   |
| PUT    | Update an entire resource     | Yes        | No   |
| DELETE | Delete a resource             | Yes        | No   |
| PATCH  | Partially update a resource   | Yes        | No   |

## 5. Real-Life Examples

| Method | Real-Life Example                                      |
|--------|--------------------------------------------------------|
| GET    | Fetching a list of products from an e-commerce website.|
| POST   | Submitting a registration form to create a new user account. |
| PUT    | Updating your entire profile information on a social media platform. |
| DELETE | Deleting a post from your blog.                        |
| PATCH  | Updating only your email address in your profile settings. |