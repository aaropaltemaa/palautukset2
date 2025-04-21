import { render, screen } from '@testing-library/react'
import Blog from "./Blog"

test('renders blog title and author', () => {
    const blog = {
        title: "test title",
        author: "test author"
    }

    render(<Blog blog={blog} />)

    const element = screen.getByText('test title')

    screen.debug(element)

    expect(element).toBeDefined()
})