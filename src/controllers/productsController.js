const ProductModel=require("../models/productModel")
const validator=require("../validations/validator")
const uploadImage=require("../validations/awsAuth")
const getSymbolFromCurrency = require('currency-symbol-map')

const createProducts=async (req,res)=>{
    try{
        const data=req.body
        const files=req.files

        if(!validator.isRequestBody(data)){
            return res.status(400).send({status:false,message:"please provide some data in body"})
        }
        const {title,description,price,currencyId,currencyFormat,isFreeShipping, installments,productImage,availableSizes,style}=data

        if(!validator.isValid(title)){
            return res.status(400).send({status:false,message:"please provide title is required"})
        }

        let uniqueTitle=await ProductModel.findOne({title:title , isDeleted:false})
        if(uniqueTitle){
            return res.status(400).send({status:false,message:"already title"})
        }

        if(!validator.isValid(description)){
            return res.status(400).send({status:false,message:"description is required"})
        }

        if(!validator.isValidNumber(price)){
            return res.status(400).send({status:false,message:"price is required"})
        }
        
        if (!validator.isValidPrice(Number(price))) {
            return res.status(400).send({ status: false, message: "Enter a valid Product price" });
          }

          if(!validator.isValid(currencyId)){
            return res.status(400).send({ status: false, message: "currency id is required" });
          }

          if(getSymbolFromCurrency(currencyId)===undefined){
            return res.status(400).send({ status: false, message: "currency id is not required" });

          }

          if(!validator.isValid(currencyFormat)){
            return res.status(400).send({ status: false, message: "currencyFomate  is required" });
          }

          if(getSymbolFromCurrency(currencyId)!==currencyFormat){
            return res.status(400).send({status: false,message: "currencyFormat is not matching with currencyId",
            });
          }

          if(isFreeShipping){
              if(isFreeShipping !== "true" ||  isFreeShipping !== "false"){
                return res.status(400).send({status:false,message:"isFreeShipping should be boolean"})
              }
          }

          if (style) {
            if (!validator.isValid(style)) {
              return res.status(400).send({status: false,message: "product style should be in valid format"});
            }
          }

          if(!validator.isValid(availableSizes)){
              return res.status(400).send({status:false,message:"availableSizes is required"})
          }

         
        //   console.log([availableSizes])
          // availableSizes=JSON.parse(availableSizes)
        // availableSizes=[availableSizes]

    //       if(Array.isArray(availableSizes)){
    //           if(availableSizes.length===0){
    //             return res.status(400).send({ status: false, message: "enter valid available sizes" });
    //           }

    //           for(let i=0;i<availableSizes.length;i++){
    //               const element=availableSizes[i]
    //               if(!["S", "XS", "M", "X", "L", "XXL", "XL"].includes(element)){
    //                 return res.status(400).send({status: false,message: `available sizes should be from:  S, XS, M, X, L, XXL, XL`, });
    //               }
    //           }

    //       }else {
    //           return res.status(400).send({status: false,message: "enter available sizes in valid format : [X, M, L]",});
    // }

    if (installments) {
        if (!isValidNumber(installments)) {
          return res.status(400).send({status: false,message: "Product installments should be in valid format", });
        }
      }


        
            let profileImage=await uploadImage.uploadFile(files[0])
            
            const productData = {title: title.trim(),
                description: description.trim(),
                price: price,
                currencyId: currencyId.trim(),
                currencyFormat: currencyFormat.trim(),
                isFreeShipping: isFreeShipping ? isFreeShipping : false,
                productImage: profileImage,
                style: style,
                availableSizes: availableSizes,
                installments: installments,
                deletedAt: null,
                isDeleted: false,
              };

              if(availableSizes){
                const sizes=availableSizes.split(",").map(x=>x.trim())
                for(let i=0;i<sizes.length;i++){
                  if (!(["S", "XS", "M", "X", "L", "XXL", "XL"].includes(sizes[i]))) {
                    return res.status(400).send({ status: false, message: "AvailableSizes should be  ['S','XS','M','X','L','XXL','XL']" })
                }
                }
                if (Array.isArray(sizes)) {
                  productData['availableSizes'] = [...new Set(sizes)]
              }
              }
          
              const newProduct = await ProductModel.create(productData);
          
              res.status(201).send({
                status: true,
                message: "new product added successfully",
                data: newProduct,
              });
        



    }catch(err){
      res.status(500).send({ error: err.message });
    }
}

const getProducts=async (req,res)=>{
    try{
      const queryParams = req.query;
      const filterConditions = { isDeleted: false, deletedAt: null };
      const sorting = {};
  
      let { size, name, priceSort, priceGreaterThan, priceLessThan } =
        queryParams;
  
      if (validator.isRequestBody(queryParams)) {
        if (queryParams.hasOwnProperty("size")) {
          // size = JSON.parse(size);
          size=size.split(",").map(x=>x.trim())
          console.log(size)
          if (Array.isArray(size) && size.length > 0) {
            for (let i = 0; i < size.length; i++) {
              const element = size[i];
  
              if (!["S", "XS", "M", "X", "L", "XXL", "XL"].includes(element)) {
                return res.status(400).send({
                  status: false,
                  message: `available sizes should be from:  S, XS, M, X, L, XXL, XL`,
                });
              }
            }
  
            filterConditions["availableSizes"] = { $in: size };
          } else {
            return res
              .status(400)
              .send({
                status: false,
                message: "size should be in array format: [X, M,L]",
              });
          }
        }
  
        if (queryParams.hasOwnProperty("priceGreaterThan")) {
          if (!validator.isValidPrice((priceGreaterThan))) {
            return res
              .status(400)
              .send({ status: false, message: "Enter a valid price" });
          }
  
          filterConditions["price"] = { $gt: Number(priceGreaterThan) };
        }
  
        if (queryParams.hasOwnProperty("priceLessThan")) {
          if (!validator.isValidPrice(priceLessThan)) {
            return res
              .status(400)
              .send({ status: false, message: "Enter a valid price" });
          }
          if (queryParams.hasOwnProperty("priceGreaterThan")) {
            filterConditions["price"] = {
              $gt: Number(priceGreaterThan),
              $lt: Number(priceLessThan),
            };
          } else {
            filterConditions["price"] = { $lt: Number(priceLessThan) };
          }
        }
  
        if (queryParams.hasOwnProperty("priceSort")) {
          if (!validator.isValidNumber(priceSort) || ["-1", "1"].includes(priceSort)) {
            return res
              .status(400)
              .send({
                status: false,
                message: "price sort should be a number:  -1 or 1",
              });
          }
          sorting["price"] = Number(priceSort);
        }
  
        if (queryParams.hasOwnProperty("name")) {
          if (!validator.isValid(name)) {
            return res.status(400).send({
              status: false,
              message: "product name should be in valid format",
            });
          }
  
          const regexForName = new RegExp(name, "i");
  
          filterConditions["title"] = { $regex: regexForName };
        }
  
        const filteredProducts = await ProductModel.find(filterConditions).sort(
          sorting
        );
  
        if (filteredProducts.length == 0) {
          return res
            .status(404)
            .send({ status: false, message: "no product found" });
        }
  
        res.status(200).send({
          status: true,
          message: "Filtered product list is here",
          productCount: filteredProducts.length,
          data: filteredProducts,
        });
      } else {
        const allProducts = await ProductModel.find(filterConditions);
  
        if (allProducts.length == 0) {
          return res
            .status(404)
            .send({ status: false, message: "no products found" });
        }
  
        res.status(200).send({
          status: true,
          message: " Product list is here",
          productCount: allProducts.length,
          data: allProducts,
        });
      }

    }catch(err){
      res.status(500).send({ err: err.message });
    }
}

const getProductsById=async (req,res)=>{
    try{
      const productId = req.params.productId;
    const queryParams = req.query;

    if (validator.isRequestBody(queryParams)) {
      return res.status(404).send({ status: false, message: "Page not found" });
    }

    if (!productId) {
      return res.status(400).send({
        status: false,
        message: "Invalid request, product id is required in path params",
      });
    }

    // if (!validator.isValidIdObjectId(productId)) {
    //   return res
    //     .status(400)
    //     .send({ status: false, message: "Invalid product id" });
    // }

    if(productId.length!=24){
      return res.status(400).send({status:false,message:"please provide valid product id"})
    }

    const productById = await ProductModel.findById(productId);

    res
      .status(200)
      .send({ status: true, message: "success", data: productById });
    }catch(err){
      res.status(500).send({ err: err.message });
    }
}

const updateProducts=async (req,res)=>{
    try{
      const queryParams = req.query;
    const requestBody = { ...req.body };
    const productId = req.params.productId;

   
    if (validator.isRequestBody(queryParams)) {
      return res.status(404).send({ status: false, message: "Page not found" });
    }

    //  if (!validator.isValidIdObjectId(productId)) {
    //   return res
    //     .status(400)
    //     .send({ status: false, message: "invalid product id" });
    // }

    if(productId.length!=24){
      return res.status(400).send({status:false,message:"please provide valid product id"})
    }

    const productByProductId = await ProductModel.findOne({_id : productId, isDeleted : false, deletedAt : null})

    if(!productByProductId){
      return res.status(404).send({ status: false, message: "No product found by product id"})
    }

    if (!validator.isRequestBody(requestBody)) {
      return res
        .status(400)
        .send({ status: false, message: "Update data required" });
    }

    let {
      title,
      description,
      price,
      currencyId,
      currencyFormat,
      isFreeShipping,
      style,
      availableSizes,
      installments,
    } = requestBody;

    const updates = { $set: {} };

    if (requestBody.hasOwnProperty("title")) {
      if (!validator.isValid(title)) {
        return res
          .status(400)
          .send({ status: false, message: "Invalid title" });
      }

      const productByTitle = await ProductModel.findOne({
        title: title,
        isDeleted: false,
        deletedAt: null,
      });

      if (productByTitle) {
        return res
          .status(400)
          .send({ status: false, message: "Product title already exist" });
      }

      updates["$set"]["title"] = title.trim();
    }

    if (requestBody.hasOwnProperty("description")) {
      if (!validator.isValid(description)) {
        return res
          .status(400)
          .send({ status: false, message: "Invalid description" });
      }
      updates["$set"]["description"] = description.trim();
    }

    if (requestBody.hasOwnProperty("price")) {
      if (!validator.isValidPrice(price)) {
        return res
          .status(400)
          .send({ status: false, message: "Invalid price" });
      }
      updates["$set"]["price"] = price;
    }

    if (requestBody.hasOwnProperty("currencyId")) {
      if (!validator.isValid(currencyId) || getSymbolFromCurrency(currencyId) === undefined) {
        return res
          .status(400)
          .send({ status: false, message: "Invalid currencyId" });
      }
       
      updates["$set"]["currencyId"] = currencyId.trim();
      updates["$set"]["currencyFormat"] = getSymbolFromCurrency(currencyId)
    }

  //! here in both cases we have to check 
    // if (requestBody.hasOwnProperty("currencyFormat")) {
    //   if (!Validator.isValid(currencyFormat)) {
    //     return res
    //       .status(400)
    //       .send({ status: false, message: "Invalid currencyFormat" });
    //   }
    //   updates["$set"]["currencyFormat"] = currencyFormat.trim();
    // }

    if (requestBody.hasOwnProperty("isFreeShipping")) {
      if (!validator.isValid(isFreeShipping)) {
        return res
          .status(400)
          .send({ status: false, message: "Invalid FreeShipping" });
      }
      if (isFreeShipping !== "true" && isFreeShipping !== "false") {
        return res
        .status(400)
        .send({ status: false, message: "Invalid FreeShipping" });
      }
      updates["$set"]["isFreeShipping"] = isFreeShipping;
    }

    if (requestBody.hasOwnProperty("style")) {
      if (!validator.isValid(style)) {
        return res
          .status(400)
          .send({ status: false, message: "Invalid style" });
      }
      updates["$set"]["style"] = style;
    }

    if (requestBody.hasOwnProperty("availableSizes")) {

      if (!validator.isValid(availableSizes)) {
        return res
          .status(400)
          .send({ status: false, message: "Invalid format of availableSizes" });
      }
     
      availableSizes = JSON.parse(availableSizes);

      if (Array.isArray(availableSizes) && availableSizes.length > 0) {
        for (let i = 0; i < availableSizes.length; i++) {
          const element = availableSizes[i];

          if (!["S", "XS", "M", "X", "L", "XXL", "XL"].includes(element)) {
            return res.status(400).send({
              status: false,
              message: `available sizes should be from:  S, XS, M, X, L, XXL, XL`,
            });
          }
        }

        updates["$set"]["availableSizes"] = availableSizes;
      } else {
        return res
          .status(400)
          .send({ status: false, message: "Invalid availableSizes" });
      }
    }

    if (requestBody.hasOwnProperty("installments")) {
      
      if (!validator.isValidNumber(installments)) {
        return res
          .status(400)
          .send({ status: false, message: "invalid installments" });
      } else {
        updates["$set"]["installments"] = Number(installments);
      }
    }

    const updatedProduct = await ProductModel.findOneAndUpdate(
      { _id: productId },
      updates,
      { new: true }
    );

    res.status(200).send({
      status: true,
      message: "Product data updated successfully",
      data: updatedProduct,
    });
    }catch(err){
      res.status(500).send({ err: err.message });
    }
}

const deleteProducts=async (req,res)=>{
    try{
      const productId = req.params.productId;
    const queryParams = req.query;

    if (validator.isRequestBody(queryParams)) {
      return res.status(404).send({ status: false, message: "Page not found" });
    }

    if (!productId) {
      return res.status(400).send({
        status: false,
        message: "Invalid request, product id is required in path params",
      });
    }

    // if (!validator.isValidIdObjectId(productId)) {
    //   return res
    //     .status(400)
    //     .send({ status: false, message: "Invalid product id" });
    // }

    if(productId.length!=24){
      return res.status(400).send({status:false,message:"please provide product Id"})
    }

    const productById = await ProductModel.findOne({
      _id: productId,
      isDeleted: false,
      deletedAt: null,
    });

    if (!productById) {
      return res.status(404).send({
        status: false,
        message: "No product found by this product id",
      });
    }

    const markDirty = await ProductModel.findOneAndUpdate(
      { _id: productId },
      { $set: { isDeleted: true, deletedAt: Date.now() } }
    );

    res
      .status(200)
      .send({ status: true, message: "Product successfully deleted" });

    }catch(err){
      res.status(500).send({ err: err.message });
    }
}

module.exports={createProducts,getProducts,getProductsById,updateProducts,deleteProducts}



