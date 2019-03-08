
const loadedChunks = new Set();

const _computeDeps = (chunk, chunkDeps) => {
    if (chunkDeps.hasOwnProperty(chunk)) {
        return chunkDeps[chunk].reduce((acc, dep) => acc.concat(_computeDeps(dep, chunkDeps)), [chunk]);
    } else {
        return [chunk];
    }
};

// Return an array of chunks that depend on `chunk` including `chunk` itself.
const computeDeps = (chunk, chunkDeps) => {
    const deps = new Set();

    const _computeDeps = (chunk) => {
        if (deps.has(chunk)) {
            return;
        } else {
            deps.add(chunk);
            chunkDeps[chunk].forEach(_computeDeps);
        }
    };

    _computeDeps(chunk)

    return [...deps];
}

const _createLoadModuleFn = (chunkMap, chunkDeps) =>
    (moduleId) => new Promise((resolve, reject) => {
        if (!chunkMap.hasOwnProperty(moduleId)) {
            reject(`${moduleId} not found`);
        }

        const chunkId = chunkMap[moduleId];
        const unloadedChunks = computeDeps(chunkId, chunkDeps).filter(chunk => !loadedChunks.has(chunk));

        Promise.all(unloadedChunks.map(__webpack_chunk_load__)).then(() => {
            for (const chunk of unloadedChunks) {
                loadedChunks.add(chunk);
            }
            resolve(__webpack_require__(moduleId));
        })
    });

// Return a function that can be used to load modules from webpack bundles.
// `moduleChunkDepsJsonPath` should point to a .json file generated by
// ModuleChunkDepsPlugin.
const createLoadModuleFn = (moduleChunkDepsJsonPath) => 
    fetch(moduleChunkDepsJsonPath)
        .then(res => res.json())
        .then(({chunkMap, chunkDeps}) => _createLoadModuleFn(chunkMap, chunkDeps));

export {createLoadModuleFn};
