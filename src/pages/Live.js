import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../libs/AuthContext'
import Row from 'react-bootstrap/Row'
const Web3 = require('web3')
const abi = require('../data/abi.json')

export default function Live() {
    const [data, setData] = useState({})
    const UserAuth = useContext(AuthContext)
    const account = window.ethereum.selectedAddress
    const owner = process.env.REACT_APP_PUBLIC_KEY.toLowerCase()
    var elContract = localStorage.getItem('contractAddress')

    //get candidates
    useEffect(() => {
        if (!elContract) {
            elContract = localStorage.getItem('contractAddress')
        }
        if (localStorage.getItem('connected') && elContract) {
            async function getData() {
                let candidates = []
                const web3 = new Web3(window.ethereum)
                await window.ethereum.enable()
                const contract = new web3.eth.Contract(abi, elContract)
                var lastId = await contract.methods.getNumOfCandidates().call()
                var elInfo = await contract.methods.getElectionDetails().call()
                var numVoters = await contract.methods.getNumOfVoters().call()
                if(!elInfo[2]){
                    setData({
                        Name: elInfo[0],
                        Status : elInfo[2],
                        NumCandidates: lastId,
                        NumVoters: numVoters,
                    })
                }else{
                    var winner = await contract.methods.winnerCandidate().call()
                    setData({
                        Name: elInfo[0],
                        NumCandidates: lastId,
                        Status : elInfo[2],
                        NumVoters: numVoters,
                        Winner : winner
                    })
                }
                
            }
            getData()
        }
    }, [])

    const endElection = async () => {
        const web3 = new Web3(window.ethereum)
        await window.ethereum.enable()
        const contract = new web3.eth.Contract(abi, elContract)
        try{
            var elInfo = await contract.methods
            .endElection()
            .send({ from: account })
        }catch(err){
            console.log(err);
        }
    }
    return (
        <>
            <div class="container mt-5">
                <h3 className="title">LIVE DATA</h3>
                <Row xs={1} md={2} className="g-5 mt-4">
                    <h4 className="title"> ELection Name : <br></br>{data['Name']}</h4>
                    <h4 className="title">
                        Number of candidates : <br></br>{data['NumCandidates']}
                    </h4>
                    <h4 class="title"> Number of Voters: <br></br> {data['NumVoters']}</h4>
                    {!data['Winner'] ? (
                        <h4 class="title"> Election Status : <br></br>Live</h4>
                    ) : (
                        <div>
                            <h4 class="title"> Election Status : <br></br>Ended</h4>
                            <h4 class="title"> Winner Candidate :<br></br> {data['Winner']}</h4>
                        </div>
                    )}
                </Row>
                {account == owner && (
                    <button
                        class=" text-white font-bold py-2 px-4 border-b-4 border-white-700 hover:border-orange-500"
                        onClick={endElection}
                    >
                        {' '}
                        End Election
                    </button>
                )}
            </div>
        </>
    )
}
