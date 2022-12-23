const Razorpay = require('razorpay');
const Order = require("../model/orders");
const dotenv = require('dotenv');
dotenv.config();

exports.purchasepremium = async (req,res,next)=>{
    try{
        var rzp = new Razorpay({
            key_id : process.env.RAZORPAY_KEY_ID,
            key_secret : process.env.RAZORPAY_KEY_SECRET            
        })
        const amount = 2500;
        rzp.orders.create({amount, currency: 'INR'}, (err, order)=>{
            if(err){
                throw new Error(JSON.stringify(err));
            }
            req.user.createOrder({orderid: order.id, status: 'PENDING'}).then(()=>{
                return res.status(201).json({order, key_id: rzp.key_id})
            }).catch(err=>{
                throw new Error(err)
            })
        })
    
    } catch(err){
        console.log(err);
        res.status(403).json({message: "Something went wrong", error: err})
    }

}

exports.updatestatus = async (req,res,next) =>{
    try {
        const order_id = req.body.order_id;
        const payment_id = req.body.payment_id;
        const message = req.body.message;
        const premium = req.body.premium;
 
        Order.findOne({where: {orderid: order_id}})
        .then (order=>{
            console.log('Order found');
            order.update({paymentid: payment_id, status: message })
            .then(()=>{
                return req.user.update({ispremiumuser: premium})
                    .then(()=>{
                        return res.status(202).json({success:true, message: `Transaction ${message}`});
                        }).catch(err=>{
                            throw new Error(err);
                            })
            }).catch(err=>{
                throw new Error(err);
            })
        })
    } catch(err) {
        throw new Error(err);
    }
} 