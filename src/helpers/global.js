export default {
    QueryExceptionErrors(errs){
        let excp = [];
        for (var key in errs) {
            if (!errs.hasOwnProperty(key)) continue;
            var obj = errs[key];
            for (var prop in obj) {
                if (!obj.hasOwnProperty(prop)) continue;
                excp.push(obj[prop])
            }
        }
        return excp;
    },

    groupBy(array, key){
        const result = {}
        array.forEach(item => {
            if (!result[item[key]]){
                result[item[key]] = []
            }
            result[item[key]].push(item)
        })
        return result
    }
}