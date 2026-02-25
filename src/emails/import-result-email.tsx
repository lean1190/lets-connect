import { Hr, Html, Link, Section, Text } from '@react-email/components';
import type { ReactNode } from 'react';
import { productionUrl } from '@/lib/constants/links';

const HOUSTON_EVENTS_URL = `${productionUrl}/houston/events`;

type ImportResultEmailProps = {
  success: boolean;
  row?: {
    id: string;
    created_at: string;
    import_from: string;
    imported: unknown;
    skipped: unknown;
    errors: unknown;
  } | null;
  errorMessage?: string | null;
};

function LabelValue({ label, value }: { label: string; value: ReactNode }) {
  return (
    <Section style={{ marginBottom: 12 }}>
      <Text style={{ margin: 0, fontSize: 12, color: '#6b7280', fontWeight: 600 }}>{label}</Text>
      <Text style={{ margin: '4px 0 0', fontSize: 14 }}>{value}</Text>
    </Section>
  );
}

function JsonBlock({ data }: { data: unknown }) {
  const str = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
  return (
    <pre
      style={{
        margin: 0,
        padding: 12,
        fontSize: 12,
        backgroundColor: '#f3f4f6',
        borderRadius: 6,
        overflow: 'auto',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word'
      }}
    >
      {str}
    </pre>
  );
}

export default function ImportResultEmail({
  success = true,
  row = {
    id: '00000000-0000-0000-0000-000000000000',
    created_at: new Date().toISOString(),
    import_from: 'https://www.foundhamburg.com/p/example-newsletter',
    imported: [
      {
        id: 'evt_1',
        name: 'Sample imported event',
        date: '2025-03-10'
      }
    ],
    skipped: [
      {
        name: 'Existing event',
        date: '2025-02-01'
      }
    ],
    errors: []
  },
  errorMessage = null
}: ImportResultEmailProps) {
  const isError = !success;
  const hasRow = row != null;

  return (
    <Html lang="en">
      <Section style={{ padding: '24px 0', fontFamily: 'sans-serif' }}>
        {isError && errorMessage ? (
          <>
            <Text
              style={{
                fontSize: 32,
                lineHeight: 1,
                marginBottom: 8
              }}
            >
              ❌
            </Text>
            <Text style={{ fontSize: 16, margin: 0 }}>{errorMessage}</Text>
          </>
        ) : null}

        {hasRow ? (
          <>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 600,
                marginTop: 0,
                marginBottom: 16
              }}
            >
              {isError ? 'Import result (with errors)' : 'Import result'}
            </Text>
            <LabelValue label="ID" value={row.id} />
            <LabelValue label="Created at" value={row.created_at} />
            <LabelValue label="Import from" value={row.import_from} />
            <Section style={{ marginBottom: 12 }}>
              <Text
                style={{
                  margin: 0,
                  fontSize: 12,
                  color: '#6b7280',
                  fontWeight: 600
                }}
              >
                Imported
              </Text>
              <JsonBlock data={row.imported} />
            </Section>
            <Section style={{ marginBottom: 12 }}>
              <Text
                style={{
                  margin: 0,
                  fontSize: 12,
                  color: '#6b7280',
                  fontWeight: 600
                }}
              >
                Skipped
              </Text>
              <JsonBlock data={row.skipped} />
            </Section>
            <Section style={{ marginBottom: 12 }}>
              <Text
                style={{
                  margin: 0,
                  fontSize: 12,
                  color: '#6b7280',
                  fontWeight: 600
                }}
              >
                Errors
              </Text>
              <JsonBlock data={row.errors} />
            </Section>
          </>
        ) : null}

        <Hr style={{ margin: '24px 0' }} />
        <Text style={{ fontSize: 14, margin: '0 0 8px' }}>Links:</Text>
        <Link href={HOUSTON_EVENTS_URL} style={{ display: 'block', marginBottom: 8 }}>
          Houston Events
        </Link>
      </Section>
    </Html>
  );
}
