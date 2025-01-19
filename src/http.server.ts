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
// create a http that will handle the http request for each request
const server = http.createServer((req, res)=>{
  // receive the method 
  const {method, url} = req; 
  // we have extract the url 
  // for example if the user call on 
  const parts = url?.split('/').filter(Boolean) || [] // it will split it into parts /cars - > ['cars']
  // /cars/1 -> ['cars', '1']
  const resource = parts[0] // users the first part of the url
  const id = parts[1]? parseInt(parts[1]): null;
  if(resource==='cars'){
    switch(method){
        case 'GET':
            // GET /user:id
            // GET /uses
            if(id){
                // if the id is not null that mean the it want to retrieve the one user
                const car = cars.find(u=>u.id===id);
                if(!car){
                    res.writeHead(404,  {'Content-Type': 'application/json'});
                   return res.end(JSON.stringify({message: "Car not found"}));
                }
               res.writeHead(200,{'Content-Type': 'application/json'});
               res.end(JSON.stringify(car));
            }
            else{
                res.writeHead(200,{'Content-Type': 'application/json'});
                res.end(JSON.stringify(cars));
            }
            break;
        case 'POST':
            

    }
  }

})