module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: "..",
  roots: ["<rootDir>/test"],
  testMatch: ["**/*.spec.ts", "**/*.test.ts"],
  collectCoverageFrom: [
    "<rootDir>/src/**/*.ts",
    "!<rootDir>/src/**/*.d.ts",
    "!<rootDir>/src/**/index.ts",
    "!<rootDir>/src/**/*.interface.ts",
  ],
  coverageDirectory: "<rootDir>/test/coverage",
  coverageReporters: ["text", "lcov", "html"],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/../src/$1",
  },
  verbose: true,
};
