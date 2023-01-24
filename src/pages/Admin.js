import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    MDBBtn,
    MDBContainer,
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBCheckbox,
} from 'mdb-react-ui-kit'
import { Contract, ContractFactory, providers, Wallet } from 'ethers'
import { Buffer } from 'buffer/'
import { AuthContext } from '../libs/AuthContext'
import { InfinitySpin } from 'react-loader-spinner'
window.Buffer = window.Buffer || Buffer
const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')
const byteCodeRaw = require('../data/bytecode.json')
const abi = require('../data/abi.json')

export default function Admin() {
    const [filesUsers, setFilesUsers] = useState('')
    const [filesCandidates, setFilesCandidates] = useState('')
    const [data, setData] = useState({})
    const [address, setAddress] = useState('')
    const [loading, setLoading] = useState(false)
    const bytecode = byteCodeRaw['code']
    const navigate = useNavigate()
    const { setContract } = useContext(AuthContext)

    const handleFileUsers = (e) => {
        const fileReader = new FileReader()
        fileReader.readAsText(e.target.files[0], 'UTF-8')
        fileReader.onload = (e) => {
            setFilesUsers(e.target.result)
        }
        console.log('this is the registered useres' + filesUsers)
    }

    const handleFileCandidates = (e) => {
        const fileReader = new FileReader()
        fileReader.readAsText(e.target.files[0], 'UTF-8')
        fileReader.onload = (e) => {
            setFilesCandidates(e.target.result)
        }
    }
    const handleSubmit = (event) => {
        event.preventDefault()
        let owner = event.target.form.owner.value
        let name = event.target.form.name.value
        let description = event.target.form.description.value
        let symbol = event.target.form.symbol.value
        setData({ owner: owner, name: name, desc: description, symbol: symbol })
        setLoading(true)
        deploy(bytecode, abi, data)
    }

    const handleButton = (event) => {
        navigate('/manage')
    }

    const deploy = async (bytecode, abi, data) => {
        //prepare merkle root from registered addresses
        let addresses = JSON.parse(filesUsers)
        let candidates = JSON.parse(filesCandidates)
        const leaves = addresses.map((address) => keccak256(address))
        const tree = new MerkleTree(leaves, keccak256, { sort: true })
        const root = tree.getHexRoot()
        // prepare contract deployment
        const provider = new providers.JsonRpcProvider(
            'https://matic-mumbai.chainstacklabs.com'
        )
        const wallet = new Wallet(process.env.REACT_APP_PRIVATE_KEY, provider)

        const factory = new ContractFactory(abi, bytecode, wallet)
        const contract = await factory.deploy(
            data['owner'],
            data['name'],
            data['desc'],
            data['symbol'],
            root,
            { gasPrice: 21000000000, gasLimit: 6000000 }
        )
        setAddress(contract.address)
        setContract(contract.address)
        localStorage.setItem('contractAddress', contract.address)
        localStorage.setItem('users', filesUsers)
        //set candidates
        try {
            for (let i in candidates[0]['candidates']) {
                let candidate = candidates[0]['candidates'][i]
                const transaction = await contract.functions.addCandidate(
                    candidate['name'],
                    candidate['description'],
                    candidate['image'],
                    candidate['mail']
                )
            }
        } catch (err) {
            console.log(err)
        }
        setLoading(false)
        alert('Contract created !')
    }

    return (
        <>
            <h3 className="title">ADMIN DASHBOARD</h3>
            <MDBContainer
                fluid
                className="d-flex align-items-center justify-content-center bg-image"
            >
                <MDBCard className="m-5" style={{ maxWidth: '600px' }}>
                    <form>
                        <MDBCardBody className="px-5">
                            <h2 className="text-uppercase text-center mb-5">
                                Create an election
                            </h2>
                            <MDBInput
                                wrapperClass="mb-4"
                                label="owner"
                                size="lg"
                                name="owner"
                                type="text"
                            />
                            <MDBInput
                                wrapperClass="mb-4"
                                label="Election Name"
                                size="lg"
                                name="name"
                                type="text"
                            />
                            <MDBInput
                                wrapperClass="mb-4"
                                label="Election description"
                                size="lg"
                                name="description"
                                type="text"
                            />
                            <MDBInput
                                wrapperClass="mb-4"
                                label="NFT symbol"
                                size="lg"
                                name="symbol"
                                type="text"
                            />
                            <MDBInput
                                wrapperClass="mb-4"
                                label="users"
                                size="lg"
                                id="registeredUsers"
                                type="file"
                                onChange={handleFileUsers}
                            />
                            <MDBInput
                                wrapperClass="mb-4"
                                label="candidates"
                                size="lg"
                                id="candidates"
                                type="file"
                                onChange={handleFileCandidates}
                            />
                            <div style={{ marginLeft: '28%' }}>
                                {loading && (
                                    <InfinitySpin width="250" color="#4fa94d" />
                                )}
                            </div>
                            <MDBBtn
                                className="mb-4 w-100 gradient-custom-4"
                                size="lg"
                                onClick={handleSubmit}
                            >
                                Create
                            </MDBBtn>
                        </MDBCardBody>
                    </form>
                    {address && <p>Contract address : {address} </p>}
                </MDBCard>
            </MDBContainer>
        </>
    )
}
