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

// Submit or update like endpoint
// export const addLike = catchAsyncError(async (req, res) => {
//   try {
//     const { userId, like } = req.body;

//     if (!userId || !like) {
//       return res.status(400).json({ message: 'User ID and like are required' });
//     }

//     const existingLike = await Like.findOne({ userId });

//     if (existingLike) {
//       const now = new Date();

//       if (now > existingLike.expirationDate) {
//         return res.status(403).json({ message: 'Voting period has expired' });
//       }

//       // Update like if it's within the allowed time frame
//       existingLike.like = like;
//       existingLike.updatedAt = now;
//       await existingLike.save();

//       return res.status(200).json({ message: 'like updated successfully', like: existingLike });
//     } else {
//       // Create a new like if no previous like exists
//       const expirationDate = calculateExpirationDate();
//       const newLike = await Like.create({ userId, like, expirationDate });

//       return res.status(201).json({ message: 'like submitted successfully', like: newLike });
//     }
//   } catch (error) {
//     return res.status(500).json({ message: 'An error occurred', error: error.message });
//   }

// });

export const likeOrUnlike = catchAsyncError(async (req, res) => {


  const { postId } = req.body
  const { ip } = req

  const postIsExist = await Post.findById(postId)
  if (!postIsExist)
    throw new AppError('post not found', 404)

  const userIsExist = await User.findOne({ ipAddress: ip })
  if (!userIsExist)
    throw new AppError('user not found', 404)


  const isLiked = await Like.findOne({ postId, likedBy: userIsExist._id })

  console.log(postIsExist);

  if (isLiked) {
    isLiked.deleteOne()
    postIsExist.numberOfLikes--;
    await postIsExist.save()
    return res.status(201).json({ message: "unliked success" })
  }
  const like = await Like.create({
    postId,
    likedBy: userIsExist._id
  })
  postIsExist.numberOfLikes++;
  await postIsExist.save()
  return res.status(201).json({ message: "liked success", data: like })

})
