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
      "branches": 62.26,
      "functions": 84,
      "lines": 81.55,
      "statements": 81.98
    }
  },
}
