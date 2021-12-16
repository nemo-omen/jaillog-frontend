import { wpTemplate } from './template.js'; 
import { groupCharges } from './groupCharges.js';

export async function parseHtml(html) {
  const parser = new DOMParser();
  let doc = parser.parseFromString(html, 'text/html');
  
  doc = stripLinks(doc);
  doc = stripHeader(doc);
  doc = stripBookedHeader(doc);
  doc = removeAfterReleased(doc);
  const count = getCount(doc);
  
  const myDivs = Array.from(doc.querySelectorAll('.x_data-item'));
  const lines = groupCharges(myDivs);

  const template = generateTemplate(count, lines, doc);

  return template;
}

function generateTemplate(count, lines, doc) {
  const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
  const date = new Date();
  const d = date.getDate();
  const m = date.getMonth();
  const y = date.getFullYear();
  const dow = date.getDay();
  const tp = dow === 1 ? 72 : 24;
  const perma = `https://conchovalleyhomepage.com/crime/jail-logs/jail-logs/jail-logs-${months[m]}-${d}-${y}`;

  const serialized = new XMLSerializer().serializeToString(doc.body);
  
  const template = wpTemplate(tp, count, perma, lines, serialized);
  return template;
}

function stripLinks(doc) {
  const links = Array.from(doc.querySelectorAll('a'));
  // remove all links from raw html before starting
  links.forEach((link) => {
    link.parentNode.removeChild(link);
  });

  return doc;
}

function stripHeader(doc) {
  const headerElement = doc.querySelector('.x_header');
  headerElement.parentNode.removeChild(headerElement);
  return doc;
}

function stripBookedHeader(doc) {
  const bookedHeader = doc.querySelector('.x_section-header');
  bookedHeader.parentNode.removeChild(bookedHeader);
  return doc;
}

function removeAfterReleased(doc) {
  const releasedHeader = doc.querySelector('.x_section-header');
  const hParent = releasedHeader.parentNode;
  const docArray = Array.from(doc.body.children);
  const headerIndex = docArray.indexOf(hParent);
  
  for(let i = headerIndex; i < docArray.length; i++) {
    docArray[i].parentNode.removeChild(docArray[i]);
  }

  return doc;
}

function getCount(doc) {
  const allElements = doc.querySelectorAll('.x_image-div');
  return Array.from(allElements).length;
}