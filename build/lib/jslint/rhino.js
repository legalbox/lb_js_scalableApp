// rhino.js
// 2009-09-11
/*
Copyright (c) 2002 Douglas Crockford  (www.JSLint.com) Rhino Edition
*/

// Modifications by Eric Bréchemier <legalbox@eric.brechemier.name>
// Copyright Legal-Box SAS (c) 2010-2011, All Rights Reserved
// Licensed under a BSD License http://creativecommons.org/licenses/BSD/
//
// 2011-04-22: added encoding 'utf-8' as second argument to readFile.
// All our files are in UTF-8. The encoding may be specified as a command-line
// argument and default to UTF-8 instead. We encountered some issues running
// this script on files which contained Japanese characters in comments on
// Cygwin and Git Bash () on Windows: "Unsafe character", which was not
// reported by JSLint when checking the same file from bash on Debian.

// This is the Rhino companion to fulljslint.js.

/*global JSLINT */
/*jslint rhino: true, strict: false */

(function (a) {
    var e, i, input, encoding;
    if (!a[0]) {
        print("Usage: jslint.js file.js");
        quit(1);
    }
    encoding = 'utf-8'; // TODO: optionally initialize from command-line arg
    input = readFile(a[0],encoding);
    if (!input) {
        print("jslint: Couldn't open file '" + a[0] + "'.");
        quit(1);
    }
    if (!JSLINT(input, {bitwise: true, eqeqeq: true, immed: true,
            newcap: true, nomen: true, onevar: true, plusplus: true,
            regexp: true, rhino: true, undef: true, white: true})) {
        for (i = 0; i < JSLINT.errors.length; i += 1) {
            e = JSLINT.errors[i];
            if (e) {
                print('Lint at line ' + e.line + ' character ' +
                        e.character + ': ' + e.reason);
                print((e.evidence || '').
                        replace(/^\s*(\S*(\s+\S+)*)\s*$/, "$1"));
                print('');
            }
        }
        quit(2);
    } else {
        print("jslint: No problems found in " + a[0]);
        quit();
    }
}(arguments));
