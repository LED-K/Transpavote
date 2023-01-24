import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { AuthContext } from '../libs/AuthContext'
import { useContext } from 'react'
import { Wallet2 } from 'react-bootstrap-icons'
import { Link } from 'react-router-dom'

export default function SiteNav() {
    var connected = localStorage.getItem('connected')
    var account = window.ethereum.selectedAddress
    var owner = process.env.REACT_APP_PUBLIC_KEY.toLocaleLowerCase()
    return (
        <>
            <Navbar
                bg="dark"
                variant="dark"
                className="border"
                style={{ color: 'white' }}
            >
                <Container>
                    <Navbar.Brand href="#home">ELECTIONS</Navbar.Brand>
                    <Nav className="me-auto">
                        {connected && (
                            <Link className="nav_item" to="/live">
                                LIVE
                            </Link>
                        )}
                        {connected && (
                            <Link className="nav_item" to="/vote">
                                VOTE
                            </Link>
                        )}
                        {connected && account == owner && (
                            <Link className="nav_item" to="/admin">
                                ADMIN
                            </Link>
                        )}
                    </Nav>
                    <Wallet2 className="mr-3" />
                    {connected && account && (
                        <span>...{account.substr(account.length - 5)}</span>
                    )}
                </Container>
            </Navbar>
        </>
    )
}
