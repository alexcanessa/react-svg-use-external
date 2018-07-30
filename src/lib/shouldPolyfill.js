// https://github.com/jonathantneal/svg4everybody/blob/5016b3247d894c1afb9d6194972d48b1fbe6b5b1/lib/svg4everybody.js#L95-L111

const newerIEUA = /\bTrident\/[567]\b|\bMSIE (?:9|10)\.0\b/;
const webkitUA = /\bAppleWebKit\/(\d+)\b/;
const olderEdgeUA = /\bEdge\/12\.(\d+)\b/;
const edgeUA = /\bEdge\/.(\d+)\b/;

const inIframe = window.top !== window.self;

export default newerIEUA.test(navigator.userAgent) ||
  (navigator.userAgent.match(olderEdgeUA) || [])[1] < 10547 ||
  (navigator.userAgent.match(webkitUA) || [])[1] < 537 ||
  (edgeUA.test(navigator.userAgent) && inIframe);
