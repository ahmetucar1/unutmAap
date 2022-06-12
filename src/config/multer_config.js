const multer = require('multer')
const path = require('path')

const myStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads/avatar"))
    },

    filename: (req, file, cb) => {
        
        cb(null, req.user.email + "" + path.extname(file.originalname))
    }
})

const photoFileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const uploadPhoto = multer({ storage: myStorage, fileFilter: photoFileFilter})

module.exports = uploadPhoto; 