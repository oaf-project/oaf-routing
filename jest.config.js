module.exports = {
  "roots": [
    "<rootDir>/src"
  ],
  "transform": {
    "^.+\\.ts$": "ts-jest"
  },
  "testEnvironment": "jsdom",
  "collectCoverage": true,
  "coverageThreshold": {
    "global": {
      "branches": 66.03,
      "functions": 84,
      "lines": 81.55,
      "statements": 81.98
    }
  },
}
