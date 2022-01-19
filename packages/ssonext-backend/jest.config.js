module.exports = {
  preset: 'ts-jest',
  'moduleNameMapper': {
    "@buglink/(.*)": "<rootDir>../$1/src/"
  }
};
