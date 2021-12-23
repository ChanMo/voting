import { ethers } from 'ethers'
import Ballot from './contracts/Ballot.json'

export function getContract(withSigner=false) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const networks = Object.values(Ballot.networks)
  const network = networks[networks.length - 1]
  const contract = new ethers.Contract(network.address, Ballot.abi, provider)
  if(!withSigner) {
    return contract
  }
  const signer = provider.getSigner()
  const contractWithSigner = contract.connect(signer)
  return contractWithSigner
}
