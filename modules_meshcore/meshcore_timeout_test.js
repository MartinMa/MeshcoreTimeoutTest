/** 
* @description Meshcore setTimeout Test
* @author Martin Mädler
* @copyright 
* @license Apache-2.0
*/

"use strict";

const DEBUG_FLAG = true;

var timeoutId = null;

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
    if (timeoutId) {
        logToFile('timeoutId: ' + timeoutId);
        clearTimeout(timeoutId);
        timeoutId = null;
    }
    logToFile('Before setTimeout');
    timeoutId = setTimeout(
        function (a) {
            // First, reset timeout id
            timeoutId = null;
            testTimeout(a);
        },
        30 * 1000, // One minute
        mesh
    );
    logToFile('End of startTimer');
}

function testTimeout(mesh) {
    logToFile('Entered testTimeout function');
    try {
        logToFile('beforeFoo');
        var foo = {
            success: 'yes'
        };
        logToFile('beforeFoo LOG');
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
