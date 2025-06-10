import { getApiDocs } from '@/lib/swagger';
import { useEffect, useRef } from 'react';
import { SwaggerUIBundle } from 'swagger-ui-dist';
import 'swagger-ui-dist/swagger-ui.css';

export async function getStaticProps() {
  const spec = await getApiDocs();
  return {
    props: {
      spec: spec || null,
    },
  };
}

export default function APIDocs({ spec }: { spec: unknown }) {
  const swaggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (swaggerRef.current && spec) {
      SwaggerUIBundle({
        spec,
        domNode: swaggerRef.current,
      });
    }
  }, [spec]);

  return <div className="swagger-ui-wrapper" ref={swaggerRef} />;
}
