
const router = require('express').Router();
const eventsRouter = require('./r_Events');

router.use('/events', eventsRouter);

module.exports = router;