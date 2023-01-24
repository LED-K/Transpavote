import Image from 'react-bootstrap/Image'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import { useContext } from 'react'
const Web3 = require('web3')

async function Vote(user, candidate, abi, address, proof) {
    try {
        const web3 = new Web3(window.ethereum)
        await window.ethereum.enable()
        const contract = new web3.eth.Contract(abi, address)
        let vote = await contract.methods.vote(candidate, proof).send({
            from: user,
        })
        if (vote['status']) {
            alert('You sucessfully voted !')
        }
    } catch (err) {
        console.log(err)
    }
}

export default function CandidateDisplayer(props) {
    console.log(props.account + 'account')
    var name = Web3.utils.soliditySha3(props.name)
    console.log(name)
    return (
        <>
            <Col className="mb-5">
                <Card
                    bg="#000000"
                    border="light"
                    className="card mx-auto"
                    style={{
                        width: '18rem',
                        backgroundColor: '#212529',
                        color: 'white',
                    }}
                >
                    <Card.Img variant="top" src={props.url} />
                    <Card.Body>
                        <Card.Title>{props.name}</Card.Title>
                        <Card.Text>{props.description}</Card.Text>
                        <Card.Text>{props.votes}</Card.Text>
                        <Button
                            onClick={() =>
                                Vote(
                                    props.account,
                                    name,
                                    props.abi,
                                    props.address,
                                    props.proof
                                )
                            }
                            variant="Light"
                            className="border"
                            style={{ color: 'white' }}
                        >
                            Vote
                        </Button>
                    </Card.Body>
                </Card>
            </Col>
        </>
    )
}
