import React from 'react';
import { EndpointRow as BaseEndpointRow } from '../../../page-components';

export default function EndpointRow() {
  return (
    <BaseEndpointRow
      method="POST"
      endpoint="/dj-rest-auth/logout/"
      expectedOutput={{
        detail: 'Successfully logged out.'
      }}
      requiresAuth={true}
    />
  );
} 