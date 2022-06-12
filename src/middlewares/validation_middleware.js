const {body} = require('express-validator')


const validateNewUser = () => {
    return  [
        body('email')
            .trim()
            .isEmail().withMessage('Geçerli bir mail giriniz.'),
            
        body('password').trim()
           .isLength({ min: 6 }).withMessage('Şifre en az 6 karakter olmalıdır.')
           .isLength({ max: 25 }).withMessage('Bu kadar uzun şifre olmaz.'),
        
        body('firstName').trim()
           .isLength({ min: 2 }).withMessage('İsim en az 2 karakter olmalıdır.')
           .isLength({ max: 50 }).withMessage('Bu kadar uzun isim olamaz.'),
           
        body('lastName').trim()
           .isLength({ min: 2 }).withMessage('Soyisim en az 2 karakter olmalıdır.')
           .isLength({ max: 50 }).withMessage('Bu kadar uzun soyisim olamaz.'),
           
        body('rePassword').trim().custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Şifreler aynı değil!')
            }
            return true
        })
             
    ]
}

const validateNewPassword = () => {
    return  [
        
        body('password').trim()
           .isLength({ min: 6 }).withMessage('Şifre en az 6 karakter olmalıdır.')
           .isLength({ max: 25 }).withMessage('Bu kadar uzun şifre olmaz.'),
        
        body('rePassword').trim().custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Şifreler aynı değil!')
            }
            return true
        })
             
    ]
}

const validateLogin = () => {
    return  [
        body('email')
            .trim()
            .isEmail().withMessage('Geçerli bir mail giriniz.'),
            
        body('password').trim()
           .isLength({ min: 6 }).withMessage('Şifre en az 6 karakter olmalıdır.')
           .isLength({ max: 25 }).withMessage('Bu kadar uzun şifre olmaz.')
    ]
}

const validateEmail = () => {
    return  [
        body('email')
            .trim()
            .isEmail().withMessage('Geçerli bir mail giriniz.')
    ]
}

const validateNewMovie = () => {
    return  [
        body('movieName')
           .isLength({ min: 1 }).withMessage('Lütfen bir film ismi giriniz.'),

        body('directorName')
           .isLength({ max: 30 }).withMessage('Bu kadar uzun yönetmen ismi olmaz.'),

        
        body('kind')
           .isLength({ max: 30 }).withMessage('Bu kadar uzun yönetmen ismi olmaz.'),   
    ]
}

const validateNewBook = () => {
    return  [
        body('bookName')
           .isLength({ min: 1 }).withMessage('Lütfen bir kitap ismi giriniz.'),

        body('writerName')
           .isLength({ max: 30 }).withMessage('Bu kadar uzun yazar ismi olmaz.'),

        
        body('genre')
           .isLength({ max: 30 }).withMessage('Bu kadar uzun tür ismi olmaz.'),   
    ]
}

const validateNewSpecialDay = () => {
    return  [
        body('dayName')
           .isLength({ min: 1 }).withMessage('Lütfen bir gün ismi giriniz.'),

        body('importance')
           .isLength({ max: 30 }).withMessage('Sizin için önemi çok olabilir ama malesef bu kadar uzun bir metni kaydedemeyiz. Şimdilik veritabanımızda değil kalbinizde saklı kalsın. Lütfen daha kısa tutun.'),

        
        body('date')
           .isLength({ max: 12 }).withMessage('Bu kadar uzun tarih olmaz.'),   
    ]
}

const validateNewPerson = () => {
    return  [
        body('personName')
           .isLength({ min: 1 }).withMessage('Lütfen bir kişi ismi giriniz.'),

        body('phone').trim()
           .isLength({ max: 11 }).withMessage('Geçersiz Numara')
           .isLength({ min: 11 }).withMessage('Telefon numarası en az 11 karakter olmalıdır.'),
        
        body('others')
           .isLength({ max: 1000 }).withMessage('Bu kadar da uzun bilgi olmaz.'),   
    ]
}

module.exports = {
    validateNewUser,
    validateLogin,
    validateEmail,
    validateNewPassword,
    validateNewMovie,
    validateNewBook,
    validateNewSpecialDay,
    validateNewPerson  
};