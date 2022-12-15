const express = require('express')
const app = express()
const creds = require('./credentials.js')
const { TextAnalysisClient, AzureKeyCredential} = require("@azure/ai-text-analytics");
const bodyParser = require('body-parser')
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors')
const options = {
  swaggerDefinition: {
      info: {
          title: 'Entity API',
          version: '1.0.0',
          description: 'API for Entity Extraction and Linking '
      }, 
      host: 'localhost:3000',
      basePath: '/'
  },
  apis: ['./index.js'],

}

const specs = swaggerJsdoc(options);
app.use(cors())
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

const client = new TextAnalysisClient(creds.res_endpoint, new AzureKeyCredential(creds.key));

var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.use(function (error, req, res, next) {
  if (error instanceof SyntaxError) {
    res.status(400).send("Invalid input. Please check your input syntax.")
  } else {
    next();
  }
});


var syntaxErrorMessage = "Invalid input. Array can only be of type string" 
const validateInput = (input) => {
  for(var i = 0; i < input.length; i++) {
    if(typeof(input[i]) !== "string") return false
  }
  return true
}



/**
 * @swagger
 * /extractEntities:
 *     post:
 *       tags:
 *         - Entity Exctraction
 *       consumes:
 *        - application/json
 *       parameters:
 *        - in: body
 *          name: Input text
 *          description: An array of strings to extract entites from.
 *          schema:
 *            type: array
 *            items:
 *              type: string
 *              example: "I am Jay Bhatt"
 *            minItems: 1
 *       responses:
 *          200:
 *               description: Success, Returns an array of extracted entities
 *          400:
 *               description: Bad request, Returns syntax error
 *          500:
 *               description: Internal server error
 */
  app.post('/extractEntities', urlencodedParser,(req, res) => {
    let docs = req.body;
    console.log(docs)
    console.log(validateInput(docs))
    if(!validateInput(docs)){
      res.status(400).send(syntaxErrorMessage)
    }
    if(docs.length > 0){
      client.analyze("EntityRecognition",docs,"en").then(result => {
        res.send(result);
      }).catch(err => {
        let serverError = new Error()
        serverError.message("Something went wrong :(")
        res.status(500).send(serverError)
      })
    } else {
      res.status(400);
      res.send(syntaxErrorMessage);
    }
    
  })

  /**
 * @swagger
 * /extractPiiEntities:
 *     post:
 *       tags:
 *         - Pii Entity Extraction
 *       consumes:
 *        - application/json
 *       parameters:
 *        - in: body
 *          name: Input text
 *          description: An array of strings to extract Pii entites from.
 *          schema:
 *            type: array
 *            items:
 *              type: string
 *              example: I am Jay Bhatt, my phone number is (123)456-789. My SSN is 1234-567-894.
 *            minItems: 1
 *       responses:
 *          200:
 *               description: Return an array of extracted entities
 *          400:
 *               description: Bad request, Returns sysntax error
 *          500:
 *               description: Internal server error
 */
  app.post('/extractPiiEntities', urlencodedParser,(req, res) => {
    let docs = req.body;
    if(!validateInput(docs)){
      res.status(400).send(syntaxErrorMessage)

    }
    if(docs.length > 0){
      client.analyze("PiiEntityRecognition",docs,"en").then(result => {
        res.send(result);
      }).catch(err => {
        var serverError = new Error()
        serverError.message("Something went wrong :(")
        res.status(500).send(serverError)
      })
    } else {
      res.status(400);
      res.send(syntaxErrorMessage);
    }
    
  })


/**
 * @swagger
 * /recognizeLinkedEntities:
 *     post:
 *       tags:
 *         - Entity Linking
 *       consumes:
 *        - application/json
 *       parameters:
 *        - in: body
 *          name: Input text
 *          description: An array of strings to extract linked entites from.
 *          schema:
 *            type: array
 *            items:
 *              type: string
 *              example: Microsoft moved its headquarters to Bellevue, Washington in January 1979.
 *            minItems: 1
 *       responses:
 *          200:
 *               description: Return an array of extracted entities
 *          400:
 *               description: Bad request, Returns sysntax error
 *          500:
 *               description: Internal server error
 */
  app.post('/recognizeLinkedEntities', urlencodedParser,(req, res) => {
    let docs = req.body;
    if(!validateInput(docs)){
      res.status(400).send(syntaxErrorMessage)

    }
    if(docs.length > 0){
      client.analyze("EntityLinking",docs,"en").then(result => {
        res.send(result);
      }).catch(err => {
        var serverError = new Error()
        serverError.message("Something went wrong :(")
        res.status(500).send(serverError)
      })
    } else {
      res.status(400);
      res.send(syntaxErrorMessage);
    }
    
  })




  app.listen(3000, (req, res) => {
    console.log("App listining on port 3000");
  })