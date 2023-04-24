
/**
 * WHATWG ReadableStream <-> Node stream.Readable
 * @author SourceBoy
 * @license MIT
 */

/**
 * WHATWG ReadableStream to Node stream.Readable
 * @param {ReadableStream} rs
 * @returns {stream.Readable}
 */

function toNodeStream(rs) {
  const reader = rs.getReader(); // ReadableStreamDefaultReader
  const _rs = new Readable({ // stream.Readable
    read(size) {}
  });

  (function _toNodeReadableStream() {
    return reader.read().then(({ done, value }) => {
      if (done) {
        _rs.push(null);
        return _rs;
      } else {
        _rs.push(value);
        return _toNodeReadableStream();
      }
    });
  })();

  return _rs;
}

/**
 * Node stream.Readable to WHATWG ReadableStream
 * @param {stream.Readable} rs
 * @returns {ReadableStream}
 */
function toWebStream(rs) {
  const queuingStrategy = new ByteLengthQueuingStrategy({
    highWaterMark: 16384 // Match Node stream.Readable default
  });

  const start = (controller) => {
    rs.once('end', () => {
      controller.close();
    }).once('error', (e) => {
      controller.error(e);
    }).on('data', (chunk) => {
      controller.enqueue(chunk);
    });
  };

  return new ReadableStream({
    type: 'bytes',
    queuingStrategy,
    start
  });
}

export {
  toNodeStream,
  toWebStream
}