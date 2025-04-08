
const Persons = ({ filteredPersons, deletePerson }) => {
    return (
        <ul>
            {filteredPersons.map(p =>
                <li key={p.id}>
                    {p.name} {p.number}
                    <button onClick={() => deletePerson(p.id)}>delete</button>
                </li>
            )}
        </ul>
    )
}

export default Persons