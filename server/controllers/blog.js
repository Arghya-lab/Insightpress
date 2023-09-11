const Blog = require('../models/Blog')
const User = require('../models/User')
// const {  id, name, email } = req.user  // user data came via token


// Create
const uploadBlog = async (req, res) => {
  try {
    const { title, summary, featuredImgName, content } = req.body
    const { id } = req.user  // user data came via token
    const authorData = await User.findById(id) // user data come from user db
    const { _id ,name, avatarImgName, } = authorData
    const blogData = await Blog.create({
      authorData: {
        authorId: _id,
        author: name,
        avatarImgName, 
      },
      title,
      summary,
      featuredImgName,
      content,
    })
    res.status(200).json(blogData)
  } catch (error) {    
    res.status(400).json(error)
    console.log(error);
  }
}

// Read
const getSingleBlog = async(req, res) => {
  try {
    const { id } = req.params // blog id
    const blogData = await Blog.findById(id)
    res.status(200).json(blogData)
  } catch (error) {
    res.status(400).json(error)
  }
}

const getBlogs = async(req, res) => {
  try {
    const blogsData = await Blog.find().sort({createdAt: "desc"}).limit(20)
    
    res.status(200).json(blogsData)
  } catch (error) {
    res.status(400).json(error)
  }
}

const getAuthorBlogs = async (req, res) => {
  try {
    const { id } = req.params  // author id || user id
    const blogs = await Blog.find({userId: id})
    res.status(200).send(blogs)
  } catch (error) {
    res.status(400).json(error)
  }
}

const updateBlog = async (req, res) => {
  try {
    const { id } = req.params // blog id
    const { userId } = await Blog.findById(id)
    const { title, summary, featuredImgName, content } = req.body
    if (!userId) {
      res.status(400).json({"error": "Blog not found."})

      // req.user data came via token
    } else if(userId != req.user.id) {
      res.status(400).json({"error": "You are unauthorize to delete."})
    } else {
      const blog = await Blog.findByIdAndUpdate(id, { title, summary, featuredImgName, content })
      res.status(200).json(blog)
    }
  } catch (error) {
    res.status(400).json(error)
    console.log(error);
  }
}

const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params // blog id
    const { userId } = await Blog.findById(id)
    if (!userId) {
      res.status(400).json({"error": "Blog not found."})
      
      // req.user data came via token
    } else if(userId != req.user.id) {
      res.status(400).json({"error": "You are unauthorize to delete."})
    } else {
      await Blog.findByIdAndDelete(id)
      res.status(200).json({ "Success": "Note has been deleted."})
    }
  } catch (error) {
    res.status(400).json(error)
  }
}


module.exports = { uploadBlog, getSingleBlog, getBlogs, getAuthorBlogs, updateBlog, deleteBlog }