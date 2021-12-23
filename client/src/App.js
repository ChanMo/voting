import React, { useState, useEffect } from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Alert from '@mui/material/Alert'
import Stack from '@mui/material/Stack'
import VoterForm from './VoterForm'
import { ethers } from 'ethers'
import { getContract } from './utils'

function App() {
  const [alerts, setAlerts] = useState([])
  const [proposals, setProposals] = useState([])
  const [voterFormOpen, setVoterFormOpen] = useState(false)

  useEffect(()=>{
    const initContract = async() => {
      const contract = getContract()
      let r = []
      let i = 0
      while(true) {
        try {
          const res = await contract.proposals(i)
          r.push({
            name: ethers.utils.parseBytes32String(res.name),
            voteCount: res.voteCount.toString()
          })
          i++
          continue
        } catch (err) {
          break
        }
      }
      setProposals(r)
    }
    initContract()
  }, [])

  const handleVote = async(index) => {
    const contract = getContract(true)
    try {
      const res = await contract.vote(index)
      console.log(res)
    } catch(err) {
      setAlerts([{type:'error', text:err.data.message}])
    }
  }

  const handleVoterFormClose = () => {
    setVoterFormOpen(false)
  }

  const fetchWinner = async() => {
    const c = getContract()
    try {
      const res = await c.winnerName()
      const resName = ethers.utils.parseBytes32String(res)
      alert(resName)
    } catch(err) {
      console.log(err)
    }
  }

  return (
    <Container maxWidth="md">
      <Typography
        sx={{marginTop:3,marginBottom:2}}
        component="h2"
        variant="h3">Ballot
      </Typography>
      <Stack direction="row" spacing={2} sx={{marginBottom:2}}>
        <Button
          onClick={()=>setVoterFormOpen(true)}
          variant="contained">Add Voter</Button>
        <Button
          onClick={fetchWinner}
          variant="outlined">Show Winner</Button>
      </Stack>
      {alerts.map((row,index) => (
        <Alert
          sx={{marginBottom:1}}
          key={index.toString()}
          severity={row.type}>
          {row.text}
        </Alert>
      ))}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Index</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>VoteCount</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {proposals.map((row, index) => (
            <TableRow key={row.name}>
              <TableCell>{index}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.voteCount}</TableCell>
              <TableCell>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={()=>handleVote(index)}
                >Vote</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <VoterForm
        open={voterFormOpen}
        onClose={handleVoterFormClose}
      />
    </Container>
  );
}

export default App;
