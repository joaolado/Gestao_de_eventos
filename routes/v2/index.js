
const router = require('express').Router();

//const eventsRouter = require('./r_Events');
//const eventsCategoryRouter = require('./r_EventsCategory');
//const orderDetailsRouter = require('./r_OrderDetails');
//const orderedTicketsRouter = require('./r_OrderedTickets');
//const paymentDetailsRouter = require('./r_PaymentDetails');
//const ticketsInfoRouter = require('./r_TicketsInfo');
//const ticketsTypeRouter = require('./r_TicketsType');
const usersRouter = require('./r_Users');
const usersAddressRouter = require('./r_UsersAddress');
const usersPaymentsRouter = require('./r_UsersPayments');

//router.use('/events', eventsRouter);
//router.use('/eventsCategory', eventsCategoryRouter);
//router.use('/orderDetails', orderDetailsRouter);
//router.use('/orderedTickets', orderedTicketsRouter);
//router.use('/paymentDetails', paymentDetailsRouter);
//router.use('/ticketsInfo', ticketsInfoRouter);
//router.use('/ticketsType', ticketsTypeRouter);
router.use('/users', usersRouter);
router.use('/usersAddress', usersAddressRouter);
router.use('/usersPayments', usersPaymentsRouter);

module.exports = router;