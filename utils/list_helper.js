const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) =>  sum + item.likes;

  return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0);
}

const favoriteBlog = (blogs) => {
  const reducer = (item1, item2) => {
    itemWithMoreLikes = item1.likes > item2.likes ? item1 : item2;
    return {
      title: itemWithMoreLikes.title,
      author: itemWithMoreLikes.author,
      likes: itemWithMoreLikes.likes
    }
  }

  return blogs.length === 0 ? {} : blogs.reduce(reducer, -Infinity);
}

const mostBlogs = (blogs) => {
  const mostBlogsAuthor = getAuthorWithMoreProperty(blogs, 'blogs');
  return blogs.length === 0 ? {} : mostBlogsAuthor
}

const mostLikes = (blogs) => {
  const mostLikesAuthor = getAuthorWithMoreProperty(blogs, 'likes');
  return blogs.length === 0 ? {} : mostLikesAuthor
}

const getAuthorWithMoreProperty = (blogs, property) => {
  const propertyCountByAuthor = {};
  blogs.forEach(blog => {
    const author = blog.author;
    if (propertyCountByAuthor[author]) {
      propertyCountByAuthor[author] += (property === 'likes' ? blog.likes : 1);
    } else {
      propertyCountByAuthor[author] = property === 'likes' ? blog.likes : 1;
    }
  });
 
  let maxProperty = 0;
  let authorWithMostProperty = '';
  for (const author in propertyCountByAuthor) {
    if (propertyCountByAuthor[author] > maxProperty) {
      maxProperty = propertyCountByAuthor[author];
      authorWithMostProperty = author;
    }
  }

  return {
    author: authorWithMostProperty,
    [property]: maxProperty,
  }
} 

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }