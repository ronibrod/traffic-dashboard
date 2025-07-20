import React from 'react'
import {
  Alert,
  Button,
  FormControl,
  Stack,
  Typography,
  TextField,
  Divider,
} from '@mui/material'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useUser } from '../../contexts/user'
import ComingSoonDialog from '../ComingSoonDialog'

export default function LoginForm() {
  const { signin, signup } = useUser()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [isSignup, setIsSignup] = React.useState(false)
  const [company, setCompany] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [submitError, setSubmitError] = React.useState(null)
  const [comingSoonOpen, setComingSoonOpen] = React.useState(false)
  const handleComingSoonOpen = () => setComingSoonOpen(true)
  const handleComingSoonClose = () => setComingSoonOpen(false)
  const handleOpenAccountPopover = (event) => {
    setAccountAnchorEl(event.currentTarget)
  }
  const handleCloseAccountPopover = () => {
    setAccountAnchorEl(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const user = isSignup
        ? await signup(email, password)
        : await signin(email, password)

      if (user) return navigate('/Dashboard', { replace: true })
    } catch (error) {
      if (error?.response?.status === 401) {
        setSubmitError('unauthorized')
      } else {
        setSubmitError('internal_server_error')
      }
      console.error(error)
    }
  }

  const handleSubmitLoginWithGoogle = async () => {
    handleOpenAccountPopover()
  }

  return (
    <Stack sx={{ alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant="h3">
        {isSignup ? t('login.signup') : t('login.login')}
      </Typography>

      <Button
        className="google-button"
        id="login-with-GOOGLE"
        fullWidth
        onClick={handleSubmitLoginWithGoogle}
      >
        {t('login.login_with_google')}
      </Button>

      <ComingSoonDialog open={comingSoonOpen} onClose={handleComingSoonClose} />

      <Divider textAlign="center" sx={{ my: 2 }}>
        {t('or')}
      </Divider>

      <form onSubmit={handleSubmit}>
        <Stack sx={{ width: 500 }}>
          <FormControl margin="normal">
            <TextField
              fullWidth
              id="email"
              name="email"
              label={t('login.email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>

          {isSignup && (
            <FormControl margin="dense">
              <TextField
                fullWidth
                id="company"
                name="company"
                label={t('login.company_name')}
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </FormControl>
          )}

          <FormControl margin="dense">
            <TextField
              fullWidth
              id="password"
              name="password"
              label={t('login.password')}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>

          {submitError && (
            <Alert severity="error" sx={{ my: 2 }}>
              {submitError === 'unauthorized'
                ? t('login.email_or_password_incorrect')
                : t('login.login_attempt_failed')}
            </Alert>
          )}

          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            {isSignup ? t('login.signup') : t('login.login')}
          </Button>

          <Button onClick={() => setIsSignup(!isSignup)} sx={{ mt: 1 }}>
            {isSignup ? t('login.have_account') : t('login.no_account')}
          </Button>
        </Stack>
      </form>
    </Stack>
  )
}
