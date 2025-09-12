const Listing = require("../models/listings");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// Main Page that shows all the listings
module.exports.index = async (req, res) => {
  let {category,search} = req.query;
  if (category) {
    const allListings = await Listing.find({category: category})
    return res.render("listings/index.ejs", { allListings });
  }
  if (search) {
    
    const allListings = await Listing.find({
    $or: [
      { location: { $regex: search, $options: "i" } },
      { country: { $regex: search, $options: "i" } }
    ]
  })
    return res.render("listings/index.ejs", { allListings });
  }
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

// Render a form to create new lisitng - GET
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// Show a particular listing - GET
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you are trying to access does not exist");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

// Adds a new listing to DataBase - POST
module.exports.createListing = async (req, res) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();
  let url = req.file.path;
  let filename = req.file.filename;
  let listing = new Listing(req.body.listing);
  listing.owner = req.user._id;
  listing.image = { filename, url };
  listing.geometry = response.body.features[0].geometry
  await listing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

// Renders the edit form - GET
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/q_40,w_250/");

  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

// Update a listing - PUT
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if(response){
    listing.geometry = response.body.features[0].geometry
  }
  listing.updated_at = Date.now();
  await listing.save();
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { filename, url };
    await listing.save();
  }
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

// Delete a listing - DELETE
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
