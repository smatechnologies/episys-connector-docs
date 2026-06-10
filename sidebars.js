module.exports = {
  mySidebar: [
    'index',
    'overview',
    'release-notes',
    {
      type: 'category',
      label: 'Installation',
      collapsed: true,
      items: [
        'installation/installation',
      ],
    },
    {
      type: 'category',
      label: 'Operations',
      collapsed: true,
      items: [
        'operations/command-line',
        'operations/jors-configuration',
        'operations/canceling-rsj-job',
        'operations/symitar-job-file-commands',
        'operations/rsj-failover',
        'operations/summary-files',
      ],
    },
    'rsj-reports',
    'symitar-batch-files',
    'symitar-exit-codes',
    'rsj-utility-programs',
    'important-symitar-concepts',
    'saj',
    {
      type: 'category',
      label: 'Reference',
      collapsed: true,
      items: [
        'reference/rsj-q-and-a',
        'reference/rsj-known-differences',
        'reference/known-symitar-issues',
        'reference/environment-variables',
        'reference/unix-commands',
        'reference/commonly-used-terms',
        'reference/sym-user-root',
      ],
    },
  ],
};
