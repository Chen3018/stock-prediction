import { spawn } from 'child_process';

// @desc    Get net hour prediction for a company
// @route   GET /api/predictions/:symbol
export const getNextHour = async (req, res, next) => {
    const symbol = req.params.symbol;

    const child = spawn('python', ['../model/predict.py', symbol]);

    let output = '';
    child.stdout.on('data', (data) => {
        output += data.toString();
    });

    child.on('close', (code) => {
        if (code === 0) {
          res.status(200).json({ prediction: output.trim() });
        } else {
            console.log('Python script error with code', code);
            const err = new Error(`Python script error with code ${code}`);
            err.status = 404;
            return next(err);
        }
    });
};