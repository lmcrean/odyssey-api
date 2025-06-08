// MessageDetailSendForm.test.js

import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { axiosReq } from "../../../api/axiosDefaults";
import MessageDetailSendForm from "../MessageDetailSendForm";
import { MemoryRouter, Route } from "react-router-dom";

// Mock axiosReq
jest.mock("../../../api/axiosDefaults");

// Mock useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    id: '2',
  }),
}));

// Mock FontAwesomeIcon
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => <span>Icon</span>,
}));

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'mocked-url');

describe("MessageDetailSendForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should submit a message with image successfully", async () => {
    axiosReq.post.mockResolvedValue({
      data: {
        id: 1,
        sender: 1,
        recipient: 2,
        content: 'Test message with image',
        image: 'https://res.cloudinary.com/yourcloudname/image/upload/testimage.jpg',
        date: '2024-08-27',
        time: '12:00',
        read: false,
        sender_profile_image: 'https://res.cloudinary.com/yourcloudname/image/upload/senderimage.jpg',
        recipient_profile_image: 'https://res.cloudinary.com/yourcloudname/image/upload/recipientimage.jpg',
        is_sender: true,
        last_message: 'Test message with image',
        last_message_time: '12:00'
      }
    });

    render(
      <MemoryRouter initialEntries={["/messages/2"]}>
        <Route path="/messages/:id">
          <MessageDetailSendForm setMessages={jest.fn()} />
        </Route>
      </MemoryRouter>
    );

    // Simulate typing in the message
    fireEvent.change(screen.getByPlaceholderText("Type your message here..."), {
      target: { value: "Test message with image" }
    });

    // Simulate selecting an image file
    const file = new File(["image-content"], "test-image.jpg", { type: "image/jpeg" });
    const fileInput = screen.getByLabelText(/Add Image/i);
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Simulate clicking the send button
    fireEvent.click(screen.getByText(/Send/i));

    // Wait for axiosReq.post to be called
    await waitFor(() => expect(axiosReq.post).toHaveBeenCalledTimes(1));

    // Check if axiosReq.post was called with the correct parameters
    expect(axiosReq.post).toHaveBeenCalledWith(
      "/messages/2/send/",
      expect.any(FormData),
      expect.objectContaining({
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
    );

    // Verify FormData contents
    const calledFormData = axiosReq.post.mock.calls[0][1];
    expect(calledFormData.get("content")).toBe("Test message with image");
    expect(calledFormData.get("image")).toEqual(file);
  });
});