const path = require('path');
const fs = require('fs');

class FileReader {

  filePath;
  readingStream;
  fileEncoding = 'utf-8';
  highWaterMark = 1024;
  totalSymbols = 0;
  symbolsCount = new Map();

  constructor(filePath, fileEncoding, highWaterMark) {
    this.filePath = path.join(__dirname, filePath);
    this.fileEncoding = fileEncoding ? fileEncoding : this.fileEncoding;
    this.highWaterMark = highWaterMark ? highWaterMark : this.highWaterMark;
  }

  closeOnError() {

    this.stream.close()
    this.stream = null;

  }

  countSymbols() {

    if (this.stream) this.stream.close();
    
    this.stream = fs.createReadStream(
      this.filePath,
      {
        encoding: this.fileEncoding,
        highWaterMark: this.readingHighWaterMark,
      }
    );

    this.stream.on('error', e => {

      console.log('Error has occurred!');
      console.log(e.message);
      this.closeOnError();

    })

    this.stream.on('data', chunk => {

      console.log(`Handled ${this.stream.bytesRead} bytes...`);

      for (const symbol of chunk) {
        if (/[\b\f\n\r\t\v\a]/gm.test(symbol)) continue;
        else if (this.symbolsCount[symbol]) this.symbolsCount[symbol]++;
        else this.symbolsCount[symbol] = 1;
        this.totalSymbols++;
      }
    
    });

  }

  printCountedSymbols() {

    if (!this.stream || this.stream.closed) this.countSymbols();

    this.stream.on('close', () => {

      const sortedSymbolsCount = Object.entries(this.symbolsCount).sort()
      sortedSymbolsCount.forEach(value => {
        const symbolsPrecentage = Math.round(value[1] / (this.totalSymbols / 100) * 100) / 100
        console.log(`${value[0]} — ${symbolsPrecentage}%`)
      })
    
    })

  }

}

module.exports = { FileReader }