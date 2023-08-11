
const { userModal } = require('../dbModal/UserModal');
const bcrypt = require('bcrypt');
const fs = require('fs');
const { exec } = require('child_process');


const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email, password);
        const existingUser = await userModal.findOne({ email });
        if (existingUser) {
            return res.status(200).json({ message: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        //Create new user
        const newUser = new userModal({ email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'internal server error' });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await userModal.findOne({ email });
        if (!user) {
            return res.status(200).json({ message: 'invalid credentials' });
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(200).json({ message: 'Incorrect Password' });
        }

        res.status(200).json({ message: 'login successful' });
    } catch (error) {
        console.error('login error:', error);
        res.status(500).json({ message: 'internal server error' });
    }
}

const uploadVideo = async (req, res) => {
    console.log(req.file);
    if (!req.file) {
        res.status(400).send('No video file uploaded.');
        return;
    }

    const tempFilePath = 'temp_video.mp4';
    await fs.writeFileSync(tempFilePath, req.file.buffer);

    const outputDirectory = 'output';
    const playlistFileName = 'output.m3u8';

    const command = `ffmpeg -i ${tempFilePath} -c:v h264 -c:a aac -hls_time 10 -hls_list_size 0 ${outputDirectory}/${playlistFileName}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error('FFmpeg error:', error);
            res.status(500).send('Error converting video.');
        } else {
            console.log('Video converted successfully.');
            res.status(200).send('Video converted successfully.');
        }

        fs.unlinkSync(tempFilePath);
    });

}


module.exports = { login, register, uploadVideo }