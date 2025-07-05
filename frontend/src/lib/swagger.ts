import { createSwaggerSpec } from 'next-swagger-doc';
import doc from '../next-swagger-doc.json';

export const getApiDocs = async () => {
  const spec = createSwaggerSpec(doc);
  return spec;
};
