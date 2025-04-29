import { useQuery } from '@apollo/client'
import { ME, BOOKS_BY_GENRE } from '../queries'

const Recommended = () => {
    const { data: userData, loading: userLoading } = useQuery(ME)

    const favoriteGenre = userData?.me?.favoriteGenre

    const {
        data: booksData,
        loading: booksLoading
    } = useQuery(BOOKS_BY_GENRE, {
        variables: { genre: favoriteGenre },
        skip: !favoriteGenre
    })

    if (userLoading || booksLoading) return <div>loading...</div>

    return (
        <div>
            <h2>recommendations</h2>
            <p>
                books in your favorite genre <strong>{favoriteGenre}</strong>
            </p>
            <table>
                <tbody>
                    <tr>
                        <th>title</th>
                        <th>author</th>
                        <th>published</th>
                    </tr>
                    {booksData?.allBooks.map(b => (
                        <tr key={b.title}>
                            <td>{b.title}</td>
                            <td>{b.author.name}</td>
                            <td>{b.published}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Recommended
