const express = require('express');
const router = express.Router();

const User = require('../models/user');

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

router.get('/', (req, res, next) => {
  User.find()
    // .populate('orders')
    .exec()
    .then(users => {
      res.status(200).json({
        users: users
      });
    })
    .catch(error => {
      res.status(500).json({
        error: error
      });
    });
});

router.post('/signup', (req, res, next) => {
  // Check if email already exists
  User.findOne({ email: req.body.email })
    .exec()
    .then(data => {
      if (!data) {
        // Encrypt password before saving
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            res.status(500).json({
              error: err
            });
          } else {
            const newUser = new User({
              _id: mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });

            // Save user
            newUser
              .save()
              .then(user => {
                res.status(201).json({
                  user: user
                });
              })
              .catch(err => {
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      } else {
        res.status(409).json({
          message: 'Email already exist'
        });
      }
    })
    .catch();
});

router.patch('/', (req, res, next) => {
  const id = req.body.userId;
  const newOrders = [req.body.orderId];

  User.update({ _id: id }, { $set: { usersOrders: [...newOrders] } })
    .exec()
    .then(user => {
      res.status(200).json({
        message: `User ${id} was updated successfully`,
        updatedData: user
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Something went wrong',
        error: error
      });
    });
});

router.delete('/:userId', (req, res, next) => {
  const id = req.params.userId;
  User.remove({ _id: id })
    .exec()
    .then(() => {
      res.status(200).json({
        message: 'User Deleted'
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Something went wrong',
        error: error
      });
    });
});

module.exports = router;
