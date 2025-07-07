'use client';
import { useEffect, useRef } from 'react';
import { SwaggerUIBundle } from 'swagger-ui-dist';
import 'swagger-ui-dist/swagger-ui.css';

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  spec: Record<string, any>;
};

function ReactSwagger({ spec }: Props) {
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

export default ReactSwagger;
