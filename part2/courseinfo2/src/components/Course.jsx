const Header = ({ course }) => <h1>{course}</h1>

const Content = ({ course }) => {
    return (
        <div>
            <ul>
                {course.parts.map(p =>
                    <li key={p.id}>
                        {p.name} {p.exercises}
                    </li>
                )}
            </ul>
        </div>
    )
}

const ExerciseSum = ({ course }) => {
    const sum = course.parts.reduce((acc, currentValue) => acc + currentValue.exercises,
        0,
    )
    return (
        <p>total of {sum} exercises</p>
    )
}

const Course = ({ course }) => {
    return (
        <div>
            <Header course={course.name} />
            <Content course={course} />
            <ExerciseSum course={course} />
        </div>
    )
}

export default Course 