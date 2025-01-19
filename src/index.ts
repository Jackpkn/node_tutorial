// import { log } from 'console';
import dotenv from 'dotenv';
import http from 'http';
dotenv.config();
interface Users{
    id: number,
    name: string,
    email: string
}
let users: Users[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
]
const PORT = process.env.PORT;
const server = http.createServer(  (req:  http.IncomingMessage, res: http.ServerResponse)=>{ // it will create the new http server instance 

  const {method, url} = req;  //  The HTTP method of the request (e.g., GET, POST, PUT, DELETE).
  //url- The url path of the request /users  or /users/1 

  const parts = url?.split('/').filter(Boolean) || []; //  /users → ['users'] /users/1 → ['users', '1']
  const resource = parts[0]; // resource: The first part of the URL (e.g., users).
  const id = parts[1]? parseInt(parts[1]): null;  //id: The second part of the URL, if it exists, is parsed as an integer (e.g., 1).
  if(resource==='users'){
    switch(method){
        case 'GET':
            if(id){
                /// GET /users/:id - fetch a single user
                const user = users.find(u => u.id === id);
                if(!user){
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({message: "user not found"}));
                }else{
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(user));
                }
            }else{
                // GET /users - Fetch all users
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(users));
            }
            break;
        case 'POST':
            let body: string = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end',()=>{
            try {
                const newUser: Users = JSON.parse(body);
                newUser.id = users.length + 1;
                users.push(newUser);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(newUser));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({message: "Invalid JSON"}));
            }
            });
            break;
        case 'PUT':
             // PUT /users/:id - Update a user
             if(id){
                let body: string = '';
                req.on('data', chunk=>{
                    body +=chunk.toString();
                })
                req.on('end', ()=>{
                    try {
                        const updateUser: Users = JSON.parse(body);
                        const updateIndex = users.findIndex(u => u.id === id);
                        if(updateIndex===-1){
                            res.writeHead(404, {'content-type': 'application/json'});
                            return res.end(JSON.stringify({message: "User not found"}));
                        }
                        users[updateIndex] = {...users[updateIndex], ...updateUser};
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(users[updateIndex]));
                    } catch (error) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Invalid JSON' }));
                    }
                })
             }    
             break;
    }
  }
  res.end("server is running");
})
server.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
})

// http.createServer this function create the new http server instance
// An optional object for configuring server behavior (eg. IncomingMessage class , Server class)
// requestListener: a function that will be called for every new http request 
/// it receive two arguments : an http.IncomingMessage object (representing the request) and an http.ServerResponse object(for crafting the response)
// http.IncomingMessage:
// it represents the incoming request data, including
// url: represent request URL
// method: represents the HTTP methods (eg. GET, POST)
// headers: An object containing request headers
// statusCode: statusMessage: (for client requests)
// it is also readable stream ,allowing you to read the request body
//