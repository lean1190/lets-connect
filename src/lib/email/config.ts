export const emailFrom = 'Lean <leanvilas1190@gmail.com>';
export const emailReplyTo = 'leanvilas1190@gmail.com';
export const cronImportNotifyTo = process.env.CRON_IMPORT_NOTIFY_EMAIL ?? emailReplyTo;

export const subjects = {
  import: '[ACT] - Result of the latest event import'
};
