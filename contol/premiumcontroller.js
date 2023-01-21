const User = require('../model/user');
const Expenses = require('../model/Expenses');
const Report = require('../model/reports');
const { Model, DATE, where } = require('sequelize');
const sequelize = require('../utils/database');
const AWS = require('aws-sdk');
const dotenv = require('dotenv');
dotenv.config();

exports.getdashboard = async (req,res,next) =>{
    try{
    const leaderboardUsers = await User.findAll({
        
        attributes: ['id', 'name', [sequelize.fn('sum', sequelize.col('expenses.amount')),'total_cost']],
        include: [
            { model: Expenses,
                  
                attributes:[]
            }],
        group: ['User.id'],
        order: [[sequelize.col('total_cost'), "DESC"]]
    })
    res.status(201).json(leaderboardUsers);
    } catch(err) {
        console.log(err)
    }
        
}

exports.downloadreport = async (req, res, next) =>{
    try{
        const expenses = await req.user.getExpenses();
        console.log(expenses);
        const stringifiedExpenses = JSON.stringify(expenses);
        const userID = req.user.id;

        const filename = `Expenses${userID}/${new Date()}.txt`;
        const fileURL = await uploadToS3(stringifiedExpenses, filename);
        console.log(fileURL);
        req.user.createReport({filename: fileURL})
        res.status(200).json({fileURL, success: true});
            
    } catch(err) {
        console.log(err);
        res.status(500).json({fileURL:'',success: false, err});
    }
}

function uploadToS3(data,filename){
    
    let s3bucket = new AWS.S3({
        accessKeyId: process.env.IAM_USER_KEY,
        secretAccessKey: process.env.IAM_USER_SECRET
    })

    var params = {
        Bucket: process.env.BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read'
    }
    return new Promise((resolve, reject)=>{
        s3bucket.upload(params, (err, s3response)=>{
            if(err){
                console.log('Something went wrong', err)
                reject(err)
            }else {
                console.log('success', s3response);
                
                resolve(s3response.Location);
            }
        })
    })
}

exports.getreports=async(req,res,next)=>{
    const userReports = await req.user.getReports();
    res.status(200).json({userReports, success:true});
}
