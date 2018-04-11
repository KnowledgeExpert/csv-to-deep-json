export declare namespace CsvToDeepJson {
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
    function buildObjectsFromCsvString(csv: string, delimiter: string): any[];
    /**
     * Takes an array of string, which are corresponds to rows of csv
     * @param {string[]} csvStringArray
     * @returns {any[]}
     */
    function buildObjectsFromCsv(csvStringArray: string[]): any[];
}
