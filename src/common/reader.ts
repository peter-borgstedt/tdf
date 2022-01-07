
import fs from 'fs';
import path from 'path';
import { CHARACTERS } from '../common/constants';

const NAME_LENGTH =              24; // Length: 1
const NAME =                     25; // Length: 0-12
const TYPE =                     41; // Length: 1
const LETTER_SPACING =           42; // Length: 1
const BLOCK_SIZE =               43; // Length: 2
const CHARACTER_OFFSETS =        45; // Length: 188
const CHARACTER_OFFSETS_LENGTH = 188; // Length: 188

interface TDFHeader {
  nameLength: number;
  name: string;
  letterSpacing: number;
  type: number;
  blockSize: number;
  characterOffsets: Uint16Array;
}

class TDFBuffer {
  constructor(private buffer: Buffer, private fontOffset = 0) {}

  public subarray(start: number, length?: number): Buffer {
    return this.buffer.subarray(this.fontOffset + start, length ? (this.fontOffset + start + length) : undefined);
  }

  public readUInt16ArrayLE(start: number, length: number) {
    const b = Buffer.from(this.buffer.subarray(start, start + length));
    return new Uint16Array(b.buffer, b.byteOffset, b.length / 2)
  }

  public readString(start: number, length: number, encoding: BufferEncoding = 'latin1') {
    return this.buffer
      .subarray(this.fontOffset + start, this.fontOffset + start + length)
      .toString(encoding)
      .replace(/\u0000/g, '') // Remove clutter if not all space are used
  }

  public readUInt8(offset = 0): number {
    return this.buffer.readUInt8(0);
  }

  public readUInt16LE(offset = 0): number {
    // Retrieve using little endian
    return this.buffer.readUInt16LE(offset);
  }
}

export class TDFReader {
  private buffer: TDFBuffer;

  constructor(private file: string) {
    const filePath = path.resolve(process.cwd(), this.file);
    console.log(`Reading ${filePath}...`);
    this.buffer = new TDFBuffer(fs.readFileSync(filePath, null));
  }

  public getHeader(): TDFHeader {
    const nameLength = this.buffer.readUInt8(NAME_LENGTH);
    const name = this.buffer.readString(NAME, nameLength ?? 12);
    const letterSpacing = this.buffer.readUInt8(LETTER_SPACING);
    const type = this.buffer.readUInt8(TYPE);
    const blockSize = this.buffer.readUInt16LE(BLOCK_SIZE);
    const characterOffsets = this.buffer.readUInt16ArrayLE(CHARACTER_OFFSETS, 188);

    return {
      nameLength,
      name,
      letterSpacing,
      type,
      blockSize,
      characterOffsets 
    }
  }

  public getData(): Buffer {
    return this.buffer.subarray(233)
  }

  public read(callback: (data: Buffer, header: TDFHeader, offset: number, width: number, height: number, letter: string) => void) {
    const header = this.getHeader();
    const data = this.getData();

    for (let i = 0; i < header.characterOffsets.length; i++) {
      const letter = CHARACTERS[i];
      let offset = header.characterOffsets[i];

      if (offset !== 0xffff) { // Character not defined
        const width = data.readUInt8(offset++);
        const height = data.readUInt8(offset++);

        callback(data, header, offset, width, height, letter);
      } else {
        console.log(`[${letter}]: not defined`)
      }
    }
  }
}