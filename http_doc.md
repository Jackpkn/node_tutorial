# Core Concepts

Before we jump into the specific APIs, let's understand the underlying concepts:

### Client-Server Architecture
The `http` module is built around the client-server paradigm.

- **Server**: A server listens for incoming HTTP requests from clients and sends back responses.
- **Client**: A client initiates HTTP requests to servers.

### Request-Response Cycle
Communication between client and server follows a request-response cycle:

- **Request**: The client sends an HTTP request to the server. This request includes a method (e.g., GET, POST), a URL, headers, and optionally a body.
- **Response**: The server processes the request and sends back an HTTP response. The response includes a status code (e.g., 200 OK, 404 Not Found), headers, and optionally a body.

### HTTP Headers
Headers are key-value pairs that provide information about the request or response. Common headers include `Content-Type`, `Content-Length`, `User-Agent`, and `Authorization`.

### HTTP Methods
Standard methods specify the action to be performed by a server. Common methods include:

- **GET**: Retrieve a resource.
- **POST**: Submit data to be processed.
- **PUT**: Update or create a resource.
- **DELETE**: Remove a resource.

### HTTP Status Codes
Numeric codes that indicate the status of a request. Common codes include:

- **200 OK**: Request was successful.
- **404 Not Found**: Resource was not found.
- **500 Internal Server Error**: Server encountered an error.

## http Module: Server-Side

Let's focus on creating an HTTP server using the `http` module:

### 1. Creating an HTTP Server

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
    // This function handles incoming requests
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
```

- `http.createServer([options][, requestListener])`: Creates a new HTTP server.
  - **requestListener**: A function that is executed every time an HTTP request is received. It takes two arguments:
    - `req` (http.IncomingMessage): An object representing the incoming request.
    - `res` (http.ServerResponse): An object used to send the response.
  - **options**: An optional object, it can be used to customize the HTTP server’s behavior. Options:
    - `insecureHTTPParser`: When true, accept non-RFC7230-compliant HTTP headers. Default false.
    - `maxHeaderSize`: Specifies the maximum size of request headers in bytes. Default 16384 bytes.
- `server.listen([port][, hostname][, backlog][, callback])`: Starts the HTTP server and listens for connections on the specified port and address.

### 2. Handling Incoming Requests (req - http.IncomingMessage)

**Properties:**

- `req.url`: The URL requested by the client (e.g., /path?query=value).
- `req.method`: The HTTP method used in the request (e.g., GET, POST).
- `req.headers`: An object containing the request headers (e.g., req.headers.accept).
- `req.httpVersion`: The HTTP version used by the client (e.g., 1.1).
- `req.socket`: The underlying net.Socket object associated with the connection.
- `req.aborted`: A Boolean that indicates whether the request was terminated.

**Events:**

- `'data'`: Emitted when a chunk of the request body is received.
- `'end'`: Emitted when the entire request body has been received.
- `'error'`: Emitted when there is an error receiving data.
- `'aborted'`: Emitted when request is aborted.

**Example (Reading Request Body):**

```javascript
http.createServer((req, res) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
        console.log('Request Body:', body); // Process the body
        res.end('Data Received'); // Respond
    });
}).listen(3000);
```

### 3. Sending Responses (res - http.ServerResponse)

**Methods:**

- `res.statusCode`: Sets the HTTP status code of the response.
- `res.statusMessage`: Sets the status message of the response.
- `res.setHeader(name, value)`: Sets a response header.
- `res.getHeader(name)`: Get a header in response.
- `res.hasHeader(name)`: Check if header is in response.
- `res.removeHeader(name)`: Remove the header.
- `res.write(chunk[, encoding][, callback])`: Sends a chunk of the response body.
- `res.writeHead(statusCode[, statusMessage][, headers])`: Sends response headers and status code.
- `res.end([data][, encoding][, callback])`: Signals that the response is complete. Optionally sends the last chunk of data.
- `res.setTimeout(msecs[, callback])`: Set a timeout for the response.
- `res.flushHeaders()`: Flush response headers.

**Properties:**

- `res.headersSent`: A Boolean indicating whether the headers are sent or not.
- `res.socket`: The socket associated with the connection.

**Example (Sending a Basic Response):**

```javascript
http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello, World!');
}).listen(3000);
```

### 4. Advanced Server-Side Examples

**Serving HTML Files**

```javascript
const fs = require('fs');
const path = require('path');

http.createServer((req, res) => {
    if (req.url === '/') {
        fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
            if (err) {
              res.statusCode = 500;
              res.end('Internal Server Error');
              return;
            }
            res.setHeader('Content-Type', 'text/html');
            res.end(data);
        });
    } else {
        res.statusCode = 404;
        res.end('Not Found');
    }
}).listen(3000);
```

**Handling Different Routes**

```javascript
http.createServer((req, res) => {
    if (req.url === '/' && req.method === 'GET') {
        res.end('Home Page');
    } else if (req.url === '/about' && req.method === 'GET') {
        res.end('About Page');
    } else if (req.url === '/api/users' && req.method === 'GET') {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify([{ id: 1, name: 'User 1'}]));
    } else {
      res.statusCode = 404;
      res.end("Not Found");
    }
}).listen(3000);
```

## http Module: Client-Side

The `http` module also allows you to create HTTP clients to make requests to other servers.

### 1. Making HTTP Requests

- `http.request(options[, callback])`: Creates an `http.ClientRequest` object, which can be used to make a request.
  - **options**: An object containing request options:
    - `url`: request URL.
    - `method`: HTTP method (e.g., GET, POST).
    - `hostname`: The hostname or IP address of the server.
    - `port`: The port number of the server.
    - `path`: The path of the resource to be accessed on the server.
    - `headers`: An object containing request headers.
    - `auth`: The basic auth for the request.
    - `agent`: The connection agent.
    - `timeout`: The timeout of the request.
    - `family`: IP version.
  - **callback**: An optional function called when the response is received.
- `http.get(options[, callback])`: A convenience method for making GET requests. It is equivalent to `http.request` with the method set to GET.

`http.request` returns `ClientRequest` which represents an in-progress request whose headers have not been sent. It is emitted with 'response' event.

**Example of sending data with POST request:**

```javascript
const options = {
    hostname: 'example.com',
    port: 80,
    path: '/post',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
};

const req = http.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => {
      body += chunk;
    });
    res.on('end', () => {
      console.log('Response:', body);
    });
});

req.on('error', (err) => {
  console.error('Request Error', err);
});

const data = {key: "value"};
req.write(JSON.stringify(data));
req.end();
```

### 2. http.ClientRequest

**Methods:**

- `req.write(chunk[, encoding][, callback])`: Sends data as the request body.
- `req.end([data][, encoding][, callback])`: Marks the end of the request body.
- `req.setHeader(name, value)`: Sets a request header.
- `req.getHeader(name)`: Get a header in request.
- `req.hasHeader(name)`: Check if header is in request.
- `req.removeHeader(name)`: Remove the header.
- `req.abort()`: Abort the request.
- `req.setTimeout(msecs[, callback])`: Set a timeout for the request.
- `req.flushHeaders()`: Flush request headers.

**Events:**

- `'response'`: Emitted when a response is received from the server (provides the `http.IncomingMessage` object representing the response).
- `'error'`: Emitted if there is an error during the request.
- `'abort'`: Emitted when the request is aborted.
- `'connect'`: Emitted when the server responds to a CONNECT request.
- `'continue'`: Emitted when the server sends a HTTP/1.1 100 Continue response.
- `'upgrade'`: Emitted when the server responds to an upgrade request.
- `'socket'`: Emitted when a socket is assigned to this request.

### 3. Handling Responses on Client Side

The response on client side comes as `http.IncomingMessage` with the following property and events:

**Properties:**

- `res.statusCode`: The HTTP status code of the response.
- `res.statusMessage`: The status message of the response.
- `res.headers`: An object containing the response headers.
- `res.httpVersion`: The HTTP version of the response.
- `res.socket`: Underlying socket associated with connection.
- `res.complete`: A Boolean value which indicates whether response is complete.

**Events:**

- `'data'`: Emitted when a chunk of the response body is received.
- `'end'`: Emitted when the entire response body has been received.
- `'error'`: Emitted when there is an error receiving data.
- `'aborted'`: Emitted when response is aborted.
- `'close'`: Emitted when the underlying connection is closed.

**Example of receiving data:**

```javascript
const options = {
    hostname: 'example.com',
    port: 80,
    path: '/',
    method: 'GET'
};

const req = http.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => {
      body += chunk;
    });
    res.on('end', () => {
      console.log('Response:', body);
    });
});

req.on('error', (err) => {
  console.error('Request Error', err);
});

req.end();
```

## Key Takeaways

- The `http` module provides fundamental building blocks for creating HTTP servers and clients.
- Understand the request-response cycle, HTTP methods, status codes, and headers.
- Use `http.createServer` to create an HTTP server.
- Use `http.request` or `http.get` to make HTTP requests as a client.
- Work with `http.IncomingMessage` to read request bodies (server) and response bodies (client).
- Use `http.ServerResponse` to send HTTP responses (server).
- `http` module is low level. Frameworks like Express.js often add higher-level abstractions on top of it.

## Important Considerations

- **Error Handling**: Always include proper error handling.
- **Security**: Be careful when handling user input, especially if you are building a server.
- **Asynchronous Operations**: HTTP requests and responses are asynchronous, so using callbacks, promises, or async/await is important.
- **Buffering**: If handling large amounts of data, be aware of buffering behavior.
- **HTTPS**: For secure communication, consider using the `https` module.
