const Joi = require("joi");

module.exports.ListingSchema = Joi.object({ // Means we are expecting an object in joi named as listing 
    listing : Joi.object({
        title : Joi.string().required(),
        description : Joi.string().required(),
        image : Joi.object({
            url: Joi.string()
        }),
        location : Joi.string().required(),
        country : Joi.string().required(),
        price : Joi.number().required().min(0),
        category: Joi.string().required(),
        updated_at: Joi.number()
    })
})


module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required()
})
