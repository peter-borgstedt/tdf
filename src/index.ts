import { useVGAPalette } from './utils/colors';
import { decode } from './common/encoding';
import { TDFReader } from './common/reader';
import { Char, Character, Font } from './common/font';

const read = (file: string) => {
  const reader = new TDFReader(file);

  const font = new Font();

  reader.read((data, header, offset, width, height, letter) => {
    // console.log(`== START [${letter}]: { w: ${width}, h: ${height}, offset: ${offset} } `.padEnd(48, '='))

    font.letterSpacing = header.letterSpacing;

    if (height > font.height) {
      font.height = height;
    }

    if (width > font.width) {
      font.width = width;
    }


    const lines: Char[][] = [];
    let line: Char[] = [];
    while (true) {
      const charByte = data[offset++]
      if (charByte === 0) {
        lines.push(line);
        break; // End of character
      }

      if (charByte === 0x0D) { // Carriage return
        // Does not have any color byte
        // process.stdout.write('\n');
        lines.push(line);
        line = [];
        continue;
      }

      const char = decode(charByte);
      if (!char) {
        // Unsupported character
        continue;
      }

      const color = data[offset++];
      const bg = Math.floor(color / 16);
      const fg = color % 16;
      // const rendered = `\x1b[38;5;${fg}m${char}\x1b[0m`;
      // console.log(bg, fg);

      if (char) {
        // process.stdout.write(useVGAPalette(fg, char));
        line.push(new Char(charByte, fg, bg));
      }
    }
    font.characters[letter] = new Character(width, height, lines);
    // console.log(`== END [${letter}] `.padEnd(48, '=') + '\n')
  });

  font.render('Carmen och\nAlicia!');
}

read('fonts/colossal.tdf');
