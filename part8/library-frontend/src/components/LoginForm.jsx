import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'
import { useNavigate } from "react-router-dom";

const LoginForm = ({ setToken }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const [login, result] = useMutation(LOGIN)

    useEffect(() => {
        if (result.data) {
            const token = result.data.login.value
            setToken(token)
            localStorage.setItem('library-user-token', token)
            navigate('/')
        }
    }, [result.data, setToken, navigate])

    const submit = async (event) => {
        event.preventDefault()
        login({ variables: { username, password } })
    }

    return (
        <div>
            <form onSubmit={submit}>
                <div>
                    username <input
                        value={username}
                        onChange={({ target }) => setUsername(target.value)}
                    />
                </div>
                <div>
                    password <input
                        type='password'
                        value={password}
                        onChange={({ target }) => setPassword(target.value)}
                    />
                </div>
                <button type='submit'>login</button>
            </form>
        </div>
    )
}

export default LoginForm