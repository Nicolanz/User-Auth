import multer from "multer";

const filename = (req, file, next)=>{
    let lastIndexof = file.originalname.lastIndexOf(".");
    let ext = file.originalname.substring(lastIndexof);
    next(null, `img-${Date.now()}${ext}`);
}

const destination = (req, res, next) => {
    next(null, `${__dirname}/../uploads`);
}

const postImageDestination = (req, res, next) => {
    next(null, `${__dirname}/../uploads/post-images`);
}

export const uploadPostImage = multer({
    storage: multer.diskStorage({
        destination: postImageDestination,
        filename
    }),
});

export const uploader = multer({
    storage: multer.diskStorage({
        destination,
        filename
    }),
});
