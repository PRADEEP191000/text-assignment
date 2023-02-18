const userModel = require("../models/userModel.js")
const validation = require("../validation/validator")
const aws = require("../Aws/aws.js")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')


const createUser = async function (req, res) {
    try {
        let data = req.body;
        let { fname, lname, email, password, phone, address } = data
        let files = req.files

        if (validation.isValidBody(data)) return res.status(400).send({ status: false, msg: "please provide  details" })

        if (!validation.isValid(fname)) return res.status(400).send({ status: false, message: "first name is required" })

        if (!validation.isValidName(fname)) return res.status(400).send({ status: false, message: "first name is not valid" })

        if (!validation.isValid(lname)) return res.status(400).send({ status: false, message: "last name is required" })
        if (!validation.isValidName(lname)) return res.status(400).send({ status: false, message: "last name is not valid" })


        if (!validation.isValid(email)) return res.status(400).send({ status: false, message: "email is required" })
        if (!validation.isValidEmail(email)) return res.status(400).send({ status: false, message: "email is not valid" })
        let checkEmail = await userModel.findOne({ email: email })
        if (checkEmail) return res.status(409).send({ status: false, msg: "email already exist" })

        if (!validation.isValid(phone)) return res.status(400).send({ status: false, message: "phone is required" })
        if (!validation.isValidPhone(phone)) return res.status(400).send({ status: false, message: "phone number is not valid" })
        let checkPhone = await userModel.findOne({ phone: phone })
        if (checkPhone) return res.status(409).send({ status: false, msg: "Phone already exist" })


        if (!validation.isValid(password)) return res.status(400).send({ status: false, message: "Pasworrd is required" })
        if (!validation.isValidPwd(password)) return res.status(400).send({ status: false, message: "Password length should be 8 to 15 digits and enter atleast one uppercase also one special character" })

        if (!address) return res.status(400).send({ status: false, msg: "address requried" })

        address = JSON.parse(address)

        if (Object.keys(address) == 0) return res.status(400).send({ status: false, message: "address field can't be empty" })

        if (!validation.isValid(address.shipping.street)) return res.status(400).send({ status: false, message: "street field is required" })
        if (!validation.isValid(address.shipping.city)) return res.status(400).send({ status: false, message: "city field is required" })
        if (!validation.isValid(address.shipping.pincode)) return res.status(400).send({ status: false, message: "pincode field is required" })
        if (!validation.isValidPincode(address.shipping.pincode)) return res.status(400).send({ status: false, message: "PIN code should contain 6 digits only " })

        if (!validation.isValid(address.billing.street)) return res.status(400).send({ status: false, message: "street field is required" })
        if (!validation.isValid(address.billing.city)) return res.status(400).send({ status: false, message: "city field is required" })
        if (!validation.isValid(address.billing.pincode)) return res.status(400).send({ status: false, message: "pincode field is required" })
        if (!validation.isValidPincode(address.billing.pincode)) return res.status(400).send({ status: false, message: "PIN code should contain 6 digits only " })
        data.address = address


        if (files && files.length == 0) {
            return res.status(400).send({ msg: "No profileImage found" })
        }
        let uploadedProfileImage = await aws.uploadFile(files[0])
        data.profileImage = uploadedProfileImage

        const saltRounds = 10
        const hash = bcrypt.hashSync(password, saltRounds)
        data.password = hash

        let createUser = await userModel.create(data)
        return res.status(201).send({ status: true, message: "user created successfully", data: createUser })

    }
    catch (err) {
        res.status(500).send({ msg: "Error", error: err.message })
    }
}



const loginUser = async function (req, res) {
    try {
        let data = req.body
        if (validation.isValidBody(data)) return res.status(400).send({ status: false, msg: "please provide  details" })
        let { email, password } = data

        if (!validation.isValid(email)) return res.status(400).send({ status: false, message: "email is required" })
        if (!validation.isValid(password)) return res.status(400).send({ status: false, message: "Pasworrd is required" })

        let findUser = await userModel.findOne({ email: email })
        if (!findUser) return res.status(404).send({ status: false, message: "the email id entered is wrong" })

        let bcryptPass = await bcrypt.compare(password, findUser.password)
        if (!bcryptPass) return res.status(404).send({ status: false, message: "The entered password is wrong" })

        let token = jwt.sign({ userId: findUser._id }, "Products-Management", { expiresIn: '1d' });

        res.status(200).send({ status: true, message: "User login successfully", data: { userId: findUser._id, token: token } })


    } catch (err) {
        res.status(500).send({ msg: "Error", error: err.message })
    }
}
module.exports = { createUser, loginUser }