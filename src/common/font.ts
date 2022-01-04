import { Char, FontType } from "./types";



class Character {
  private lines: string[] = [];

  public getLine(index: number) {
    return this.lines[index];
  }
}

class Font {
  private name: string;
  private type: FontType;
  private width: number;
  private height: number;
  private characters: Record<Char, Character>;
}
