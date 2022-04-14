const UserModel = require("../models/userModel");
const validator = require("../validations/validator")
const uploadImage = require("../validations/awsAuth")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


const register = async (req, res) => {
    try {
        const data = req.body;
        const files = req.files;
        const queryParams = req.query;
        //===============validation start ===============
        if (validator.isRequestBody(queryParams)) {
            return res.status(400).send({
                status: false,
                message: "please provide some data in reqest body"
            })
        }

        if (!validator.isRequestBody(data)) {
            return res.status(400).send({
                status: false,
                message: "please provide some data in reqest body"
            })
        }

        const {
            fname,
            lname,
            email,
            phone,
            password
        } = data
        const address = JSON.parse(data.address)
        console.log(address)

        if (!validator.isValid(fname)) {
            return res.status(400).send({
                status: false,
                message: 'please provide first name'
            })
        }

        if (!validator.isValid(lname)) {
            return res.status(400).send({
                status: false,
                message: 'please provide last name'
            })
        }

        if (!validator.isValid(email)) {
            return res.status(400).send({
                status: false,
                message: 'please provide email'
            })
        }

        if (!validator.isValidEmail(email)) {
            return res.status(400).send({
                status: false,
                message: `${email} is not a valid email.`
            });
        }

        if (!files) {
            return res.status(400).send({
                status: false,
                message: "please provide profile image"
            })
        }

        let profileImage = await uploadImage.uploadFile(files[0])

        if (!validator.isValid(phone)) {
            return res.status(400).send({
                status: false,
                message: "please provide phone number"
            })
        }

        if (!validator.isValidPhone(phone)) {
            return res.status(400).send({
                status: false,
                message: "provide valid phone number"
            })
        }


        //check phone number is already exists or not
        const uniquePhoneAndEmail = await UserModel.findOne({
            $or: [{
                email: email,
                phone: phone
            }]
        })
        console.log(uniquePhoneAndEmail)
        if (uniquePhoneAndEmail) {
            if (uniquePhoneAndEmail.email) {
                return res.status(400).send({
                    status: false,
                    message: "already email is exists"
                })
            }

            if (uniquePhoneAndEmail.phone) {
                return res.status(400).send({
                    status: false,
                    message: "already phone number exists"
                })
            }
        }


        if (!validator.isValid(password)) {
            return res.status(400).send({
                status: false,
                message: "please provide password"
            })
        }

        //range of password is 8 to 15
        // if(password.length < 8 && password.length > 15){
        //     return res.status(400).send({ status: false, message: "please provide 8 to 15 " });
        // }

        if (!validator.isValidPassword) {
            return res.status(400).send({
                status: false,
                message: "please provide 8 to 15 "
            });
        }
        const saltRounds = 10
        const EncPassword = await bcrypt.hash(password, saltRounds)


        if (!validator.isValidAddress(address)) {
            return res.status(400).send({
                status: false,
                message: "please provide address"
            })
        } else {
            const {
                shipping,
                billing
            } = address
            if (!validator.isValidAddress(shipping)) {
                return res.status(400).send({
                    status: false,
                    message: "please shipping address"
                })
            } else {
                const {
                    street,
                    city,
                    pincode
                } = shipping
                if (!validator.isValid(street)) {
                    return res.status(400).send({
                        status: false,
                        message: "please shipping street address"
                    })

                }
                if (!validator.isValid(city)) {
                    return res.status(400).send({
                        status: false,
                        message: "please shipping city address"
                    })

                }
                // const pin=Number(pincode)
                if (!validator.isValidPincode(pincode)) {
                    return res.status(400).send({
                        status: false,
                        message: "please shipping pincode like as 123456 "
                    })

                }
            }

            if (!validator.isValidAddress(billing)) {
                return res.status(400).send({
                    status: false,
                    message: "please billing address"
                })
            } else {
                const {
                    street,
                    city,
                    pincode
                } = billing
                if (!validator.isValid(street)) {
                    return res.status(400).send({
                        status: false,
                        message: "please billing street address"
                    })

                }
                if (!validator.isValid(city)) {
                    return res.status(400).send({
                        status: false,
                        message: "please billing city address"
                    })

                }
                if (!validator.isValidPincode(pincode)) {
                    return res.status(400).send({
                        status: false,
                        message: "please billing pincode like as 123456 "
                    })

                }
            }

        }



        let obj = {
            fname,
            lname,
            email,
            password: EncPassword,
            address,
            profileImage,
            phone
        }
        const saveData = await UserModel.create(obj)
        res.status(201).send({
            status: true,
            message: "successfully created",
            data: saveData
        })

    } catch (err) {
        return res.status(500).send({
            status: false,
            message: err.message
        })
    }
}


const login = async (req, res) => {
    try {
        const data = req.body;
        const queryParams = req.query

        if (validator.isRequestBody(queryParams)) {
            return res.status(400).send({
                status: false,
                message: "please provide some data in reqest body"
            })
        }

        if (!validator.isRequestBody(data)) {
            return res.status(400).send({
                status: false,
                message: "please provide some data in reqest body"
            })
        }

        const {
            email,
            password
        } = data
        if (!validator.isRequestBody(email)) {
            return res.status(400).send({
                status: false,
                message: "please provide some email in reqest body"
            })
        }

        if (!validator.isValidEmail(email)) {
            return res.status(400).send({
                status: false,
                message: `${email} is not a valid email.`
            });
        }

        if (!validator.isRequestBody(password)) {
            return res.status(400).send({
                status: false,
                message: "please provide some password in reqest body"
            })
        }

        if (!validator.isValidPassword) {
            return res.status(400).send({
                status: false,
                message: "please provide 8 to 15 "
            });
        }

        const user = await UserModel.findOne({
            email: email
        })
        console.log(user)

        if (!user) {
            return res.status(400).send({
                status: false,
                message: "incorrect email and password"
            })
        }
        const hasPass = user.password
        const decPassword = await bcrypt.compare(password, hasPass)
        if (!decPassword) {
            return res.status(400).send({
                status: false,
                message: "incorrect email and password"
            })
        }
        const userId = user._id
        const token = jwt.sign({
            userId: userId,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 60 * 30
        }, "tujliman")

        res.status(200).send({
            status: true,
            message: "login",
            data: {
                userId,
                token
            }
        })



    } catch (err) {
        return res.status(400).send({
            status: false,
            message: err.message
        })
    }
}

const getProfile = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (userId && userId.length != 24) {
            return res.status(400).send({
                status: false,
                message: "please provide valid userid"
            })
        }

        // if(userId!=req.userId){
        //     return res.status(403).send({status:false,message:"unauthorized user"})
        // }

        const userDetails = await UserModel.findById(userId)
        if (!userDetails) {
            return res.status(404).send({
                status: false,
                message: "not found"
            })
        }

        res.status(200).send({
            status: true,
            message: "fetch details",
            data: userDetails
        })

    } catch (err) {
        return res.status(400).send({
            status: false,
            message: err.message
        })
    }
}

const updateProfile = async (req, res) => {
    try {
        const userId = req.params.userId;
        const files = req.files
        const queryParams = req.query
        const data = req.body;
        const requestBody = JSON.parse(JSON.stringify(data));
        if (userId && userId.length != 24) {
            return res.status(400).send({
                status: false,
                message: "please provide valid userid"
            })
        }

        if (validator.isRequestBody(queryParams)) {
            return res.status(400).send({
                status: false,
                message: "please provide some data in reqest body"
            })
        }

        if (!validator.isRequestBody(data)) {
            return res.status(400).send({
                status: false,
                message: "please provide some data in reqest body"
            })
        }

        const userDetails = await UserModel.findById(userId)
        if (!userDetails) {
            return res.status(404).send({
                status: false,
                message: "not found"
            })
        }

        let updateProduct = {}

        if (files && files.length > 0) {
            let uploadImage = await awsAuth.uploadFile(files[0])
            updateProduct["profileImage"] = uploadImage
        }

        const {
            fname,
            lname,
            email,
            phone,
            password
        } = data

        if (requestBody.hasOwnProperty('fname')) {
            if (!validator.isValid(fname)) {
                return res.status(400).send({
                    status: false,
                    message: 'please provide first name'
                })
            } else {
                updateProduct["fname"] = fname
            }
        }

        if (requestBody.hasOwnProperty("lname")) {
            if (!validator.isValid(lname)) {
                return res.status(400).send({
                    status: false,
                    message: 'please provide last name'
                })
            } else {
                updateProduct["lname"] = lname
            }
        }

        if (requestBody.hasOwnProperty("email")) {
            if (!validator.isValid(email)) {
                return res.status(400).send({
                    status: false,
                    message: 'please provide email'
                })
            }
        }

        if (requestBody.hasOwnProperty("email")) {
            if (!validator.isValidEmail(email)) {
                return res.status(400).send({
                    status: false,
                    message: `${email} is not a valid email.`
                });
            } else {
                updateProduct['email'] = email
            }
        }

        if (requestBody.hasOwnProperty("phone")) {
            if (!validator.isValid(phone)) {
                return res.status(400).send({
                    status: false,
                    message: "please provide phone number"
                })
            }

            if (!validator.isValidPhone(phone)) {
                return res.status(400).send({
                    status: false,
                    message: "provide valid phone number"
                })
            } else {
                updateProduct["phone"] = phone
            }
        }



        //check phone number is already exists or not
        const uniquePhoneAndEmail = await UserModel.findOne({
            $or: [{
                email: email,
                phone: phone
            }]
        })
        console.log(uniquePhoneAndEmail)
        if (uniquePhoneAndEmail) {
            if (uniquePhoneAndEmail.email) {
                return res.status(400).send({
                    status: false,
                    message: "already email is exists"
                })
            }

            if (uniquePhoneAndEmail.phone) {
                return res.status(400).send({
                    status: false,
                    message: "already phone number exists"
                })
            }
        }

        if (requestBody.hasOwnProperty("password")) {
            if (!validator.isValid(password)) {
                return res.status(400).send({
                    status: false,
                    message: "please provide password"
                })
            }
            if (!validator.isValidPassword) {
                return res.status(400).send({
                    status: false,
                    message: "please provide 8 to 15 "
                });
            } else {
                const saltRounds = 10
                const EncPassword = await bcrypt.hash(password, saltRounds)
                updateProduct["password"] = EncPassword
            }
        }
        if (requestBody.hasOwnProperty("address")) {
            const { shipping,billing} = JSON.parse(address);

            if (JSON.parse(address).hasOwnProperty("shipping")) {
                const { street,city,pincode } = shipping;

                if (shipping.hasOwnProperty("street")) {
                    if (!validator.isValid(street)) {
                        return res.status(400).send({
                            status: false,
                            message: " street name for shipping",
                        });
                    } else {
                        updateProduct["address.shipping.street"] = street.trim();
                    }
                }

                if (shipping.hasOwnProperty("city")) {
                    if (!validator.isValid(city)) {
                        return res.status(400).send({
                            status: false,
                            message: " city name for shippin ",
                        });
                    } else {
                        updateProduct["address.shipping.city"] = city.trim();
                    }
                }

                if (shipping.hasOwnProperty("pincode")) {
                    if (!validator.isValidPincode(pincode)) {
                        return res.status(400).send({
                            status: false,
                            message: "pin code for shipping like as 123456 ",
                        });
                    }
                    updateProduct["address.shipping.pincode"] = pincode.trim();
                }
            }

            if (JSON.parse(address).hasOwnProperty("billing")) {
                const { street, city, pincode } = billing;

                if (billing.hasOwnProperty("street")) {
                    if (!isValid(street)) {
                        return res.status(400).send({
                            status: false,
                            message: "billing address: street name should be in valid format ",
                        });
                    } else {
                        updateProduct["address.billing.street"] = street.trim();
                    }
                }

                if (billing.hasOwnProperty("city")) {
                    if (!isValid(city)) {
                        return res.status(400).send({
                            status: false,
                            message: "billing address: city name should be in valid format ",
                        });
                    } else {
                        updateProduct["address.billing.city"] = city.trim();
                    }
                }

                if (billing.hasOwnProperty("pincode")) {
                    if (!validator.isValidAddress(pincode)) {
                        return res.status(400).send({
                            status: false,
                            message: "Billing address: pin code should be valid like: 335659 ",
                        });
                    }

                    updateProduct["address.billing.pincode"] = pincode.trim();
                }
            }
        }

        const updatedProfile = await UserModel.findByIdAndUpdate({
            _id: userId
        }, {
            $set: updateProduct
        }, {
            new: true
        });

        res.status(200).send({
            status: true,
            message: "user profile updated",
            data: updatedProfile,
        });
    } catch (err) {
        return res.status(400).send({
            status: false,
            message: err.message
        })
    }
}


module.exports = {
    register,
    login,
    getProfile,
    updateProfile
}