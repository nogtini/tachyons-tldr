import postcssJs from 'postcss-js';
import postcss from 'postcss';
import hello from 'hello-color';
import R from 'ramda';
import {
  root,
  renameKeys,
  renameKeysBy,
  toTitleCase,
} from '../utils';

/**
 * Colours
 */
const coloursModule = require('!raw-loader!tachyons/src/_colors.css');

const coloursRoot = postcss.parse(coloursModule);

const groupByAlpha = R.groupBy(
  R.compose(
    R.test(/(rgba.+|transparent)/),
    R.last,
  ),
);

const addNegatives = R.map(colour => ({
  value: colour,
  negative: hello(colour).color,
}));

// eslint-disable-next-line
export const colours = R.compose(
  R.over(R.lensProp('solid'), addNegatives),
  R.map(R.fromPairs),
  renameKeys({
    false: 'solid',
    true: 'alpha',
  }),
  groupByAlpha,
  R.toPairs,
  renameKeysBy(toTitleCase),
  root,
  postcssJs.objectify,
)(coloursRoot);
