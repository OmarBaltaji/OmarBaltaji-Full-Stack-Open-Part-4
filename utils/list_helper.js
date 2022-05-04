const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0);
}

const favoriteBlog = (blogs) => {
  const reducer = (item1, item2) => {
    if(item1.likes > item2.likes) {
      return {
        title: item1.title,
        author: item1.author,
        likes: item1.likes
      }
    } else {
      return {
        title: item2.title,
        author: item2.author,
        likes: item2.likes
      }
    }
  }

  return blogs.length === 0 ? {} : blogs.reduce(reducer, -Infinity);
}

const mostBlogs = (blogs) => {
  uniqueAuthors = [];
  authorsAndBlogsArray = [];
  blogs.forEach(blog => {
    if(uniqueAuthors.includes(blog.author)) {
      authorsAndBlogsArray = authorsAndBlogsArray.map(item => { 
        if(item.author === blog.author) {
          item.blogs += 1;
          return item;
        }
      });
    } else {
      authorsAndBlogsObject = {
        author: blog.author,
        blogs: 1
      };
      authorsAndBlogsArray.push(authorsAndBlogsObject);
      uniqueAuthors.push(blog.author);
    }
  })

  mostBlogsAuthor = authorsAndBlogsArray.reduce((item1, item2) => {
    if(item1.blogs > item2.blogs) {
      return item1;
    } else {
      return item2;
    }
  }, -Infinity)

  return blogs.length === 0 ? {} : mostBlogsAuthor
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs }