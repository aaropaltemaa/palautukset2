
const Persons = ({ filteredPersons }) => {
    return (
        <ul>
            {filteredPersons.map(p =>
                <li key={p.id}>
                    {p.name} {p.number}
                </li>
            )}
        </ul>
    )
}

export default Persons