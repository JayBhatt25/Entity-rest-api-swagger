
# Entity API Documentation
This API leverages Azure's Cognitive Service API to provide you with ability to do the following 3 things: -

* Extract Entities - Extract entities such as a person's name, place, organization, quantity and more from input array of texts.
* Extract Pii Entities - Extract Personally Identifiable Information(PII) from text such as Social Security Number, Bank information, credit card numbers, etc.
* Entity Linking - Identify objects that matches an entry from the knowledge base and extract information such as data source, URL from the input text.

Try it out using [Swagger Playground](http://165.227.85.238:3000/docs/#/)




## Extract Entities

- Base URL
```http
http://165.227.85.238:3000
```
- Endpoint - Append this at the end of base url

```http
/extractEntities
```
- Method = **POST**

- Parameter Type = **JSON**

- Input Type = Array[string]

#### Try it out using this example

```
["Redmond is a city in King County, Washington, United States, located 15 miles east of Seattle."]
```

#### Results will look like

```no-copy
[
    {
        "id": "0",
        "warnings": [],
        "entities": [
            {
                "text": "Redmond",
                "category": "Location",
                "subCategory": "GPE",
                "offset": 0,
                "length": 7,
                "confidenceScore": 0.98
            },
            {
                "text": "King County",
                "category": "Location",
                "subCategory": "GPE",
                "offset": 21,
                "length": 11,
                "confidenceScore": 0.99
            },
            {
                "text": "Washington",
                "category": "Location",
                "subCategory": "GPE",
                "offset": 34,
                "length": 10,
                "confidenceScore": 0.66
            },
            {
                "text": "United States",
                "category": "Location",
                "subCategory": "GPE",
                "offset": 46,
                "length": 13,
                "confidenceScore": 0.76
            },
            {
                "text": "15 miles",
                "category": "Quantity",
                "subCategory": "Dimension",
                "offset": 69,
                "length": 8,
                "confidenceScore": 0.8
            },
            {
                "text": "Seattle",
                "category": "Location",
                "subCategory": "GPE",
                "offset": 86,
                "length": 7,
                "confidenceScore": 1
            }
        ]
    }
]
```
#### Response codes

- 200 = Success
- 400 = Return syntax error if input array is empty or its content is not of type string.
- 500 = Internal server error.

## Extract PII Entities

- Base URL
```http
http://165.227.85.238:3000
```
- Endpoint - Append this at the end of base url

```http
/extractPiiEntities
```
- Method = **POST**

- Parameter Type = **JSON**

- Input Type = Array[string]

#### Try it out using this example

```
["The employee's SSN is 555-55-5555."]
```

#### Results will look like

```
[
    {
        "id": "0",
        "warnings": [],
        "redactedText": "The ********'s SSN is 555-55-5555.",
        "entities": [
            {
                "text": "employee",
                "category": "PersonType",
                "offset": 4,
                "length": 8,
                "confidenceScore": 0.97
            }
        ]
    }
]
```
#### Response codes

- 200 = Success
- 400 = Return syntax error if input array is empty or its content is not of type string.
- 500 = Internal server error.

## Entity Linking

- Base URL
```http
http://165.227.85.238:3000
```
- Endpoint - Append this at the end of base url

```http
/recognizeLinkedEntities
```
- Method = **POST**

- Parameter Type = **JSON**

- Input Type = Array[string]

#### Try it out using this example

```
["Microsoft was founded by Bill Gates and Paul Allen."]
```

#### Results will look like

```
[
    {
        "id": "0",
        "warnings": [],
        "entities": [
            {
                "name": "Microsoft",
                "matches": [
                    {
                        "confidenceScore": 0.49,
                        "text": "Microsoft",
                        "offset": 0,
                        "length": 9
                    }
                ],
                "language": "en",
                "dataSourceEntityId": "Microsoft",
                "url": "https://en.wikipedia.org/wiki/Microsoft",
                "dataSource": "Wikipedia",
                "bingEntitySearchApiId": "a093e9b9-90f5-a3d5-c4b8-5855e1b01f85"
            },
            {
                "name": "Bill Gates",
                "matches": [
                    {
                        "confidenceScore": 0.52,
                        "text": "Bill Gates",
                        "offset": 25,
                        "length": 10
                    }
                ],
                "language": "en",
                "dataSourceEntityId": "Bill Gates",
                "url": "https://en.wikipedia.org/wiki/Bill_Gates",
                "dataSource": "Wikipedia",
                "bingEntitySearchApiId": "0d47c987-0042-5576-15e8-97af601614fa"
            },
            {
                "name": "Paul Allen",
                "matches": [
                    {
                        "confidenceScore": 0.54,
                        "text": "Paul Allen",
                        "offset": 40,
                        "length": 10
                    }
                ],
                "language": "en",
                "dataSourceEntityId": "Paul Allen",
                "url": "https://en.wikipedia.org/wiki/Paul_Allen",
                "dataSource": "Wikipedia",
                "bingEntitySearchApiId": "df2c4376-9923-6a54-893f-2ee5a5badbc7"
            }
        ]
    }
]
```
#### Response codes

- 200 = Success
- 400 = Return syntax error if input array is empty or its content is not of type string.
- 500 = Internal server error.


