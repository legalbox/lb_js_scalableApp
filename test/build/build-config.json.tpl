({
    // output file, absolute or relative to the location of this file
    out: "#out.file#",

    // only combine files, do not minify at this step
    optimize: "none",

    // base directory for the resolution of relative paths
    // absolute or relative to the location of this file
    baseUrl: "#src.dir#",

    // list of all the JavaScript modules in source directory
    // relative to the baseUrl, without .js extension
    include: #modules.array#
})
