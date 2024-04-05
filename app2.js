const express= require("express");
const res = require("express/lib/response");
const app= express();
const fs = require('fs');
const winston = require('winston');
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'calculate-service' },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

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

app.get("/add", (req,res)=>{
  calculation(res, req.query.n1, req.query.n2, add, 'addition');
});
app.get("/minus",(req, res) => {
  calculation(res, req.query.n1, req.query.n2, subtraction, 'subtraction');
});
app.get("/multiply",(req, res) => {
  calculation(res, req.query.n1, req.query.n2, multiplication, 'multiplication');
});
app.get("/divide",(req, res) => {
  calculation(res, req.query.n1, req.query.n2, division, 'division');
});

const port=3040;
app.listen(port,()=> {
    console.log("hello i'm listening to port"+port);
})

