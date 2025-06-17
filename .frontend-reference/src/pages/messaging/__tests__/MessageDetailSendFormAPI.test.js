import axios from 'axios';

jest.mock('axios');

describe('Message Sending API', () => {
  it('should send a message with image to the correct endpoint', async () => {
    // Mock axios.post success response
    axios.post.mockResolvedValue({
      data: {
        id: 124,
        sender: 25,
        recipient: 29,
        content: "hi there",
        image: "https://res.cloudinary.com/dh5lpihx1/image/upload/v1724759563/oksprn7ze6hvps9fbore.jpg",
        date: "27 Aug 2024",
        time: "11:52",
        read: false,
        sender_profile_image: "https://res.cloudinary.com/dh5lpihx1/image/upload/v1/media/images/default_profile_dqcubz.jpg",
        recipient_profile_image: "https://res.cloudinary.com/dh5lpihx1/image/upload/v1/media/images/default_profile_dqcubz.jpg",
        is_sender: true,
        last_message: "hi there",
        last_message_time: "11:52"
      }
    });

    // Create a mock FormData object
    const mockFormData = new FormData();
    mockFormData.append('content', 'hi there');
    mockFormData.append('image', new File([''], 'test_image.jpg', { type: 'image/jpeg' }));

    // Make the API call
    const response = await axios.post(
      'https://odyssey-api-f3455553b29d.herokuapp.com/messages/29/send/',
      mockFormData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    // Assertions
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      'https://odyssey-api-f3455553b29d.herokuapp.com/messages/29/send/',
      expect.any(FormData),
      expect.objectContaining({
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    );

    // Check the response
    expect(response.data).toEqual(expect.objectContaining({
      id: expect.any(Number),
      sender: expect.any(Number),
      recipient: expect.any(Number),
      content: 'hi there',
      image: expect.stringContaining('https://res.cloudinary.com'),
      date: expect.any(String),
      time: expect.any(String),
      read: expect.any(Boolean),
      sender_profile_image: expect.stringContaining('https://res.cloudinary.com'),
      recipient_profile_image: expect.stringContaining('https://res.cloudinary.com'),
      is_sender: expect.any(Boolean),
      last_message: expect.any(String),
      last_message_time: expect.any(String)
    }));
  });
});