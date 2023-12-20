const { favouriteBlog, mostBlogs, mostLikes, totalLikes } = require('../utils/list_helper')
const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]

describe('favourite blog', () => {
  test('of empty list is null', () => {
    expect(favouriteBlog([])).toEqual(null)
  })

  test('with only a single blog, favourite is that', () => {
    expect(favouriteBlog([blogs[0]]))
      .toEqual({
        title: blogs[0].title,
        author: blogs[0].author,
        likes: blogs[0].likes
      })
  })

  test('of a bigger list, is the favourite blog', () => {
    expect(favouriteBlog(blogs))
      .toEqual({
        title: blogs[2].title,
        author: blogs[2].author,
        likes: blogs[2].likes
      })
  })
})

describe('most blogs', () => {
  test('of empty list is null', () => {
    expect(mostBlogs([])).toEqual(null)
  })

  test('with only a single blog, is author of that blog', () => {
    expect(mostBlogs([blogs[0]])).toEqual({
      author: 'Michael Chan',
      blogs: 1
    })
  })

  test('of a bigger list, to be author with most blogs', () => {
    expect(mostBlogs(blogs)).toEqual({
      author: 'Robert C. Martin',
      blogs: 3
    })
  })
})

describe('most likes', () => {
  test('of empty list is null', () => {
    expect(mostLikes([])).toEqual(null)
  })

  test('with only a single blog, is author of that blog', () => {
    expect(mostLikes([blogs[0]])).toEqual({
      author: 'Michael Chan',
      likes: 7
    })
  })

  test('of a bigger list, to be author with most likes', () => {
    expect(mostLikes(blogs)).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17
    })
  })
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    expect(totalLikes([])).toBe(0)
  })

  test('with only a single blog, total likes equals likes to that', () => {
    expect(totalLikes([blogs[0]])).toBe(7)
  })

  test('of a bigger list, to be sum of all likes', () => {
    expect(totalLikes(blogs)).toBe(36)
  })
})