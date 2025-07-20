import { useRef, useState } from 'react';
import {
  Button, Popover, Stack, Typography, Box
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useTranslation } from 'react-i18next';
import { uploadTrafficData } from '../apis/traffic';

const TrafficUploadPopover = ({ mutate}) => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const [uploadAnchorEl, setUploadAnchorEl] = useState(null);

  const open = Boolean(uploadAnchorEl);
  const id = open ? 'traffic-upload-popover' : undefined;

  const handleUploadClick = (event) => {
    setUploadAnchorEl(event.currentTarget);
  };

  const handleUploadClose = () => {
    setUploadAnchorEl(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        try {
          const json = JSON.parse(ev.target.result);
          await uploadTrafficData(json);
          mutate();
          handleUploadClose();
        } catch (err) {
          console.error('Invalid JSON file', err);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <Box>
      <Button variant="outlined" onClick={handleUploadClick}>
        {t('upload_json')}
      </Button>

      <Popover
        id={id}
        open={open}
        anchorEl={uploadAnchorEl}
        onClose={handleUploadClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Stack sx={{ p: 2, width: 250 }} spacing={2}>
          <Typography variant="subtitle1">{t('upload_traffic_json')}</Typography>
          <Button
            variant="contained"
            startIcon={<UploadFileIcon />}
            onClick={() => fileInputRef.current.click()}
          >
            {t('choose_file')}
          </Button>
          <input
            type="file"
            accept=".json"
            hidden
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <Typography variant="caption" color="text.secondary">
            {t('upload_hint')}
          </Typography>
        </Stack>
      </Popover>
    </Box>
  );
};

export default TrafficUploadPopover;
