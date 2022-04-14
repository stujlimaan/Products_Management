const isRequestBody=(value)=>{
    return Object.keys(value).length > 0
}

const isValid=(value)=>{
    if(typeof value === "undefined" || value ===null) return false
    if(typeof value === "string" && value.trim().length ===0) return false //check if string contains space or not
    return true
}

const isValidEmail=(email)=>{
    const regexForEmail=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
    return regexForEmail
}

const isValidPhone=(phone)=>{
    const regexForPhone=(/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/.test(phone))
    return regexForPhone
}

const isValidPassword=(password)=>{
    const regexForPassword=/^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9]{8,15}$/.test(password)
    return regexForPassword
}

const isValidAddress=(value)=>{
    if(typeof value === "undefined" || value === null) return false
    if(typeof value === "object" && Array.isArray(value)===false) return true
    return false 
}

const isValidPincode=(pincode)=>{
    if(typeof pincode === "undefined" || pincode === null ) return false
    if(typeof pincode==="number" && pincode.toString().length===6) return true
    return false
}

const isValidNumber = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && Number(value) !== NaN) return true;
    if (typeof value === "number") return true;
    return false;
  };

//   const isValidPrice = function (price) {
//     return price - 0 == price && (" " + price).trim().length > 0;
//   };

  const isValidPrice = function (price) {
    let regexForPrice = /^\d+(\.\d{1,2})?$/
    return regexForPrice.test(price)
   };

  const isValidIdObjectId = function (productId) {
    return mongoose.Types.ObjectId.isValid(productId);
  };

module.exports={isRequestBody,isValid,isValidAddress,isValidPincode,isValidEmail,isValidPhone,isValidPassword
,isValidNumber,isValidPrice,isValidIdObjectId
}