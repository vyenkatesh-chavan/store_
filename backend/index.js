import express from 'express';
import nodemailer from "nodemailer";
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import Customer from './model/user.model.js';
import Company from './model/company.model.js';
import Admin1 from './model/admin1.model.js';
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// In-memory OTP store: { email: { otp, expiresAt, verified } }
const otpStore = {};

const mongooseURI = 'mongodb+srv://vyankateshc21:vmck@cluster0.plecrab.mongodb.net/yourdbname?retryWrites=true&w=majority';
mongoose.connect(mongooseURI)
    .then(() => console.log('✅ MongoDB connected successfully.'))
    .catch(err => {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    });

// Nodemailer config
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "project13v@gmail.com",
        pass: "uuwj jcmx brqq shjd"
    }
});

const sendOtpEmail = async (email, otp) => {
    const mailOptions = {
        from: "project13v@gmail.com",
        to: email,
        subject: "Your OTP for Signup Verification",
        text: `Your OTP is: ${otp}`
    };

    await transporter.sendMail(mailOptions);
};

// 👉 Route to send OTP
app.post('/send-otp', async (req, res) => {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore[email] = {
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000, // 5 min validity
        verified: false
    };

    try {
        await sendOtpEmail(email, otp);
        res.status(200).json({ message: "OTP sent to email" });
    } catch (err) {
        console.error("Failed to send OTP:", err);
        res.status(500).json({ message: "Failed to send OTP" });
    }
});

// 👉 Route to verify OTP
app.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;
  
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }
  
    const record = otpStore[email];
    if (!record) {
      return res.status(400).json({ message: "OTP not found or not requested for this email" });
    }
  
    if (record.verified) {
      return res.status(400).json({ message: "OTP already verified" });
    }
  
    if (Date.now() > record.expiresAt) {
      delete otpStore[email];
      return res.status(400).json({ message: "OTP expired. Please request a new one." });
    }
  
    if (record.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
  
    // Mark OTP as verified
    otpStore[email].verified = true;
  
    res.status(200).json({ message: "OTP verified successfully" });
  });
// 👉 Signup with OTP check
app.post('/signupcustomer', async (req, res) => {
    const { name, email, password, address, phone } = req.body;

    // Validate required fields
    if (!name || !email || !password || !address || !phone) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const otpData = otpStore[email];
    if (!otpData || !otpData.verified) {
        return res.status(403).json({ message: "OTP not verified" });
    }

    try {
        const existingUser = await Customer.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Customer already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const customer = new Customer({
            name,
            email,
            password: hashedPassword,
            address,
            phone,
        });

        const savedCustomer = await customer.save();

        const token = jwt.sign(
            { id: savedCustomer._id, email: savedCustomer.email },
            process.env.JWT_SECRET || 'defaultsecret',
            { expiresIn: '7d' }
        );

        delete otpStore[email];

        res.status(201).json({ message: "Customer created successfully", token });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.post('/logincustomer', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }   
    try {
        const user = await Customer.find({ email });
        if (!user || user.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }   
        const isMatch = await bcrypt.compare(password, user[0].password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign(
            { id: user[0]._id, email: user[0].email },
            process.env.JWT_SECRET || 'defaultsecret',
            
        );
        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: "Internal server error" });
    }
}); 

app.get("/profile", async (req, res) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }
  
    const token = authHeader.split(" ")[1];
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "defaultsecret");
  
      // JWT should contain `id` as payload: { id: savedUser._id }
      const customer = await Customer.findById(decoded.id).select("-password");
  
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
  
      // Send full profile (except password)
      res.status(200).json({
        customer: {
          name: customer.name,
          email: customer.email,
          phone: customer.phone || "",
          address: customer.address || ""
        }
      });
    } catch (err) {
      console.error("Profile access error:", err.message);
      res.status(401).json({ message: "Invalid token" });
    }
  });
//sign up vendor

app.post("/signupvendor", async (req, res) => {
    const { name, email, password, address, phone, domain } = req.body;
  
    // 🔎 Validate input
    if (!name || !email || !password || !address || !phone || !domain) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    // 🔐 Check OTP verification
    const otpEntry = otpStore[email];
    if (!otpEntry || !otpEntry.verified) {
      return res.status(403).json({ message: "OTP not verified. Please verify before signup." });
    }
  
    try {
      // 🚫 Check for duplicate email
      const existingCompany = await Company.findOne({ email });
      if (existingCompany) {
        return res.status(409).json({ message: "Email already registered" });
      }
  
      // 🔒 Hash the password securely
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // 🏢 Create vendor document
      const newCompany = new Company({
        name,
        email,
        password: hashedPassword,
        address,
        phone,
        domain,
      });
  
      await newCompany.save();
  
      // 🔑 Generate JWT tokens
      const vendorToken = jwt.sign(
        {
          id: newCompany._id,
          name: newCompany.name,
          email: newCompany.email,
          address: newCompany.address,
          phone: newCompany.phone,
          domain: newCompany.domain,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
  
      const authToken = jwt.sign(
        { companyId: newCompany._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
  
      // 🧹 Clean OTP store
      delete otpStore[email];
  
      // ✅ Return response
      return res.status(201).json({
        message: "Vendor signup successful",
        vendorToken,
        authToken,
      });
  
    } catch (error) {
      console.error("Vendor signup error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
  app.post("/loginvendor", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const company = await Company .findOne({ email });
        if (!company) {
            return res.status(404).json({ message: "Vendor not found" });
        } 
        const isMatch = await bcrypt.compare(password, company.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const vendorToken = jwt.sign(
            { id: company._id, email: company.email },
            process.env.JWT_SECRET || 'defaultsecret',
            
        );  
        res.status(200).json({ message: "Login successful", vendorToken });
    } catch (error) {
        console.error('Error during vendor login:', error);
        res.status(500).json({ message: "Internal server error" });
    }
});
app.post('/sendvendorotp', async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  otpStore[email] = {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000,
    verified: false,
  };

  try {
    await sendOtpEmail(email, otp);
    res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("Failed to send OTP:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});
app.post("/signupadmin", async (req, res) => {
  const { name, email, password, address, phone } = req.body;

  if (!name || !email || !password || !address || !phone) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const existingAdmin = await Admin1.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ message: "Admin already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin1({
      name,
      email,
      password: hashedPassword,
      address,
      phone,
    });

    await newAdmin.save();

    const token = jwt.sign(
      { adminId: newAdmin._id, email: newAdmin.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(201).json({
      message: "Admin registered successfully.",
      token,
    });
  } catch (err) {
    console.error("Admin signup error:", err.message);
    return res.status(500).json({ message: "Server error." });
  }
});



  
app.listen(3000, () => {
    console.log(`🚀 Server running at http://localhost:3000`);
});
