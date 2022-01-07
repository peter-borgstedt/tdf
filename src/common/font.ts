import { useVGAPalette } from "../utils/colors";
import { decode } from "./encoding";
import { Char as AllowedChar, FontType } from "./types";

export class Char {
  constructor(public code: number, public fg: number, public bg: number) {}
}

export class Character {
  constructor(public readonly width: number, public readonly height: number, public readonly lines: Char[][] = []) {}

  public renderLine(index: number): string {
    let str = '';

    const line = this.lines[index];
    if (line) {
      for (let i = 0; i < this.width; i++) {
        if (line[i]) {
          const char = decode(line[i].code);
          if (char) {
            str += useVGAPalette(line[i].fg, char);
          }
        } else {
          str += ' '; // Need to add this explicitely as using ANSI will give wrong lengt if String.padEnd would be used
        }
      }
    }
    return str;
  }
}

export class Font {
  private name: string = '';
  private type: FontType = FontType.COLOR;
  public letterSpacing: number = -1;
  public width: number = -1;
  public height: number = -1;
  public characters: Record<string, Character> = {};

  public render(text: string) {
    const textLines = text.split('\n');
    for (const textLine of textLines) {
      for (let i = 0; i < this.height; i++) {
        for (let c of textLine) {
          switch (c) {
            case ' ': process.stdout.write(''.padEnd(this.width / 2)); break;
            default: 
              const character = this.characters[c];
              const line = character?.renderLine(i)?.concat(' ');
              if (line) {
                process.stdout.write(line);
              }
              break;
          }
        }
        process.stdout.write('\n');
      }
    }
  }
}
