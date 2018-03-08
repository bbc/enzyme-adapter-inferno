import { Component } from 'inferno';

/**
 * Simple wrapper around mocha it which allows an array of possible values to test against.
 * Each test will be wrapped in a try/catch block to handle any errors.
 *
 * @param {Object[]} data
 * @param {String} message
 * @param {Function} factory
 */
export function itWithData(data, message, factory) {
  data.forEach((testCase) => {
    it(`${message} ${testCase.message}`, () => factory(testCase));
  });
}

/**
 * React component used for testing.
 */
class TestHelper extends Component {
  render() {
    return <div />;
  }
}

/**
 * Possible values for React render() checks.
 */
export function generateEmptyRenderData() {
  return [
    // Returns true for empty
    { message: 'false', value: false, expectResponse: true },
    { message: 'null', value: null, expectResponse: true },

    // Returns false for empty, valid returns
    { message: 'React component', value: <TestHelper />, expectResponse: false },
    { message: 'React element', value: <span />, expectResponse: false },
    { message: 'React element', value: <noscript />, expectResponse: false },
  ];
}
