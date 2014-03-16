// module.exports = require('enb/lib/build-flow').create()
//     .name('bemjson-from-bemtree')
//     .target('target', '?.bemjson.js')
//     .useSourceFilename('bemtreeTarget', '?.bemtree.js')
//     .defineOption('argument', {})
//     .defineOption('exportName', 'BEMTREE')
//     .builder(function (bemtreeTarget) {
//         var arg = this.getOption('argument');
//         var bemtree = require(bemtreeTarget);
//         var exportName = this.getOption('exportName');
//         console.log(arg, exportName);

//         return bemtree[exportName].apply(arg).then(toBemjson);
//     })
//     .createTech();

module.exports = require('enb/lib/build-flow').create()
    .name('bemjson-from-bemtree')
    .target('target', '?.bemjson.js')
    .useSourceFilename('bemtreeTarget', '?.bemtree.js')
    .builder(function (bemtreeTarget) {
        var bemtree = require(bemtreeTarget).BEMTREE;

        return bemtree.apply({block: 'app'}).then(toBemjson);
    })
    .createTech();

function toBemjson(data) {
    return '(' + JSON.stringify(data, null, 4) + ')';
}
