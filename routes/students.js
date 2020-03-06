var express = require('express');
var router = express.Router();

Class = require('../models/class');
Student = require('../models/student');
User = require('../models/user');

router.get('/classes', function(req, res, next){
	Student.getStudentByUsername(req.user.username, function(err, student){
		if(err) throw err;
		res.render('students/classes', {student: student});
	});
});

router.post('/classes/register', function(req, res){
	info = [];
	info['student_username'] = req.user.username;
	info['class_id'] = req.body.class_id;
	info['class_title'] = req.body.class_title;

	Student.getStudentByUsername(req.user.username, function(err, student) {
		if(err) throw err;

		var classes_ids = [] ; // ids of the classes to which the student is registered
		if (!(student.classes === undefined || student.classes.length == 0)) {
			for (i = 0; i < student.classes.length; i++) {
				classes_ids.push(student.classes[i].class_id.toString()); // populate the list of ids
			}
		}
		// check if the student is already in the class
		if(classes_ids.includes(info['class_id'])) {
			req.flash('error_msg', 'You are already registered to this class');
		} else {
			Student.register(info, function(err, student) {
				if(err) throw err;
			});
			req.flash('success_msg', 'You are now registered');
		}
		res.redirect('/students/classes');
	});

/*if (classes.class_id == req.body.class_id)
	Student.getStudentByUsername(req.user.username, function(err,student){
		if (err) throw err;
		for (c in student.classes){
			if(c.class_id == req.body.class._id){
				req.flash('error_msg', 'Ya estas registrado para esta clase!');
				req.redirect("students/classes");
			}
		}
	})*/

});

module.exports = router;
