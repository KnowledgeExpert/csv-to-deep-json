# csv-to-deep-json

Transforms csv-string to 'deep' js object structure.

## Documentation

```
// if you have an array of comma-separated-strings you can just pass that array
export function buildObjectsFromCsv(csvStringArray: string[]): any[]

// if you have all data in single string (f.e. if you read it from a file)
// you can pass that single string and specify delimiter, and lib split that string for you
export function buildObjectsFromCsvString(csv: string, delimiter: string): any[];
```

## Example

*  Given excel table:

| name | dob.year NUMBER | dob.month NUMBER | dob.days NUMBER | friends \[,] | isAlive BOOLEAN | moneyHave STRING |
|:----:|:---------------:| ----------------:|:---------------:|:------------:|:---------------:|:----------------:|
| Ivan | 1993            | 1                | 3               | Kolya,Marina | TRUE            | 200 USD          |
| Piter| 1857            | 5                | 26              |              | FALSE           | 0 USD            |
| Kolya| 2004            | 11               | 7               | Ivan,Marina  | TRUE            | 1000 UAH         |

* transformed to csv via `xlsx` library:
```csv
name,dob.year NUMBER,dob.month NUMBER,dob.days NUMBER,"friends [,]",isAlive BOOLEAN,moneyHave STRING\nIvan,1993,1,3,"Kolya,Marina",TRUE,200 USD\nPiter,1857,5,26,,FALSE,0 USD\nKolya,2004,11,7,"Ivan,Marina",TRUE,1000 UAH
```
* or if split by `\n`:
```csv
name,dob.year NUMBER,dob.month NUMBER,dob.days NUMBER,"friends [,]",isAlive BOOLEAN,moneyHave STRING
Ivan,1993,1,3,"Kolya,Marina",TRUE,200 USD
Piter,1857,5,26,,FALSE,0 USD
Kolya,2004,11,7,"Ivan,Marina",TRUE,1000 UAH
```

* use lib to convert that csv data to json:
```
const csvStrings: string[] = [...];
const csv_to_json = require("csv-to-deep-json");
const data: any[] = csv_to_json.buildObjectsFromCsv(csvStrings);
console.log(JSON.stringify(data));
```

* output:
     ```json
     [
       {
         "name": "Ivan",
         "dob": {
           "year": 1993,
           "month": 1,
           "days": 3
         },
         "friends": [
           "Kolya",
           "Marina"
         ],
         "isAlive": true,
         "moneyHave": "200 USD"
        },
        {
         "name": "Piter",
         "dob": {
           "year": 1857,
           "month": 5,
           "days": 26
         },
         "friends": null,
         "isAlive": false,
         "moneyHave": "0 USD"
       },
       {
         "name": "Kolya",
         "dob": {
           "year": 2004,
           "month": 11,
           "days": 7
         },
         "friends": [
           "Ivan",
           "Marina"
         ],
         "isAlive": true,
         "moneyHave": "1000 UAH"
       }
     ]
     ```