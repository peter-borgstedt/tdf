const SGR = {
  SET_FOREGROUND_COLOR: 38,
  SET_BACKGROUND_COLOR: 48
}

const hex2rgb = (hex: string): number[] => {
  const [ , r, rr = 0, g, gg = 0, b, bb = 0 ] = hex;
  return [ +`0x${r}${rr}`, +`0x${g}${gg}`, +`0x${b}${bb}` ];
};

export const hex = (hex: string, str: string): string => {
  const [ r, g, b ] = hex2rgb(hex);
  return rgb(r, g, b, str);
};

export const rgb = (...args: [r: number, g: number, b: number, str: string ] | [rgb: [r: number, g: number, b: number], str: string ]): string => {
  if (args.length === 2) {
    const [ [ r, g, b ], str ] = args;
    return `\x1b[38;2;${r};${g};${b}m${str}\x1b[0m`;
  }
  const [ r, g, b, str ] = args;
  return `\x1b[38;2;${r};${g};${b}m${str}\x1b[0m`;
};

export const orange = (str: string): string => {
  //return rgb(255, 226, 138, str);
  return hex('#ffe28a', str);
};

export const red = (str: string): string => {
  return rgb(252, 78, 3, str);
};

export const green = (str: string): string => {
  return rgb(122, 240, 96, str);
};

export const blue = (str: string): string => {
  return rgb(96, 122, 240, str);
};

export const brown = (str: string): string => {
  return rgb(240, 122, 96, str);
};

export const white = (str: string): string => {
  return rgb(255, 255, 255, str);
};

export const darkGrey = (str: string): string => {
  return rgb(128, 128, 128, str);
};

export const grey = (str: string): string => {
  return rgb(192, 192, 192, str);
};

export const black = (str: string): string => {
  return rgb(0, 0, 0, str);
};

interface ColorJSONParams {
  space: number;
  colors: {
    bracket: [r: number, g: number, b: number],
    comma: [r: number, g: number, b: number],
    key: [r: number, g: number, b: number],
    string: [r: number, g: number, b: number],
    number: [r: number, g: number, b: number],
    boolean: [r: number, g: number, b: number],
    null: [r: number, g: number, b: number]
  }
}

export const json = (obj: Record<string, unknown>, params?: ColorJSONParams): string => {
  const {
    space = 2,
    colors = {
      bracket: [ 230, 240, 255 ],
      comma: [ 230, 240, 255 ],
      key: [ 204, 224, 252 ],
      string: [ 245, 245, 205 ],
      number: [ 85, 224, 141 ],
      boolean: [ 111, 164, 252 ],
      null: [ 250, 250, 250 ]
    }
  } = params ?? {};
  const pattern = /^(?<space>\s*)("(?<key>\w+)":\s(?<value>"?.+"?)?,?)?(?<bracket>[{}])?\n?/gm;

  const transform = (v: string) => {
    if (!Number.isNaN(+v)) {
      return rgb(colors.number, v); // Number
    } else if (v?.startsWith('"')) {
      return rgb(colors.string, v.replace('"', '\'')); // String
    } else if (v === 'true' || v === 'false') {
      return rgb(colors.boolean, v); // Boolean
    } else if (v === 'null') {
      return rgb(colors.null, v); // Null
    }
    return '';
  };

  return JSON.stringify(obj, null, space)
    .replace(pattern, (...args) => {
      const { space, bracket, key = '', value } = args.pop();
      return space
        .concat(rgb(colors.key, key))
        .concat(key && rgb(colors.comma, ':') + ' ')
        .concat(value ? `${transform(value)}` : `${rgb(colors.bracket, bracket)}`)
        .concat('\n');
    });
};
/*
console.log(json({
  str: 'hej',
  num: 1,
  obj: {
    hm: 'ok',
    annan: {
      test: true
    }
  }
}));
*/

export const useVGAPalette = (code: number, str: string): string => { // 0-15
  switch(code) {
    case 0: return rgb(0, 0, 0, str);        // #000000 black
    case 1: return rgb(8, 0, 138, str);      // #08008A dark blue (marine)
    case 2: return rgb(0, 135, 0, str);      // #008700 dark green
    case 3: return rgb(0, 135, 133, str);    // #008785 dark cyan
    case 4: return rgb(144, 0, 0, str);      // #900000 dark red
    case 5: return rgb(144, 0, 0, str);      // #910089 dark purple
    case 6: return rgb(122, 124, 0, str);    // #7A7C00 dark yellow
    case 7: return rgb(189, 189, 189, str);  // #BDBDBD gray
    case 8: return rgb(123, 123, 123, str);  // #7B7B7B dark gray
    case 9: return rgb(25, 0, 255, str);     // #1A00FF bright blue
    case 10: return rgb(0, 255, 0, str);     // #00FF00 bright green
    case 11: return rgb(0, 255, 255, str);   // #00FFFF bright cyan
    case 12: return rgb(255, 0, 0, str);     // #FF0000 bright red
    case 13: return rgb(255, 0, 255, str);   // #FF00FF bright purple
    case 14: return rgb(255, 255, 0, str);   // #FEFF00 bright yellow
    case 15: return rgb(255, 255, 255, str); // #FFFFFF white
    default: throw new Error('No color code: ' + code);
  }
}