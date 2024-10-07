import Event from "../../../db/models/event.model.js";
import { Like } from "../../../db/models/like.model.js";
import Post from "../../../db/models/post.model.js";
import User from "../../../db/models/user.model.js";
import { AppError, catchAsyncError } from "../../utilies/error.js";

// Helper function to calculate expiration date (e.g., 7 days from now)
const calculateExpirationDate = () => {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 7); // Set expiry to 7 days later
  return expirationDate;
};

export const likeOrUnlike = catchAsyncError(async (req, res, next) => {
  const { postId  } = req.body;
  const { eventId } = req.params;
  const { ip } = req;

  // Fetch the event by eventId
  const event = await Event.findById(eventId);
  if (!event) {
    throw new AppError('Event not found', 404);
  }

  const start = new Date(event.startTime);
  const end = new Date(event.endTime);
  const currentTime = new Date();
  if (currentTime < start) {
    return res.status(400).json({ message: 'The event has not started yet.' });
  }

  // Check if the event has expired
  if (currentTime > end) {
    return res.status(400).json({ message: 'The event has already ended.' });
  }

  // Ensure the post exists
  const postIsExist = await Post.findById(postId);
  if (!postIsExist) {
    throw new AppError('Post not found', 404);
  }

  // Ensure the user exists by their IP address
  const userIsExist = await User.findOne({ ipAddress: ip });
  if (!userIsExist) {
    throw new AppError('User not found', 404);
  }

  // Maximum likes for the event
  const maxLikes = event.number_of_allowed_likes;

  // Check if the post is already liked by the user
  const isLiked = await Like.findOne({ postId, likedBy: userIsExist._id });

  // If the post is already liked, remove the like
  if (isLiked) {
    await isLiked.deleteOne();

    // Ensure numberOfLikes does not go below zero
    if (postIsExist.numberOfLikes > 0) {
      postIsExist.numberOfLikes--;
    }
    await postIsExist.save();

    // Remove postId from user's likes
    if (userIsExist.likes.length > 0) {
      userIsExist.likes.pull(postId);
    }
    await userIsExist.save();

    return res.status(201).json({ message: "Unliked successfully" });
  }

  // Check if the user has exceeded the allowed likes for the event
  if (userIsExist.likes.length >= maxLikes) {
    return res.status(400).json({ message: `You can only like ${maxLikes} car` });
  }

  // Create a new like
  const like = await Like.create({
    postId,
    likedBy: userIsExist._id
  });

  // Increment the number of likes for the post
  postIsExist.numberOfLikes++;
  await postIsExist.save();

  // Add the liked post to the user's likes array
  userIsExist.likes.push(postId);
  await userIsExist.save();

  return res.status(201).json({ message: "Liked successfully", data: like });
});
