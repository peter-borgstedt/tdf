import { Char } from "./types";

export const HEADER_OFFSETS = {
  NAME_LENGTH: 24,    // Length: 1
  NAME: 25,           // Length: 0-12
  TYPE: 41,           // Length: 1
  LETTER_SPACING: 42, // Length: 1
  BLOCK_SIZE: 43      // Length: 2
}

export const CHARACTERS: Char[] = '!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~' as unknown as Char[];
