module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      '\\.svg$': '<rootDir>/__mocks__/svgMock.js',
      '^/(.*)$': '<rootDir>/public/$1',
    },
    transform: {
      '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest',
    },
    transformIgnorePatterns: [
      '/node_modules/(?!(@testing-library/react|@testing-library/react-dom)/)',
    ],
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  };