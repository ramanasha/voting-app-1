import Joi from 'joi';

const pollOption = Joi.string()
  .min(1)
  .max(50)
    .options({
      language: {
        string: {
          min: "Option title should be at least 1 chars long",
          max: "Option title should be no more than 255 chars long"
        }
      }
    });

const validators = {
  firstLastName: Joi.string().regex(/^([a-zA-Z\s\.\']{2,30}\s*)+$/).allow(''),
  email: Joi.string().email().required(),
  objectId: Joi.string().hex().required(),
  pollTitle: Joi.string().required().min(2).max(50),
  pollOption: pollOption,
  pollOptions: Joi.array()
    .items(pollOption)
    .min(1)
    .max(10)
      .options({
        language: {
          array: {
            min: "should contain at least two items",
            max: "should contain no more than 10 items"
          }
        }
      })
      .label("Options")
}

export default {
  /* Authentication */
  // POST /api/auth/login
  login: {
    body: {
      email: validators.email,
      password: Joi.string().required()
    }
  },

  // POST /api/auth/register
  register: {
    body: {
      email: validators.email,
      password: Joi.string().min(6).max(20).required(),
      confirmPassword: Joi.any().valid(Joi.ref('password')).required().options({ language: { any: { allowOnly: 'does not match password' } } }),
      firstName: validators.firstLastName,
      lastName: validators.firstLastName
    }
  },

  // POST /api/auth/forgot
  // forgot: {
  //   body: {
  //     email: Joi.string().email().required()
  //   }
  // },

  // POST /api/auth/reset/:token
  // resetPassword: {
  //   body: {
  //     password: Joi.string().min(6).max(20).required(),
  //     confirmPassword: Joi.any().valid(Joi.ref('password')).required().options({ language: { any: { allowOnly: 'does not match password' } } })
  //   },
  //   params: {
  //     token: Joi.string().hex().required()
  //   }
  // },

  /* Account */
  // POST /api/account
  updateAccount: {
    body: Joi.object().keys({
      email: validators.email,
      firstName: validators.firstLastName,
      lastName: validators.firstLastName,
      password: Joi.string().min(6).max(20).allow(''),
      confirmPassword: Joi.any().valid(Joi.ref('password')).options({ language: { any: { allowOnly: 'does not match password' } } }).label('Confirmation Password'),
    }).with('password', 'confirmPassword')
  },

  /* Polls */
  // POST /api/manage/polls
  createPoll: {
    body: {
      title: validators.pollTitle,
      options: validators.pollOptions
    }
  },

  // GET /api/manage/polls/:pollId
  getPoll: {
    params: {
      pollId: validators.objectId
    }
  },

  // DELETE /api/manage/polls/:pollId
  deletePoll: {
    params: {
      pollId: validators.objectId
    }
  },

  // PUT /api/manage/polls/:pollId
  updatePoll: {
    body: {
      title: validators.pollTitle
    },
    params: {
      pollId: validators.objectId
    }
  },

  // POST /api/manage/polls/:pollId/options
  createPollOptions: {
    body: {
      options: validators.pollOptions
    },
    params: {
      pollId: validators.objectId
    }
  },

  /* Public */
  // GET /api/polls/:pollId/vote/:optionId
  votePoll: {
    params: {
      pollId: validators.objectId,
      optionId: validators.objectId
    }
  },

};
