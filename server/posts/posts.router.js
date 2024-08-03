const express = require('express');
const { fetchPosts } = require('./posts.service');
const { fetchUserById } = require('../users/users.service');
const { default: axios } = require('axios');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const params = req.query || {}
    const posts = await fetchPosts(params);

    const postsWithImagesAndUsers = await Promise.all(
      posts.map(async (post) => {
        try {
          const { data } = await axios.get(`https://jsonplaceholder.typicode.com/albums/${post?.id}/photos`)
          
          const user = await fetchUserById(post.userId);
          const userFullName = user?user.name:"";
          const userShortName = user?user.shortName:"Unknown";
          const userEmail = user?user.email:"Unknown";

          return{
            ...post,
            images: data.map(photo => ({ url: photo.url })),
            userFullName,
            userShortName,
            userEmail,
          }
        } catch (error) {
          console.error("error fetching user data");
          res.status(500).send(`Error fetching user data: ${error.message}`);
        }
        return{
          ...post,
          images: [],
          userFullName: 'Unknown User',
          userEmail: 'Unknown',
        }
      })
    )

    res.json(postsWithImagesAndUsers);

  } catch (error) {
    console.error('Error fetching post', error);
    res.status(500).send('Internal Server error');
  }
});

module.exports = router;
