// src/mocks/handlers.js

import { rest } from "msw";

const baseURL = "https://odyssey-api-f3455553b29d.herokuapp.com/";

export const handlers = [
  rest.get(`${baseURL}dj-rest-auth/user/`, (req, res, ctx) => {
    return res(
      ctx.json({
        pk: 2,
        username: "brian",
        email: "",
        first_name: "",
        last_name: "",
        profile_id: 2,
        profile_image:
          "https://res.cloudinary.com/dgjrrvdbl/image/upload/v1/media/../default_profile_dqcubz",
      })
    );
  }),
  rest.post(`${baseURL}dj-rest-auth/logout/`, (req, res, ctx) => {
    return res(ctx.status(200));
  }),

  rest.get(`${baseURL}users/:userId/`, (req, res, ctx) => {
    const { userId } = req.params;
    return res(
      ctx.json({
        pk: parseInt(userId),
        username: `user${userId}`,
        profile_id: parseInt(userId),
        profile_image: "https://res.cloudinary.com/dgjrrvdbl/image/upload/v1/media/../default_profile_dqcubz",
      })
    );
  }),
];
