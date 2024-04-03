/** 
* @description Meshcore setTimeout Test
* @author Martin Mädler
* @copyright 
* @license Apache-2.0
*/

"use strict";

const DEBUG_FLAG = true;

var intervalTimer = null;

function logToFile(message) {
    if (!DEBUG_FLAG) {
        return;
    }

    const fs = require('fs');
    const logStream = fs.createWriteStream('meshcore_timeout_test.txt', {'flags': 'a'});
    logStream.write('\r\n' + new Date().toLocaleString() + ': ' + message);
    logStream.end('\r\n');
}

function startTimer(mesh) {
    logToFile('Entered startTimer function');
    // NOTE Duktape does not support setTimeout and setInterval.
    // MeshAgent provides custom polyfills though.
    clearTimeout(intervalTimer);
    intervalTimer = setTimeout(
        function (a) {
            testTimeout(a);
        },
        60 * 1000, // One minute
        mesh
    );
}

function testTimeout(mesh) {
    logToFile('Entered testTimeout function');
    try {
        foo = {
            success: 'yes',
        };
        logToFile('Foo: ' + JSON.stringify(foo));
        // Trigger timer to perform custom actions.
        startTimer(mesh);
    } catch (error) {
        // An error occured
        logToFile('Error: ' + JSON.stringify(error));
    }
}

function consoleaction(args, _rights, _sessionid, parent) {
    if (typeof args['_'] == 'undefined') {
        args['_'] = [];
        args['_'][1] = args.pluginaction;
        args['_'][2] = null;
        args['_'][3] = null;
        args['_'][4] = null;
    }
    
    const actionName = args['_'][1];
    const mesh = parent;
    
    switch (actionName) {
        case 'testTimeout': {
            testTimeout(mesh);
            break;
        }
        default:
            logToFile('Unknown action: ' + actionName + ' with data ' + JSON.stringify(args));
        break;
    }
}

module.exports = { consoleaction : consoleaction };
