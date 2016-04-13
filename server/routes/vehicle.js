var router = require('express').Router();
var Vehicle = require('../models/vehicle');

router.post('/', function(req, res){
    var vehicle = new Vehicle();
    vehicle.type = req.body.type;
    vehicle.png = '/assets/img/car_types/' + req.body.type.replace(' ', '_').toLowerCase() + '.png';

    vehicle.save(function(err, vehicle){
    	if(err){
    		return res.json(err);
    	}
    	res.json(vehicle);
    })

});

router.get('/', function(req, res){
	Vehicle.find({}, function(err, vehicles){
		if(err){
			return res.json(err);
		}
		res.json(vehicles);
	})
})



module.exports = router;