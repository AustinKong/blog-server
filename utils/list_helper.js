const totalLikes = blogs => {
  return blogs.reduce((total, blog) => {
    return total + blog.likes
  }, 0)
}

const favouriteBlog = blogs => {
  if (blogs.length === 0) {
    return null
  }
  let currentFavouriteBlogIndex = 0
  for (let i = 0; i < blogs.length; i++) {
    currentFavouriteBlogIndex = blogs[i].likes > blogs[currentFavouriteBlogIndex].likes ? i : currentFavouriteBlogIndex
  }
  return {
    title: blogs[currentFavouriteBlogIndex].title,
    author: blogs[currentFavouriteBlogIndex].author,
    likes: blogs[currentFavouriteBlogIndex].likes
  }
}

const mostBlogs = blogs => {
  if (blogs.length === 0) {
    return null
  }

  const authorsBlogs = {}
  // Counts the total number of blogs each author has and stores into dictionary
  blogs.forEach(blog => {
    if (!(blog.author in authorsBlogs)) {
      authorsBlogs[blog.author] = 0
    }
    authorsBlogs[blog.author]++
  })

  // Finds the name of author with most blogs
  const mostAuthor = Object.keys(authorsBlogs).reduce((prevHighestKey, key) => {
    if (authorsBlogs[key] > authorsBlogs[prevHighestKey]) {
      return key
    }
    else {
      return prevHighestKey
    }
  }, Object.keys(authorsBlogs)[0])

  return {
    author: mostAuthor,
    blogs: authorsBlogs[mostAuthor]
  }
}

const mostLikes = blogs => {
  if (blogs.length === 0) {
    return null
  }

  const authorsLikes = {}
  // Counts the total number of likes each author has and stores into dictionary
  blogs.forEach(blog => {
    if (!(blog.author in authorsLikes)) {
      authorsLikes[blog.author] = 0
    }
    authorsLikes[blog.author] += blog.likes
  })

  // Finds the name of author with most likes
  const mostAuthor = Object.keys(authorsLikes).reduce((prevHighestKey, key) => {
    if (authorsLikes[key] > authorsLikes[prevHighestKey]) {
      return key
    }
    else {
      return prevHighestKey
    }
  }, Object.keys(authorsLikes)[0])

  return {
    author: mostAuthor,
    likes: authorsLikes[mostAuthor]
  }
}

module.exports = {
  totalLikes, favouriteBlog, mostBlogs, mostLikes
}