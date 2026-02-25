export const emailFrom = 'Lean <lean@pushpal.eu>';
export const emailReplyTo = 'lean@pushpal.eu';
export const cronImportNotifyTo = process.env.CRON_IMPORT_NOTIFY_EMAIL ?? emailReplyTo;

export const subjects = {
  import: '[ACT] - Result of the latest event import'
};
