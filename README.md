### Run the project
``` bash
node app2.js
```

### Explanation

#### Logger
``` js
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'calculate-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
```
声明和实例化logger，设定logger的两个级别分别是error和info
Declare and instantiate logger, setting the two levels of logger - error and info
``` js
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}
```
In a non production environment, output logs to the console for viewing and debugging programs.

#### Calculation
``` js
const subtraction = (n1, n2) => {
  return n1-n2;
}
const multiplication = (n1, n2) => {
  return n1*n2;
}
const division = (n1, n2) => {
  return n1/n2;
}
const add= (n1,n2) => {
  return n1+n2;
}
```
Encapsulating addition, subtraction, multiplication, and division as separate functions

``` js
function checkNaN(n1, n2){
  if(isNaN(n1)){
    logger.error("n1 is incorrectly defined");
    throw new Error("n1 incorrectly defined");
  }
  if(isNaN(n2)) {
    logger.error("n2 is incorrectly defined");
    throw new Error("n2 incorrectly defined");
  }
}
```
Check whether the parameters carried by the request body are valid numbers. If they are invalid, an exception is thrown

``` js
function calculation(res, num1, num2, callback, str){
  try{
    const n1= parseFloat(num1);
    const n2=parseFloat(num2);
    checkNaN(n1,n2); 
    logger.info('Parameters '+n1+' and '+n2+' received for ' + str);
    const result = callback(n1,n2);
    res.status(200).json({statuscocde:200, data: result }); 
  } catch(error) { 
      console.error(error)
      res.status(500).json({statuscocde:500, msg: error.toString() })
  }
}
```
The main logic used for calculation, the 5 parameters are HTTP response, two parameters carried by the link, a callback function for the calculation method (addition, subtraction, multiplication, and division), and a string for writing logs
``` js
app.get("/add", (req,res)=>{
  calculation(res, req.query.n1, req.query.n2, add, 'addition');
});
```
Router, when the user accesses /add, calls the calculation method to obtain the result.
