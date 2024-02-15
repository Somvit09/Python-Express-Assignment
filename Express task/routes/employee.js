const express = require('express');
const Employee = require("../models/Employee");
const authenticateToken = require('../middleware/authenticateToken');
const requireAdmin = require('../middleware/requireAdmin');
const upload = require("../middleware/upload");
const path = require('path');

const router = express.Router();


module.exports = function (io) {
    // get all employees for regular user and admin both
    router.get('/getAll', authenticateToken, async (req, res) => {
        try {
            const employees = await Employee.find(); // Fetch all employees
            res.json(employees);
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // Create an employee for regular user and admin both
    router.post('/create', authenticateToken, async (req, res) => {
        try {
            if (await Employee.findOne({ id: req.body.id })) {
                return res.status(409).json({
                    message: `Employee id ${req.body.id} is already exists in the database.`
                });
            }
            const newEmployee = new Employee({
                // Extract fields from the request body
                id: req.body.id,
                name: req.body.name,
                email: req.body.email,
                position: req.body.position
            });

            const savedEmployee = await newEmployee.save();
            // notify that  new employee has been added
            io.emit('new-employee', { 
                message: 'A new employee has been added.',
                employee: savedEmployee
            });
            res.status(201).json(savedEmployee);
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // Update an employee for regular user and admin both
    router.put('/update/:id', authenticateToken, async (req, res) => {
        try {
            const updatedEmployee = await Employee.findOneAndUpdate(
                { id: req.params.id },
                {
                    $set: {
                        name: req.body.name,
                        email: req.body.email,
                        position: req.body.position
                    }
                },
                { new: true }
            );

            if (updatedEmployee) {
                res.json(updatedEmployee);
            } else {
                res.status(404).send('Employee not found');
            }
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // Admin-only route
    router.delete('/delete/:id', [authenticateToken, requireAdmin], async (req, res) => {
        try {
            const result = await Employee.findOneAndDelete({ id: req.params.id });
            if (result) {
                res.send('Employee record deleted');
            } else {
                res.status(404).send('Employee not found');
            }
        } catch (err) {
            res.status(500).send(err.message);
        }
    });


    // Upload employee profile picture (admin-only)
    router.post('/upload_image/:id', [authenticateToken, requireAdmin, upload.single('profilePicture')], async (req, res) => {
        try {
            const employee = await Employee.findOne({ id: req.params.id });

            if (!employee) {
                return res.status(404).json({ message: 'Employee not found' });
            }

            // Update employee with the file path or other necessary information
            employee.profilePicture = `${req.protocol}://${req.get('host')}/${req.file.path}`;

            await employee.save();

            res.status(200).json({
                message: 'Profile picture uploaded successfully',
                url: employee.profilePicture
            });
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // Download employee profile picture
    router.get('/download/:id', async (req, res) => {
        try {
            const employee = await Employee.findOne({ id: req.params.id });

            if (!employee || !employee.profilePicture) {
                return res.status(404).json({ message: 'Employee or profile picture not found' });
            }

            // Extract the filename from the URL
            const urlParts = employee.profilePicture.split('/');
            const filename = urlParts[urlParts.length - 1]; // Get the last part which should be the filename
            const filePath = urlParts.slice(3).join('/'); // Adjust the index based on your URL structure

            // Construct the absolute path to the file
            const absoluteFilePath = path.join(process.cwd(), filePath);

            // Set the Content-Disposition header to trigger the download prompt
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

            // Send the file as a response using the absolute file path
            res.download(absoluteFilePath, filename, (err) => {
                if (err) {
                    // Handle errors, e.g., file not found
                    res.status(500).send('Error downloading the file.');
                }
            });
        } catch (err) {
            res.status(500).send(err.message);
        }
    });
    return router;
};