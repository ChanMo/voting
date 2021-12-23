import React, { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import { getContract } from './utils'

export default function VoterForm({open, onClose, ...props}) {
  const [alerts, setAlerts] = useState([])
  const [form, setForm] = useState({})
  const handleChange = (event) => {
    const name = event.target.name
    const value = event.target.value
    setForm({...form, [name]:value})
  }
  const handleSubmit = async() => {
    const contract = getContract(true)
    try {
      const res = await contract.giveRightToVote(form.address)
      console.log(res)
      onClose()
    } catch(err) {
      setAlerts([{type:'error', text:err.data.message}])
    }
  }
  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle>Add Voter</DialogTitle>
      <DialogContent>
        {alerts.map((row,index) => (
          <Alert
            sx={{marginBottom:1}}
            key={index.toString()}
            severity={row.type}>
            {row.text}
          </Alert>
        ))}
        <TextField
          name="address"
          label="Account Address"
          margin="dense"
          fullWidth
          variant="standard"
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  )
}
