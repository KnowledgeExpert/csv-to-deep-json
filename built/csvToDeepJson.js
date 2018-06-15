"use strict";
// Copyright 2018 Knowledge Expert SA
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", { value: true });
var CsvToDeepJson;
(function (CsvToDeepJson) {
    /**
     * Takes a string and delimiter, which are corresponds to rows of csv separated by delimiter
     * types supported:
     * `BOOLEAN` - if add after column name, data from that column will be transformed to boolean value automatically
     * `NUMBER` - if add after column name, data from that column will be transformed to number value automatically
     * `ARRAY` - if add after column name, data from that column will be transformed to `string` array value automatically
     * to add use pattern `[DELIMITER]` - where delimiter is char which you use to separate values
     * examples:
     * `[:]`
     * `[,]`
     * `[:]`
     * `[;]`
     * `[ ]`
     * `STRING` - if add after column name, or don't add anything, data from that column will be transformed to string value automatically
     * @param {string} csv
     * @param {string} delimiter
     * @returns {any[]}
     */
    function buildObjectsFromCsvString(csv, delimiter) {
        return build(csv.split(delimiter).filter(item => item.length !== 0));
    }
    CsvToDeepJson.buildObjectsFromCsvString = buildObjectsFromCsvString;
    /**
     * Takes an array of string, which are corresponds to rows of csv
     * @param {string[]} csvStringArray
     * @returns {any[]}
     */
    function buildObjectsFromCsv(csvStringArray) {
        return build(csvStringArray);
    }
    CsvToDeepJson.buildObjectsFromCsv = buildObjectsFromCsv;
    function build(csvStringArray) {
        const result = [];
        const cellInfos = csvStringArray[0].match(/(([\w\.]+)(\s\[.\])|([\w\.]+)(\s\w+)|([\w\.]+))/g).map(item => {
            const parts = toPathAndType(item);
            const path = parts[0];
            const typeStr = parts[1];
            const type = typeStr === 'STRING' || typeStr === null ? PrimitiveType.STRING
                : typeStr === 'NUMBER' ? PrimitiveType.NUMBER
                    : typeStr === 'BOOLEAN' ? PrimitiveType.BOOLEAN
                        : PrimitiveType.STRING_ARRAY;
            const arrSeparator = type === PrimitiveType.STRING_ARRAY ? typeStr.match(/\[(.)\]/)[1] : null;
            return {
                path: path,
                type: type,
                arrSeparator: arrSeparator
            };
        });
        for (let i = 1; i < csvStringArray.length; i++) {
            const newObject = {};
            // TODO make a better regex to avoid manual work
            // current: 'abc,,"[q,w,e]"'.match(...) => [ 'abc,', ',', '"[q,w,e]"', '' ] ----- extra 'empty' item at the end
            const currentRow = csvStringArray[i].match(/(("[^"]+")|([^,]+)|()),?/g)
                .map(item => item.replace(/,$/g, '')) // remove comma at the end
                .map(item => item.length === 0 ? null : item); // change empty strings to null's
            currentRow.length = currentRow.length - 1; // remove last element - extra 'empty' element
            for (let j = 0; j < currentRow.length; j++) {
                const currentCellInfo = cellInfos[j];
                const currentRawValue = currentRow[j];
                setDeep(newObject, currentCellInfo.path, currentCellInfo.type === PrimitiveType.BOOLEAN ? parseBoolean(currentRawValue)
                    : currentCellInfo.type === PrimitiveType.NUMBER ? parseNumber(currentRawValue)
                        : currentCellInfo.type === PrimitiveType.STRING_ARRAY ? parseArray(currentRawValue, currentCellInfo.arrSeparator)
                            : currentRawValue);
            }
            result.push(newObject);
        }
        return result;
    }
    function setDeep(baseObject, path, val) {
        let pointer = baseObject;
        const parts = path.split(".");
        for (let i = 0; i < parts.length - 1; i++) {
            pointer[parts[i]] = pointer[parts[i]] || {};
            pointer = pointer[parts[i]];
        }
        pointer[parts[parts.length - 1]] = val;
    }
    function parseNumber(str) {
        if (!str)
            return null;
        let result = 0;
        for (let i = str.length - 1, j = 1; i >= 0; i--, j *= 10) {
            result += j * Number(str.charAt(i));
        }
        return result;
    }
    function parseBoolean(str) {
        if (!str)
            return null;
        return str.toUpperCase() === 'TRUE';
    }
    function parseArray(str, separator) {
        if (!str)
            return null;
        const index = (str.includes(separator) && separator === ',') ? 1 : 0; // xlsx lib wraps a string with commas in double quotes, to save csv structure
        return str.substring(index, str.length - index).split(separator);
    }
    function toPathAndType(raw) {
        for (let i = 0; i < raw.length; i++) {
            if (raw[i] === ' ') {
                return [raw.substring(0, i), raw.substring(i + 1, raw.length)];
            }
        }
        return [raw, null];
    }
    // TODO add CustomDate
    let PrimitiveType;
    (function (PrimitiveType) {
        PrimitiveType[PrimitiveType["STRING"] = 0] = "STRING";
        PrimitiveType[PrimitiveType["NUMBER"] = 1] = "NUMBER";
        PrimitiveType[PrimitiveType["BOOLEAN"] = 2] = "BOOLEAN";
        PrimitiveType[PrimitiveType["STRING_ARRAY"] = 3] = "STRING_ARRAY"; // TODO handle ARRAY'' of any PrimitiveType
    })(PrimitiveType || (PrimitiveType = {}));
})(CsvToDeepJson = exports.CsvToDeepJson || (exports.CsvToDeepJson = {}));
//# sourceMappingURL=csvToDeepJson.js.map