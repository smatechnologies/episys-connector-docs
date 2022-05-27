module.exports = {
  mySidebar: [
    'index',
    'release-notes',
    {
      type: 'category', 
      label: 'Installation',
      collapsed: false,
      items: [
        'installation/installation',
      ], 
    },
    {
      type: 'category', 
      label: 'Operations',
      collapsed: false,
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
      collapsed: false,
      items: [
        'reference/rsj-q-and-a',
        'reference/rsj-known-differences',
        'reference/known-symitar-issues',
        'reference/unix-commands',
        'reference/commonly-used-terms',
        'reference/sym-user-root',
      ], 
    },
  ],
};
