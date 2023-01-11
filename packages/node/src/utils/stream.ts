async function streamToString(
  stream: ReadableStreamDefaultReader<Uint8Array>
): Promise<string> {
  const chunks: Uint8Array[] = [];
  while (true) {
    const { value, done } = await stream.read();
    if (done) {
      break;
    }
    if (value) {
      if (chunks.length > 512) {
        return decodeChunks(chunks);
      }
      chunks.push(value);
    }
  }
  return decodeChunks(chunks);
}

const decodeChunks = (chunks: Uint8Array[]) => {
  return new TextDecoder("utf-8").decode(Buffer.concat(chunks));
};
