// Offline preparation from the CC0 recordings cached in .cache/audio-sources.
// No downloaded code is executed. Provenance and processing are emitted with the assets.
import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const sourceDir = '.cache/audio-sources';
const outputDir = 'public/sounds';
const rate = 22050;
const hash = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');

function decode(bytes) {
  if (bytes.toString('ascii', 0, 4) !== 'RIFF' || bytes.toString('ascii', 8, 12) !== 'WAVE') throw Error('Expected WAVE');
  let format, data;
  for (let offset = 12; offset + 8 <= bytes.length;) {
    const id = bytes.toString('ascii', offset, offset + 4);
    const size = bytes.readUInt32LE(offset + 4);
    if (id === 'fmt ') format = { encoding: bytes.readUInt16LE(offset + 8), channels: bytes.readUInt16LE(offset + 10), rate: bytes.readUInt32LE(offset + 12), bits: bytes.readUInt16LE(offset + 22) };
    if (id === 'data') data = bytes.subarray(offset + 8, offset + 8 + size);
    offset += 8 + size + size % 2;
  }
  if (!format || !data || format.encoding !== 1 || format.bits !== 16) throw Error('Expected 16-bit PCM');
  const samples = new Float32Array(data.length / (2 * format.channels));
  for (let i = 0; i < samples.length; i++) {
    for (let channel = 0; channel < format.channels; channel++) samples[i] += data.readInt16LE((i * format.channels + channel) * 2) / (32768 * format.channels);
  }
  return { samples, rate: format.rate };
}

function peakIndex(source, start, end) {
  let peak = Math.floor(start * source.rate);
  for (let i = peak; i < Math.min(source.samples.length, end * source.rate); i++) if (Math.abs(source.samples[i]) > Math.abs(source.samples[peak])) peak = i;
  return peak / source.rate;
}

function encode(source, start, duration, speed = 1) {
  const count = Math.min(Math.floor(duration * rate), Math.floor((source.samples.length / source.rate - start) * rate / speed));
  const values = new Float32Array(count);
  let peak = 0;
  for (let i = 0; i < count; i++) {
    const position = (start + i / rate * speed) * source.rate;
    const lower = Math.floor(position);
    const value = source.samples[lower] * (1 - position + lower) + (source.samples[lower + 1] ?? 0) * (position - lower);
    // 1ms leading and 4ms trailing fades avoid discontinuities.
    const fade = Math.min(1, i / (rate * 0.001), (count - 1 - i) / (rate * 0.004));
    values[i] = value * fade;
    peak = Math.max(peak, Math.abs(values[i]));
  }
  const bytes = Buffer.alloc(44 + count * 2);
  bytes.write('RIFF'); bytes.writeUInt32LE(bytes.length - 8, 4); bytes.write('WAVEfmt ', 8);
  bytes.writeUInt32LE(16, 16); bytes.writeUInt16LE(1, 20); bytes.writeUInt16LE(1, 22);
  bytes.writeUInt32LE(rate, 24); bytes.writeUInt32LE(rate * 2, 28); bytes.writeUInt16LE(2, 32); bytes.writeUInt16LE(16, 34);
  bytes.write('data', 36); bytes.writeUInt32LE(count * 2, 40);
  for (let i = 0; i < count; i++) bytes.writeInt16LE(Math.round(values[i] / Math.max(peak, 0.0001) * 0.65 * 32767), 44 + i * 2);
  return bytes;
}

await fs.mkdir(outputDir, { recursive: true });
const assets = [];
async function save(file, input, source, start, duration, speed = 1) {
  const bytes = encode(source, start, duration, speed);
  await fs.writeFile(`${outputDir}/${file}`, bytes);
  assets.push({ file, input, startSeconds: start, durationSeconds: (bytes.length - 44) / (rate * 2), speed, bytes: bytes.length, sha256: hash(bytes) });
}
const inputs = [];
for (let i = 1; i <= 9; i++) {
  const input = `keypress-${String(i).padStart(3, '0')}.wav`;
  const bytes = await fs.readFile(`${sourceDir}/${input}`);
  inputs.push({ file: input, sha256: hash(bytes) });
  const source = decode(bytes);
  const group = i <= 3 ? 'key' : i <= 6 ? 'space' : 'shift';
  const variant = (i - 1) % 3 + 1;
  const down = peakIndex(source, 0, 0.07);
  const up = peakIndex(source, down + 0.055, 0.23);
  await save(`${group}-down-${variant}.wav`, input, source, Math.max(0, down - 0.003), 0.05);
  await save(`${group}-up-${variant}.wav`, input, source, Math.max(0, up - 0.003), 0.065);
}
for (const [event, input] of [['down', 'middle-click-press.wav'], ['up', 'middle-click-release.wav']]) {
  const bytes = await fs.readFile(`${sourceDir}/${input}`);
  inputs.push({ file: input, sha256: hash(bytes) });
  const source = decode(bytes);
  for (let i = 1; i <= 3; i++) await save(`mouse-${event}-${i}.wav`, input, source, 0, 0.065, [0.94, 1, 1.06][i - 1]);
}
const manifest = {
  licence: 'CC0-1.0', licenceUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
  sources: [
    { author: 'unicaegames', page: 'https://opengameart.org/content/keyboard-soundpack-1-typing-and-single-keystrokes', download: 'https://opengameart.org/sites/default/files/unicae_games_keyboard_soundpack_1.zip', archiveSha256: '96507fc9aeec34cdff0e7c558dabb96afec4156c06532a38d7006b9acdf31f06' },
    { author: 'Isaiah Odhner (1j01)', page: 'https://opengameart.org/content/middle-mouse-click', downloads: ['https://opengameart.org/sites/default/files/middle-click-press.wav', 'https://opengameart.org/sites/default/files/middle-click-release.wav'] },
  ],
  processing: 'Mono 22050Hz 16-bit PCM WAVE; peak normalized to 0.65 with short fades. Key press/release transients selected by peak timing. Space and shift use generic single-key recordings, not identified physical keys. Left/right mouse sounds share middle-button recordings; three variants are resampled derivatives, not separate recorded buttons. Runtime adds small gain/rate jitter. WAVE keeps the whole set small without an encoder dependency.',
  inputs, assets,
};
await fs.writeFile(`${outputDir}/sources.json`, JSON.stringify(manifest, null, 2) + '\n');
await fs.writeFile(`${outputDir}/LICENSE.txt`, 'CC0 1.0 Universal\nhttps://creativecommons.org/publicdomain/zero/1.0/\n\nKeyboard recordings: unicaegames\nMouse recordings: Isaiah Odhner (1j01)\nSee sources.json for author pages, original download links, hashes and processing details.\n');
console.log(`${assets.length} samples; ${assets.reduce((sum, asset) => sum + asset.bytes, 0)} bytes; longest ${Math.max(...assets.map(asset => asset.durationSeconds))} seconds`);
