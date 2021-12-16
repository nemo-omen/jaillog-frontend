import { titleCase } from 'title-case';

export function groupCharges(divArray) {
  const charges = new Map();
  const reserved = new Set();
  const digitRegex = /\d{8}/;
  const digitSpaceRegex = /\d{8}\s/;
  const whitespaceRegex = /\s{2,8}/;
  let lines = [];

  const vals = divArray
    .map((div) => div.innerHTML)
    .filter((val) => val !== 'No Bond')
    .filter((val) => val[0] !== '$')
    .filter((val) => val.length !== 6)
    .filter((val) => val.match(/(\d{1,4}([.\-/])\d{1,2}([.\-/])\d{1,4})/g) === null)
    .map((val) => val.split('<br aria-hidden="true">'))
    .flat()
    .map((val) => {
      const first = val.split(' ')[0];
      const remaining = val
        .split(' ')
        .slice(1)
        .join(' ');

      if(first.match(digitRegex)) {
        return remaining;
      }
      
      return val;
    })
    .map((val) => {
      return val
        .replace('\n', '')
        .replace(whitespaceRegex, ' ')
        .replace('&gt;', '>')
        .replace('&lt;', '<');
    })
    .map((val) => {
      if(val.match(/\*\S{2,}\*[a-zA-Z]/)) {
        const match = val.match(/\*\S{2,}\*/);
        reserved.add(match[0]);
        return val.replace(match, match + ' ');
      } else if(/\*\S{2,}\*\s/) {
        const match = val.match(/\*\S{2,}\*/);
        if(match) reserved.add(match[0]);
        return val;
      } else {
        return val;
      }
    })
    .map((val) => {
      return val
        .split(' ')
        .map((word) => {
          if(!reserved.has(word)) {
            return word.toLowerCase();
          } else {
            return word;
          };
        })
        .join(' ')
    })
    .map((val) => titleCase(val));

    // add individual charges to a Map
    // if charge already exists in map, increment
    // its value by 1
    for(const val of vals) {
      if(!charges.has(val)) {
        charges.set(val, 1);
      } else {
        charges.set(val, charges.get(val) + 1);
      }
    }

    for(let [key, value] of charges.entries()) {
      lines.push(`${key}: ${value}`);
    }

    // sort alphabetically
    lines = lines
      .sort((a,b) => a < b ? -1 : a > b ? 1 : 0);

    return lines;
}