import React from 'react'
import { Paper, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import LoginForm from './LoginForm'

export default function LoginPage() {
  const { t } = useTranslation()
  return (
    <Stack
      sx={{
        alignItems: 'center',
        justifyContent: 'center',
        width: '100dvw',
        height: '100dvh',
        bgcolor: '#f5f5f5',
      }}
    >
      <Paper
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          borderRadius: 4,
          boxShadow: '4px 0px 12px rgba(0, 0, 0, 0.1)',
          p: 4,
        }}
      >
      <Typography variant="h3">{t('login.login')}</Typography>
      <div style={{ marginTop: '30px' }}>
          <LoginForm />
      </div>
      </Paper>
    </Stack>
  )
}
