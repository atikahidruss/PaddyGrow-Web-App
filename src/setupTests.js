// setupTests.js
import '@testing-library/jest-dom';

// jest.config.js
module.exports = {
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
};
