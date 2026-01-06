import React from 'react';

import type { LoginFormProps } from '@/components/login-form';
import { LoginForm } from '@/components/login-form';
import { FocusAwareStatusBar } from '@/components/ui';

export default function Login() {
  const onSubmit: LoginFormProps['onSubmit'] = (data) => {
    console.log('📧 Login attempt with email:', data.email);
    // Note: Actual authentication is handled in LoginForm component
    // This callback is for additional logging/tracking only
  };
  return (
    <>
      <FocusAwareStatusBar />
      <LoginForm onSubmit={onSubmit} />
    </>
  );
}
