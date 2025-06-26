import { getApiDocs } from '@/lib/swagger';
import ReactSwagger from './ReactSwagger';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'No-Knock API Documentation',
  description:
    'Explore the No-Knock API documentation for real-time, calendar-integrated, and predicted availability.',
};

export default async function DocsPage() {
  const spec = await getApiDocs();

  return (
    <section className="container">
      <ReactSwagger spec={spec} />
    </section>
  );
}
