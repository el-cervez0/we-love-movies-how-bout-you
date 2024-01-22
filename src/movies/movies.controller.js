const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// Check the movie exists and set the return objec to locals
async function movieExists(request, response, next) {
  const movie = await service.read(request.params.movieId)
  if (movie) {
    response.locals.movie = movie;
    return next();
  }
  next({
    status: 404,
    message: `Movie not found: ${request.params.movieId}`
  });
}

async function read(request, response) {
  const { movie: data } = response.locals;
  response.json({ data });
}

// if the path matches /movies?is_showing=true, return only movies that are currently showing
async function list(request, response) {
  if (request.query.is_showing === "true") {
    const data = await service.list(true)
    response.json({ data })
  }
  response.json({ data: await service.list(false)})

}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(movieExists), read],
  movieExists
};
