import { EndpointTest } from '../types';

export const odysseyEndpoints: EndpointTest[] = [
  {
    name: 'API Root',
    method: 'GET',
    endpoint: '/',
    description: 'Get API root information',
  },
  {
    name: 'Posts List',
    method: 'GET',
    endpoint: '/posts/',
    description: 'Get all posts with pagination',
  },
  {
    name: 'Create Post',
    method: 'POST',
    endpoint: '/posts/',
    description: 'Create a new post',
    requiresAuth: true,
    sampleData: {
      title: 'Test Post',
      content: 'This is a test post content.',
    },
  },
  {
    name: 'Profiles List',
    method: 'GET',
    endpoint: '/profiles/',
    description: 'Get all user profiles',
  },
  {
    name: 'Messages List',
    method: 'GET',
    endpoint: '/messages/',
    description: 'Get user messages',
    requiresAuth: true,
  },
  {
    name: 'Comments List',
    method: 'GET',
    endpoint: '/comments/',
    description: 'Get all comments',
  },
  {
    name: 'Login',
    method: 'POST',
    endpoint: '/dj-rest-auth/login/',
    description: 'User login',
    sampleData: {
      username: 'testuser',
      password: 'testpass123',
    },
  },
  {
    name: 'Register',
    method: 'POST',
    endpoint: '/dj-rest-auth/registration/',
    description: 'User registration',
    sampleData: {
      username: 'newuser',
      email: 'newuser@example.com',
      password1: 'testpass123',
      password2: 'testpass123',
    },
  },
]; 