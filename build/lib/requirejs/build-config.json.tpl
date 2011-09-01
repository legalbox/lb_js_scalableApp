/*
 * File: build-config.json.tpl
 * Template for the configuration of requireJS build process to
 * combine all scripts into a single script based on dependencies.
 *
 * The parameter names, between # signs, are replaced with actual values
 * to generate the build-config.json file in out/config folder by running
 * the Ant build process.
 *
 * The combined script is not minified at this step; it may be used in place
 * of the minified version for debugging purpose.
 *
 * Author:
 * Eric Bréchemier <contact@legalbox.com>
 *
 * Copyright:
 * Legalbox SA (c) 2010-2011, All Rights Reserved
 *
 * License:
 * BSD License
 * http://creativecommons.org/licenses/BSD/
 *
 * Version:
 * 2011-07-07
 */
({
    // output file, absolute or relative to the location of this file
    out: "#out.file#",

    // only combine files, do not minify at this step
    optimize: "none",

    // base directory for the resolution of relative paths of modules;
    // absolute or relative to the location of this file
    baseUrl: "#src.dir#",

    // list of all the JavaScript modules to combine, with an absolute path or
    // a path relative to the baseUrl, without .js extension
    include: #modules.array#
})
