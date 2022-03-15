import React from 'react';
import { flattenDeep, uniqueId } from 'lodash';

const getLinesWithBreaks = text => {
  const lines = text.split('\n');
  const linesWithBreaks = lines.reduce(
    (prev, curr) => prev.concat([curr, <br key={uniqueId()} />]),
    [],
  );
  linesWithBreaks.pop();
  return flattenDeep(linesWithBreaks);
};

const wrapBold = (children, bold) => {
  if (bold) {
    return <b key={uniqueId()}>{children}</b>;
  }
  return children;
};

const addLinks = (text, link) => {
  if (text.includes('{link}') && link) {
    const [start, end] = text.split('{link}');
    return (
      <React.Fragment key={uniqueId()}>
        {start}
        <a
          key={uniqueId()}
          target="_blank"
          rel="noopener noreferrer"
          href={link.href}
        >
          {link.text}
        </a>
        {end}
      </React.Fragment>
    );
  }
  return text;
};

/**
 * Formats config text.<br>
 * Wraps text starting with '{bold}' with &lt;b>.<br>
 * Replaces '{link}' with &lt;a href={link.href}>{link.text}&lt;/a><br>
 * Replaces '\n' with &lt;br /><br>
 * @param text - text to format
 * @param link - optional link param to replace '{link}'s with
 * @returns array of elements
 */
const getFormattedText = (text, link) => {
  const bold = text.startsWith('{bold}');
  let contents = '';
  if (bold) {
    contents = text.replace('{bold}', '').trim();
  } else {
    contents = text;
  }
  const lines = getLinesWithBreaks(contents);
  return lines.map(
    line =>
      typeof line === 'string' ? wrapBold(addLinks(line, link), bold) : line,
  );
};

export default getFormattedText;
