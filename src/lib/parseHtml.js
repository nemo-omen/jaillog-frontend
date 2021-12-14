import { titleCase } from 'title-case';
import { wpTemplate } from './template.js'; 



export async function parseHtml(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const divs = Array.from(doc.querySelectorAll('div'));

  const myDivs = divs.filter((div) => div.classList.contains('x_data-item'));

  const links = Array.from(document.querySelectorAll('a'));

  const count = divs.filter((div) => div.classList.contains('x_image-div')).length;

  /* REGEX */
  const digitRegex = /\d{8}/;

  const digitSpaceRegex = /\d{8}\s/;

  const whitespaceRegex = /\s{2,8}/;

  /* VARS */

  // store the charges, with the charge description
  // as the key, and the occurrence as a value
  const charges = new Map();

  let lines = [];

  // keep reserved string groupings in a set
  // so we can protect them from transformations
  // and make sure we're not storing multiples
  // of the same value
  const reserved = new Set();

  // remove all links from raw html before starting
  links.forEach((link) => {
    link.parentNode.removeChild(link);
  });

  // start breaking down raw html into a list of charges
  // this is pretty much just a long chain of array methods
  const vals = myDivs
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

  // generate the template
  const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
  const date = new Date();
  const d = date.getDate();
  const m = date.getMonth();
  const y = date.getFullYear();
  const dow = date.getDay();
  const tp = dow === 1 ? 72 : 24;
  const serialized = new XMLSerializer().serializeToString(doc.body);
  console.log(serialized);
  const perma = `https://conchovalleyhomepage.com/crime/jail-logs/jail-logs/jail-logs-${months[m]}-${d}-${y}`;
  const template = wpTemplate(tp, count, perma, lines, serialized);

  return template;
// return doc;
}