export async function streamToString(
  stream: ReadableStreamDefaultReader<Uint8Array>,
): Promise<string> {
  const chunks: Uint8Array[] = [];
  let done = false;
  while (!done) {
    const { value, done: finished } = await stream.read();
    if (value) {
      chunks.push(value);
    }
    done = finished;
  }

  const bodyAsUint8Array = Uint8Array.from(
    chunks.reduce((acc, val) => acc.concat(Array.from(val)), [] as number[]),
  );
  const bodyAsString = new TextDecoder().decode(bodyAsUint8Array);
  return bodyAsString;
}
