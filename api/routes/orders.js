const express = require('express');
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

// Orders route setup
const router = express.Router();

router.get('/', (req, res, next) => {
  Order.find()
    .select('_id productId quantity')
    .populate('productId', 'name price')
    .exec()
    .then(orders => {
      res.status(200).json({
        message: 'Orders were fetched',
        totalOrders: orders.length,
        orders: orders
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Internal Error',
        error: error
      });
    });
});

router.post('/', (req, res, next) => {
  const product = req.body.productId;
  Product.findById(product)
    .exec()
    .then(data => {
      if (!data) {
        res.status(404).json({
          message: 'Non-existent product'
        });
      } else {
        const newOrder = new Order({
          _id: mongoose.Types.ObjectId(),
          productId: product,
          quantity: req.body.quantity
        });

        newOrder
          .save()
          .then(data => {
            res.status(201).json({
              message: 'Post request in orders worked',
              order: data
            });
          })
          .catch(error => {
            res.status(500).json({
              message: "Data wasn't saved",
              error: error
            });
          });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Something went wrong',
        error: error
      });
    });
});

// Single order request
router.get('/:orderId', (req, res, next) => {
  const id = req.params.orderId;
  Order.findById(id)
    .select('_id productId quantity')
    .populate('productId', 'name price')
    .exec()
    .then(data => {
      if (!data) {
        res.status(404).json({
          message: 'Order does not exit'
        });
      } else {
        res.status(200).json({
          message: 'Single order fetched',
          order: data
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Internal Error Occured',
        error: error
      });
    });
});

router.delete('/:orderId', (req, res, next) => {
  const id = req.params.orderId;
  Order.remove({ _id: id })
    .exec()
    .then(data => {
      res.status(200).json({
        message: `Order Deleted`
      });
    })
    .catch(error => {
      res.status(500).json({
        message: `Internal Error`,
        error: error
      });
    });
});

module.exports = router;
