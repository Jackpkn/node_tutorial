import http from 'http';
interface Car{
    id: number,
    name: string,
    model: string
}
let cars: Car[] = [
    { id: 1, name: 'Toyota', model: 'Corolla' },
    { id: 2, name: 'Honda', model: 'Civic' },
]
// create a http server that will handle the http request and response 
// it will call for every new http request
// http.createServer receive the options  that is optional an it is used for configuring the server behavior
// and the requestListener function that will call for every new http request
// it receive two arguments: an http.IncomingMessage object ( representing the request) and the http response object
// that for crafting the response
// http.IncomingMessage: it is  a readable stream representing the http request to the server 
//  readable means that mean ir receive the data in chunks and it is not a single chunk of data 
// it is a stream of data that is why we need to listen for the data event to get the data  
// and it is an event emitter that emit the event when the data is available
// the data is available in the form of buffer so we need to convert it into string
// http.ServerResponse: it is a writable stream representing the http response to the client
// writable means that we can write the data to the response object
// it is also an event emitter that emit the event when the response is finished
// it is used to send the response to the client
// the response is sent in the form of buffer so we need to convert it into string
// the response object has the following methods:
// writeHead: it is used to write the response header to the client
// end: it is used to end the response and send the data to the client
// listen: it is used to start the server listening for the incoming request
// the response object has the following properties:
// statusCode: it is used to set the status code of the response
// statusMessage: it is used to set the status message of the response
// the response object has the following events:
// finish: it is emitted when the response is finished
// close: it is emitted when the response is closed
// the response object has the following methods:
// write: it is used to write the data to the response
// writeHead: it is used to write the response header to the client
// end: it is used to end the response and send the data to the client
// listen: it is used to start the server listening for the incoming request
// the response object has the following properties:
// statusCode: it is used to set the status code of the response
// statusMessage: it is used to set the status message of the response
// the response object has the following events:
// finish: it is emitted when the response is finished
// close: it is emitted when the response is closed
// the request object has the following properties:
// url: it is used to get the request URL
// method: it is used to get the request method (eg. GET, POST)
// headers: it is used to get the request headers
// the request object has the following methods:
// on: it is used to listen for the request event
// the request object has the following events:
// data: it is emitted when the request data is available
// end: it is emitted when the request is finished
// the request object has the following properties:
// url: it is used to get the request URL
// method: it is used to get the request method (eg. GET, POST)
// headers: it is used to get the request headers
// the request object has the following methods:
// on: it is used to listen for the request event
// the request object has the following events:
// data: it is emitted when the request data is available
// end: it is emitted when the request is finished
// the request object has the following properties:
// url: it is used to get the request URL
// method: it is used to get the request method (eg. GET, POST)
// headers: it is used to get the request headers
const server  = http.createServer((req, res)=>{
    // get the request method
    const method = req.method;
    // get the request url
    const url = req.url;
    // get the request headers
    const headers = req.headers;
    // get the request status code
    const statusCode = req.statusCode;
    // get the request status message
    const statusMessage = req.statusMessage;
    // get the request body
    let body: string = '';
    req.on('data', chunk=>{
        body += chunk.toString();
    })
    req.on('end', ()=>{
        switch(method){
            case 'GET':
                // GET /cars - Get all cars
                if(url === '/cars'){
                    res.writeHead(200, {'content-type': 'application/json'});
                    res.end(JSON.stringify(cars));
                }
                // GET /cars/:id - Get a car
                else if(url?.includes('/cars/')){
                    const id = parseInt(url.split('/')[2]);
                    const car = cars.find(c=>c.id === id);
                    if(!car){
                        res.writeHead(404, {'content-type': 'application/json'});
                        return res.end(JSON.stringify({message: "Car not found"}));
                    }
                    res.writeHead(200, {'content-type': 'application/json'});
                    res.end(JSON.stringify(car));
                }
                break;
            case 'POST':
                // POST /cars - Create a car
                if(url === '/cars'){
                    try {
                        const newCar: Car = JSON.parse(body);
                        newCar.id = cars.length + 1;
                        cars.push(newCar);
                        res.writeHead(201, {'content-type': 'application/json'});
                        res.end(JSON.stringify(newCar));
                    } catch (error) {
                        res.writeHead(400, {'content-type': 'application/json'});
                        res.end(JSON.stringify({message: "Invalid JSON"}));
                    }
                }
                break;
            case 'PUT':
                // PUT /cars/:id - Update a car
                if(url?.includes('/cars/')){
                    const id = parseInt(url.split('/')[2]);
                    let updateCar: Car = JSON.parse(body);
                    const updateIndex = cars.findIndex(c=>c.id === id);
                    if(updateIndex === -1){
                        res.writeHead(404, {'content-type': 'application/json'});
                        return res.end(JSON.stringify({message: "Car not found"}));
                    }
                    cars[updateIndex] = {...cars[updateIndex], ...updateCar
                    };
                    res.writeHead(200, {'content-type': 'application/json'});
                    res.end(JSON.stringify(cars[updateIndex]));
                }
                break;
            case 'DELETE':
                // DELETE /cars/:id - Delete a car
                if(url?.includes('/cars/')){
                    const id = parseInt(url.split('/')[2]);
                    const deleteIndex = cars.findIndex(c=>c.id === id);
                    if(deleteIndex === -1){
                        res.writeHead(404, {'content-type': 'application/json'});
                        return res.end(JSON.stringify({message: "Car not found"}));
                    }
                    cars.splice(deleteIndex, 1);
                    res.writeHead(204, {'content-type': 'application/json'});
                    res.end();
                }
                break;
            default:
                res.writeHead(404, {'content-type': 'application/json'});
                res.end(JSON.stringify({message: "Route not found"}));

        }
    }
    )
});