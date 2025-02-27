const errorMiddleware = (err, req, res, next) => {
    console.error(`Error: ${err.message}`);
    console.error(`Stack: ${err.stack}`);
    
    const status = err.statusCode || 500;
    const message = err.message || 'Something went wrong!';
    
    res.status(status).json({ 
        success: false, 
        error: message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

export default errorMiddleware;