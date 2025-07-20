import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

const ComingSoonDialog = ({ open, onClose }) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Coming Soon 🚧</DialogTitle>

      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2} mt={1}>
          <Typography variant="body1" align="center">
            This feature is not available yet, but we're working hard to bring it to you soon.
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            {t('stay_tuned_for_future_updates')}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          {t('got_it')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ComingSoonDialog;
