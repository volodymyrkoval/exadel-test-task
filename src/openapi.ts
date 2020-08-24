import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { defaultMetadataStorage } from 'class-transformer/storage';
import { getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';

function generateOpenAPISpec(routingControllersOptions) {
  const schemas = validationMetadatasToSchemas({
    classTransformerMetadataStorage: defaultMetadataStorage,
    refPointerPrefix: '#/components/schemas/',
  });

  // Parse routing-controllers classes into OpenAPI spec:
  const storage = getMetadataArgsStorage();
  return routingControllersToSpec(storage, routingControllersOptions, {
    components: {
      schemas,
    },
    info: {
      title: 'Test Task App for Exadel',
      version: '1.0.0',
    },
  });
}

export default generateOpenAPISpec;
