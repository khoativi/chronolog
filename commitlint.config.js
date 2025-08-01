module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'test',
        'perf',
        'ci',
        'build',
        'chore',
        'revert',
        'deps'
      ]
    ]
  }
};
