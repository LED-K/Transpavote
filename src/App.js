import './App.css'
import Home from './pages/Home'
import SiteNav from './components/SiteNav'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from './libs/AuthContext'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Vote from './pages/Vote'
import Admin from './pages/Admin'
import Live from './pages/Live'
const Web3 = require('web3')
const abi = require('./data/abi.json')
const contract_addrr = '0xfcA4b741D8e669dD62A69bDfd05d9B8ef8a019De'

function App() {
    //constants
    const [accounts, setAccounts] = useState([])
    const [error, setError] = useState('')
    const [connected, setConnected] = useState(false)
    const [contract, setContract] = useState('')
    const navigate = useNavigate()
    if (window.ethereum.selectedAddress != null) {
        localStorage.setItem('connected', true)
    }
    console.log()
    //Connect function
    const connect = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts',
                })
                window.web3 = new Web3(window.ethereum)
                setConnected(true)
                setAccounts(accounts)
            } catch (err) {
                setError('Could not connect to Metamask')
            }
            navigate('/vote')
        }
    }

    return (
        <div className="App">
            <>
                <AuthContext.Provider
                    value={{ connected, accounts, contract, setContract }}
                >
                    <SiteNav />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/vote" element={<Vote />} />
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/live" element={<Live />} />
                    </Routes>
                </AuthContext.Provider>
                {window.ethereum.selectedAddress == null && (
                    <button
                        onClick={connect}
                        class=" text-white font-bold py-2 px-4 border-b-4 border-white-700 hover:border-orange-500"
                    >
                        Connecter mon portefeuille digital
                    </button>
                )}
                {error && <p> {error}</p>}
                {connected}
            </>
        </div>
    )
}

export default App
