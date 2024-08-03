import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Post from './Post';
import Container from '../common/Container';
import { useWindowWidth } from '../context/WindowWidthContext';

const PostListContainer = styled.div(() => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
}));

const LoadMoreButton = styled.button(() => ({
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: 5,
  cursor: 'pointer',
  fontSize: 16,
  marginTop: 20,
  transition: 'background-color 0.3s ease',
  fontWeight: 600,

  '&:hover': {
    backgroundColor: '#0056b3',
  },
  '&:disabled': {
    backgroundColor: '#808080',
    cursor: 'default',
  },
}));

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(10);
  const [morePosts, setMorePosts] = useState(true);
  const limit = 10;
  const { isSmallerDevice } = useWindowWidth();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data: newPosts } = await axios.get('/api/v1/posts', {
          params: { start: 0, limit: isSmallerDevice ? 5 : 10 },
        });
        setPosts(prevPosts=>[...prevPosts,...newPosts]);
        setIsLoading(false)
        if (newPosts.length < limit) {
          setMorePosts(false);
        }      
      } catch (error) {
        console.error(`Error fetching posts: ${error}`);
      }
    };
    fetchPost();
  }, [isSmallerDevice,startIndex,endIndex]);

  const handleClick = () => {
    setIsLoading(true);
    setStartIndex(prevStartIndex => prevStartIndex + limit)
  };

  return (
    <Container>
      <PostListContainer>
        {posts.map(post => (
          <Post post={post} />
        ))}
      </PostListContainer>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {morePosts &&(
        <LoadMoreButton onClick={handleClick} disabled={isLoading}>
          {!isLoading ? 'Load More' : 'Loading...'}
        </LoadMoreButton>
        )}
      </div>
    </Container>
  );
}
