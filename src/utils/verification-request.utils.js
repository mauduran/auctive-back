const { dynamoDB } = require('../../config/aws.config');

//Worflow: Subir foto de identificación -> Guardar url en


//TODO: Antes agregar INE/Pasaporte a bucket S3 y pasarlo a esta función
const createVerificationRequest = async (official_id_url, email) => {}


const uploadOfficialId = async (email, imageFile) => {}


const getPendingVerifications = async () => {}

// TODO: Crear middleware en el que cheque si es Admin el que realiza la operación
const acceptVerificationRequest = async () => {}

const rejectVerificationRequest = async () => {}



module.exports = {
    createVerificationRequest,
    uploadOfficialId,
    getPendingVerifications,
    acceptVerificationRequest,
    rejectVerificationRequest
}