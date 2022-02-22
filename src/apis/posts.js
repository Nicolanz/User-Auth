import { Router } from "express";
import { DOMAIN } from "../constants";
import { Post, User } from "../models";
import { userAuth } from "../middlewares/auth-guard";
import SlugGenerator from "../functions/slug-generator";
import validator from "../middlewares/validator-middleware";
import { postValidations } from '../validators/post-validators';
import { uploadPostImage as uploader } from "../middlewares/uploader";

const router = Router();

/**
 * @description To upload post image
 * @api /posts/api/post-image-upload
 * @access private
 * @type POST
 */
router.post('/api/post-image-upload', userAuth, uploader.single('image') ,async(req, res)=>{
    try {
        let { file } = req;
        let filename = DOMAIN + "post-images/" + file.filename;
        
        return res.status(200).json({
            filename,
            success: true,
            message: "Image uploded successfully"
        })
    } catch (err){
        return res.status(400).json({
            success: false,
            message: "Unable to updload the post"
        });
    }
});


/**
 * @description To create new post by auth user
 * @api /posts/api/create-post
 * @access private
 * @type POST
 */
router.post('/api/create-post', userAuth, postValidations, validator ,async( req, res)=>{
    try {
        let { body } = req;
        let post = new Post({
            author: req.user._id,
            ...body,
            slug: SlugGenerator(body.title)
        });
        await post.save();
        // console.log("New Post", post);
        return res.status(201).json({
            post,
            success: true,
            message: "Your post is published!"           
        })
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: "Unable to create the post"
        });
    }
});

/**
 * @description To update new post by auth user
 * @api /posts/api/update-post
 * @access private
 * @type PUT
 */
router.put('/api/update-post/:id', userAuth, postValidations, validator, async(req, res)=>{
    try {
        let { id } = req.params;
        let { user, body } = req;
        
        let post = await Post.findById(id);
        if(!post){
            return res.status(404).json({
                success: false,
                message: "Post not found."
            });
        }
        if (post.author.toString() !== user._id.toString()){
            return res.status(401).json({
                success: false,
                message: "Post does not belong to you"
            });
        }

        post = await Post.findOneAndUpdate({ author: user._id, _id: id },
        {
            author: req.user._id,
            ...body,
            slug: SlugGenerator(body.title)
        },
        {
            new: true
        });

        return res.status(200).json({
            post,
            success: true,
            message: "Post updated successfully"
        });

    } catch (err){
        return res.status(400).json({
            success: false,
            message: "Unable to update the post"
        });
    }
});

/**
 * @description To update new post by auth user
 * @api /posts/api/update-post
 * @access private
 * @type PUT
 */
 router.put('/api/like-post/:id', userAuth, async(req, res)=>{
     try { 
        let { id } = req.params;
        let post = await Post.findById(id);

        if(!post){
            return res.status(404).json({
                success: false,
                message: "Post not found."
            });
        }

        let user = post.likes.user.map((id) => id.toString());
        if (user.includes(req.user._id.toString())){
            return res.status(404).json({
                success: false,
                message: "You have already liked this posts"
            });
        }

        post = await Post.findOneAndUpdate({ _id: id,}, {
            likes: { count: post.likes.count + 1,
                user: [...post.likes.user, req.user._id]
            },
        }, { new: true });
        
        console.log(post);
        return res.status(200).json({
            success: true,
            message: "You liked this post"
        });

     } catch (err){
         console.log(err);
        return res.status(401).json({
            success: false,
            message: "Unable to like post. Please try again later"
        });
     }
 });

export default router;
