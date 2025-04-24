import { useSelector, useDispatch } from 'react-redux'
import { voteOneAnecdote } from '../reducers/anecdoteReducer'
import { setNotificationWithTimeout } from '../reducers/notificationReducer'

const AnecdoteList = () => {
    const dispatch = useDispatch()
    const anecdotes = useSelector(({ filter, anecdotes }) => {
        return anecdotes.filter(anecdote =>
            anecdote.content.toLowerCase().includes(filter.toLowerCase())
        )
    })

    const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes)

    const vote = (anecdote) => {
        const updatedAnecdote = { ...anecdote, votes: anecdote.votes + 1 }
        dispatch(voteOneAnecdote(updatedAnecdote))
        dispatch(setNotificationWithTimeout(`you voted "${anecdote.content}"`, 5))
    }

    return (
        <div>
            {sortedAnecdotes.map(anecdote =>
                <div key={anecdote.id}>
                    <div>{anecdote.content}</div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => vote(anecdote)}>vote</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AnecdoteList
