import React from 'react';

import { EndpointTable } from '../../page-components';
import EndpointRow from '../../page-components/EndpointRow';

/**
 * Container component for setup endpoints
 */
export default function SetupEndpoints() {
  return (
    <EndpointTable title="Setup Endpoints">
      <EndpointRow
        method="GET"
        endpoint="/api/setup/health/hello"
        expectedOutput={{
          message: "Hello World from Dottie API!"
        }}
      />
      
      <EndpointRow
        method="GET"
        endpoint="/api/setup/database/status"
        expectedOutput={{
          status: "connected"
        }}
      />
    </EndpointTable>
  );
} 