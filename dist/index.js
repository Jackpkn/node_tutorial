// import { log } from 'console';
import dotenv from 'dotenv';
import http from 'http';
dotenv.config();
let users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
];
const PORT = process.env.PORT;
const server = http.createServer((req, res) => {
    const { method, url } = req; //  The HTTP method of the request (e.g., GET, POST, PUT, DELETE).
    //url- The url path of the request /users  or /users/1 
    const parts = url?.split('/').filter(Boolean) || []; //  /users → ['users'] /users/1 → ['users', '1']
    const resource = parts[0]; // resource: The first part of the URL (e.g., users).
    const id = parts[1] ? parseInt(parts[1]) : null; //id: The second part of the URL, if it exists, is parsed as an integer (e.g., 1).
    if (resource === 'users') {
        switch (method) {
            case 'GET':
                if (id) {
                    /// GET /users/:id - fetch a single user
                    const user = users.find(u => u.id === id);
                    if (!user) {
                        res.writeHead(404, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ message: "user not found" }));
                    }
                    else {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(user));
                    }
                }
                else {
                    // GET /users - Fetch all users
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(users));
                }
                break;
        }
    }
    res.end("server is running");
});
server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});
