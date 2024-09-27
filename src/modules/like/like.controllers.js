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

  
  const { postId } = req.body;
  const { ip } = req;

  const postIsExist = await Post.findById(postId);
  if (!postIsExist) {
    throw new AppError('Post not found', 404);
  }
  

  const userIsExist = await User.findOne({ ipAddress: ip });
  if (!userIsExist) {
    throw new AppError('User not found', 404);
  }

  const isLiked = await Like.findOne({ postId, likedBy: userIsExist._id });

  // If the post is already liked, remove the like
  if (isLiked) {
    await isLiked.deleteOne();

    // Ensure numberOfLikes does not go below zero
    if (postIsExist.numberOfLikes > 0) {
      postIsExist.numberOfLikes--;
    }
    await userIsExist.save();
    if (userIsExist.likes.length > 0) {
      // Remove postId from user's likes
      userIsExist.likes.pull(postId);
    }
    await userIsExist.save();

    await postIsExist.save();
    return res.status(201).json({ message: "Unliked successfully" });
  }

  // If the user has already liked 3 posts, prevent them from liking more
  if (userIsExist.likes.length === 3) {
    return res.status(400).json({ message: "User can only react for 3 cars" });
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

