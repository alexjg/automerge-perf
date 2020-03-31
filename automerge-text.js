// Apply the paper editing trace to an Automerge.Text object, one char at a time
const { edits, finalText } = require('./editing-trace')
//const AUTOMERGE_PACKAGE_LOCATION = process.env["AUTOMERGE_PACKAGE_LOCATION"]
const AUTOMERGE_PACKAGE_LOCATION = "/home/alex/Projects/open-source/automerge/src/automerge"
const Automerge = require(AUTOMERGE_PACKAGE_LOCATION)
if (process.argv[2] === "wasm"){
    const WASM_PATH = "/home/alex/Projects/automerge-stuff/automerge-rs/automerge-backend-wasm"
    //const WASM_PATH = process.env.WASM_BACKEND_PATH
    if (!WASM_PATH) throw "Undefined WASM_BACKEND_PATH"
    const Backend = require(WASM_PATH)
    Automerge.setDefaultBackend(Backend)
}

const start = new Date()
let state = Automerge.from({text: new Automerge.Text()})

for (let i = 0; i < edits.length; i++) {
  if (i % 1000 === 0) console.log(`Processed ${i} edits in ${new Date() - start} ms`)
  state = Automerge.change(state, doc => {
    if (edits[i][1] > 0) doc.text.deleteAt(edits[i][0], edits[i][1])
    if (edits[i].length > 2) doc.text.insertAt(edits[i][0], ...edits[i].slice(2))
  })
}

if (state.text.join('') !== finalText) {
  throw new RangeError('ERROR: final text did not match expectation')
}
