export const emailFrom = 'Lean <me@leanvilas.com>';
export const emailReplyTo = 'me@leanvilas.com';
export const cronImportNotifyTo = process.env.CRON_IMPORT_NOTIFY_EMAIL ?? emailReplyTo;

export const subjects = {
  import: '[ACT] - Result of the latest event import'
};
