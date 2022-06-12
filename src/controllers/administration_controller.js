const { validationResult } = require('express-validator')
const { title } = require('process')
const User = require('../model/user_model')
const Movie = require('../model/movie_model')
const Book = require('../model/book_model')
const Day = require('../model/day_model')
const Person = require('../model/person_model')
const Anything = require('../model/anythings_model')
const Offer = require('../model/offer_model')


const showHomePage = function (req, res, next) {
    res.render('welcome', { user:req.user, layout: './layout/administration_layout.ejs', title:'Hoşgeldiniz'})
}

const showProfilePage = function (req, res, next) {
    res.render('profile', { user:req.user, layout: './layout/administration_layout.ejs', title:'Profil'})
    
}

const profileUpdate = async function (req, res, next) {
    
   const updateInformantions = {
       firstName: req.body.firstName,
       lastName: req.body.lastName
   }

   try {
       if (req.file) { 
            updateInformantions.avatar = req.file.filename;
       } 
        
       const result = await User.findByIdAndUpdate(req.user.id, updateInformantions)

       if (result) {
           res.redirect('/administration/profile')
       }
      
    } catch (hata) {
       console.log(hata)
   }

}

const showMoviesPage = function (req, res, next) {
  
    res.render('movies', {user:req.user, layout: './layout/administration_layout.ejs', title:'Hoşgeldiniz'})
}

const saveMovies = async function (req, res, next) {

    const errors = validationResult(req)
    if(!errors.isEmpty()) {

        req.flash('validation_error', errors.array())
        req.flash('createdAt', req.user.createdAt)
        req.flash('movieName', req.body.movieName)
        req.flash('directorName', req.body.directorName)
        req.flash('kind', req.body.kind)
        res.redirect('/administration/movies')
         
    } else { 
        const newMovie = Movie({
            createdAt:req.user.createdAt,
            movieName:req.body.movieName,
            directorName:req.body.directorName,
            kind:req.body.kind
        
        })
       await newMovie.save()
       console.log(newMovie)
       req.flash('success_message', [{msg : `${req.body.movieName} isimli film kaydedildi. Filmlerinden kontrol edebilirsin.`}])
       res.redirect('/administration/movies')
 }

}

const showMyMovies = function (req, res, next) {
    
    Movie.find({createdAt:req.user.createdAt}, function(err, movies) {
    res.render('my-movies', {user:req.user, moviesList:movies, layout: './layout/administration_layout.ejs', title:'Hoşgeldiniz'})})
     
}

const removeMyMovies = function(req, res, next) {
    
    Movie.findOneAndRemove({_id:req.params._id}, function(err) {
        if (err) {
            console.log('silmede hata var')
        }
        req.flash('success_message', [{msg : 'Film Silindi'}])
        res.redirect('/administration/my-movies')
    })
}

const showBooksPage = function (req, res, next) {
  
    res.render('books', {user:req.user, layout: './layout/administration_layout.ejs', title:'Hoşgeldiniz'})
}

const saveBooks = async function (req, res, next) {

    const errors = validationResult(req)
    if(!errors.isEmpty()) {

        req.flash('validation_error', errors.array())
        req.flash('createdAt', req.user.createdAt)
        req.flash('bookName', req.body.bookName)
        req.flash('writerName', req.body.writerName)
        req.flash('genre', req.body.genre)
        res.redirect('/administration/books')
         
    } else { 
        const newBook = Book({
            createdAt:req.user.createdAt,
            bookName:req.body.bookName,
            writerName:req.body.writerName,
            genre:req.body.genre
        
        })
       await newBook.save()
       console.log(newBook)
       req.flash('success_message', [{msg : `${req.body.bookName} isimli kitap kaydedildi. Kitaplarından kontrol edebilirsin.`}])
       res.redirect('/administration/books')
 }

}

const showMyBooks = function (req, res, next) {
    
    Book.find({createdAt:req.user.createdAt}, function(err, books) {
    res.render('my-books', {user:req.user, booksList:books, layout: './layout/administration_layout.ejs', title:'Hoşgeldiniz'})})
     
}

const removeMyBooks = function(req, res, next) {
    
    Book.findOneAndRemove({_id:req.params._id}, function(err) {
        if (err) {
            console.log('silmede hata var')
        }
        req.flash('success_message', [{msg : 'Kitap Silindi'}])
        res.redirect('/administration/my-books')
    })
}

const showDaysPage = function (req, res, next) {
  
    res.render('days', {user:req.user, layout: './layout/administration_layout.ejs', title:'Hoşgeldiniz'})
}

const saveDays = async function (req, res, next) {

    const errors = validationResult(req)
    if(!errors.isEmpty()) {

        req.flash('validation_error', errors.array())
        req.flash('createdAt', req.user.createdAt)
        req.flash('dayName', req.body.dayName)
        req.flash('importance', req.body.importance)
        req.flash('date', req.body.date)
        res.redirect('/administration/days')
         
    } else { 
        const newDay = Day({
            createdAt:req.user.createdAt,
            dayName:req.body.dayName,
            importance:req.body.importance,
            date:req.body.date
        
        })
       await newDay.save()
       console.log(newDay)
       req.flash('success_message', [{msg : `${req.body.dayName} isimli gün kaydedildi. Özel Günlerinden kontrol edebilirsin.`}])
       res.redirect('/administration/days')
 }

}

const showMyDays = function (req, res, next) {
    
    Day.find({createdAt:req.user.createdAt}, function(err, days) {
    res.render('my-days', {user:req.user, daysList:days, layout: './layout/administration_layout.ejs', title:'Hoşgeldiniz'})})
     
}

const removeMyDays = function(req, res, next) {
    
    Day.findOneAndRemove({_id:req.params._id}, function(err) {
        if (err) {
            console.log('silmede hata var')
        }
        req.flash('success_message', [{msg : 'Özel Gün Silindi'}])
        res.redirect('/administration/my-days')
    })
}

const showPersonsPage = function (req, res, next) {
  
    res.render('persons', {user:req.user, layout: './layout/administration_layout.ejs', title:'Hoşgeldiniz'})
}

const savePersons = async function (req, res, next) {

    const errors = validationResult(req)
    if(!errors.isEmpty()) {

        req.flash('validation_error', errors.array())
        req.flash('createdAt', req.user.createdAt)
        req.flash('personName', req.body.personName)
        req.flash('phone', req.body.phone)
        req.flash('other', req.body.other)
        res.redirect('/administration/persons')
         
    } else { 
        const newPerson = Person({
            createdAt:req.user.createdAt,
            personName:req.body.personName,
            phone:req.body.phone,
            other:req.body.other
        
        })
       await newPerson.save()
       console.log(newPerson)
       req.flash('success_message', [{msg : `${req.body.personName} isimli kişi kaydedildi. Kişilerinden kontrol edebilirsin.`}])
       res.redirect('/administration/persons')
 }

}

const showMyPersons = function (req, res, next) {
    
    Person.find({createdAt:req.user.createdAt}, function(err, persons) {
    res.render('my-persons', {user:req.user, personsList:persons, layout: './layout/administration_layout.ejs', title:'Hoşgeldiniz'})})
     
}

const removeMyPersons = function(req, res, next) {
    
    Person.findOneAndRemove({_id:req.params._id}, function(err) {
        if (err) {
            console.log('silmede hata var')
        }
        req.flash('success_message', [{msg : 'Kişi Silindi'}])
        res.redirect('/administration/my-persons')
    })
}

const showAnythingsPage = function (req, res, next) {
  
    res.render('anythings', {user:req.user, layout: './layout/administration_layout.ejs', title:'Hoşgeldiniz'})
}

const saveAnythings = async function (req, res, next) {

    const errors = validationResult(req)
    if(!errors.isEmpty()) {

        req.flash('validation_error', errors.array())
        req.flash('createdAt', req.user.createdAt)
        req.flash('anythingName', req.body.anythingName)
        req.flash('anything', req.body.anything)
        req.flash('date', req.body.date)
        res.redirect('/administration/anythings')
         
    } else { 
        const newAnything = Anything({
            createdAt:req.user.createdAt,
            anythingName:req.body.anythingName,
            anything:req.body.anything,
            date:req.body.date
        
        })
       await newAnything.save()
       console.log(newAnything)
       req.flash('success_message', [{msg : `${req.body.anythingName} isimli herhangi bir şey kaydedildi. Herhangi Bir Şeylerinden kontrol edebilirsin.`}])
       res.redirect('/administration/anythings')
 }

}

const showMyAnythings = function (req, res, next) {
    
    Anything.find({createdAt:req.user.createdAt}, function(err, anythings) {
    res.render('my-anythings', {user:req.user, anythingsList:anythings, layout: './layout/administration_layout.ejs', title:'Hoşgeldiniz'})})
     
}

const removeMyAnythings = function(req, res, next) {
    
    Anything.findOneAndRemove({_id:req.params._id}, function(err) {
        if (err) {
            console.log('silmede hata var')
        }
        req.flash('success_message', [{msg : 'Herhangi bir şeyiniz silindi.'}])
        res.redirect('/administration/my-anythings')
    })
}

const showOffersPage = function (req, res, next) {
  
    res.render('offers', {user:req.user, layout: './layout/administration_layout.ejs', title:'Hoşgeldiniz'})
}

const saveOffers = async function (req, res, next) {

    const errors = validationResult(req)
    if(!errors.isEmpty()) {

        req.flash('validation_error', errors.array())
        req.flash('createdAt', req.user.createdAt)
        req.flash('email', req.body.email)
        req.flash('offer', req.body.offer)
        res.redirect('/administration/offers')
         
    } else { 
        const newOffer = Offer({
            createdAt:req.user.createdAt,
            email:req.body.email,
            offer:req.body.offer
        })
       await newOffer.save()
       console.log(newOffer)
       req.flash('success_message', [{msg : 'Teşekkürler! Önerdiklerini dikkate alacağız ve eklediğin email ile sana ulaşacağız.'}])
       res.redirect('/administration/offers')
 }

}

module.exports = {
    showHomePage,
    showProfilePage,
    profileUpdate,
    showMoviesPage,
    saveMovies,
    showMyMovies,
    removeMyMovies,
    showBooksPage,
    saveBooks,
    showMyBooks,
    removeMyBooks,
    showDaysPage,
    saveDays,
    showMyDays,
    removeMyDays,
    showPersonsPage,
    savePersons,
    showMyPersons,
    removeMyPersons,
    showAnythingsPage,
    saveAnythings,
    showMyAnythings,
    removeMyAnythings,
    showOffersPage,
    saveOffers  
};