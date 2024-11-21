const { FileReader } = require('./FileReader')

// FileReader argumnets ( relative_file_path, encoding - optional, bytes_per_chunk_for_reader - optional )

const f = new FileReader(typeof process.argv[2] === 'string' ? process.argv[2] : './files.txt');
f.printCountedSymbols();
