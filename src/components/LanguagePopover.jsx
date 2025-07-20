import React, { useState } from 'react'
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Popover,
  MenuItem
} from '@mui/material'
import LanguageIcon from '@mui/icons-material/Language'
import { useTranslation } from 'react-i18next'
import i18n from '../i18n'

const LanguagePopover = () => {
  const { t } = useTranslation()
  const [anchorEl, setAnchorEl] = useState(null)

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng)
    handleClose()
  }

  return (
    <>
      <ListItem button onClick={handleOpen}>
        <ListItemIcon>
          <LanguageIcon />
        </ListItemIcon>
        <ListItemText primary={t('language')} />
      </ListItem>

      <Popover
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={() => handleLanguageChange('en-US')}>English</MenuItem>
        <MenuItem onClick={() => handleLanguageChange('he-IL')}>עברית</MenuItem>
      </Popover>
    </>
  )
}

export default LanguagePopover
