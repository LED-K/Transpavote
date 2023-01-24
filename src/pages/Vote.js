import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../libs/AuthContext'
import Row from 'react-bootstrap/Row'
import CandidateDisplayer from '../components/CandidateDIsplayer'
import { Buffer } from 'buffer/'
const Web3 = require('web3')
const abi = require('../data/abi.json')
const keccak256 = require('keccak256')
const { MerkleTree } = require('merkletreejs')
window.Buffer = window.Buffer || Buffer

export default function Vote() {
    const [candidates, setCandidates] = useState([])
    const [connected, setConnected] = useState()
    const [voted, setVoted] = useState()
    const [proof, setProof] = useState()
    const [registered, setRegistered] = useState()
    const UserAuth = useContext(AuthContext)
    const navigate = useNavigate()
    const account = UserAuth['accounts']
    var elContract = UserAuth['contract']
    const voters = JSON.parse(localStorage.getItem('users'))
    if (!elContract) {
        elContract = localStorage.getItem('contractAddress')
    }
    console.log(localStorage.getItem('connected'))
    //get candidates
    useEffect(() => {
        if (localStorage.getItem('connected') && elContract) {
            async function getCandidates() {
                let candidates = []
                const web3 = new Web3(window.ethereum)
                await window.ethereum.enable()
                const contract = new web3.eth.Contract(abi, elContract)
                //build merkle proof
                console.log(voters)
                const leaves = voters.map((address) => keccak256(address))
                const tree = new MerkleTree(leaves, keccak256, { sort: true })
                const leaf = keccak256(window.ethereum.selectedAddress)
                const proof = tree.getHexProof(leaf)
                setProof(proof)
                const isRegistered = await contract.methods
                    .isRegistered(window.ethereum.selectedAddress, proof)
                    .call()
                setRegistered(isRegistered)
                var lastId = await contract.methods.getNumOfCandidates().call()
                for (let i = 0; i <= lastId - 1; i++) {
                    let candidate = await contract.methods
                        .getCandidate(i.toString())
                        .call()
                    console.log(candidate)
                    candidates.push(candidate)
                }
                setCandidates(candidates)
                setVoted(true)
            }
            getCandidates()
        } else {
            navigate('/')
        }
    }, [])

    return (
        <>
            {registered ? (
                <div class="container mt-5">
                    <h3 className="title">CANDIDATES</h3>
                    <Row xs={1} md={2} className="g-5 mt-4">
                        {candidates.map((e) => (
                            <CandidateDisplayer
                                votes={e['3']}
                                proof={proof}
                                account={window.ethereum.selectedAddress}
                                abi={abi}
                                address={elContract}
                                url={e['2']}
                                name={e['0']}
                                description={e['1']}
                            />
                        ))}
                    </Row>
                </div>
            ) : (
                <h2 className="title">
                    You are not registered for this election
                </h2>
            )}
        </>
    )
}
