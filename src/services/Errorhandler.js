export const errorresponse = (res, status, message)=>{
res.status(status).json({
    success: false,
    status,
    message
})
}
export const successresponse = (res, status, message, data = null)=>{
res.status(status).json({
    success: true,
    status,
    message,
    data
})
}

