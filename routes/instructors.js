var express = require('express');
var router = express.Router();

Class = require('../models/class');
Instructor = require('../models/instructor');
User = require('../models/user');

router.get('/classes', function(req, res, next){
	Instructor.getInstructorByUsername(req.user.username, function(err, instructor){
		if(err) throw err;
		res.render('instructors/classes', {instructor: instructor});
	});
});

router.post('/classes/register', function(req, res){
	info = [];
	info['instructor_username'] = req.user.username;
	info['class_id'] = req.body.class_id;
	info['class_title'] = req.body.class_title;

	Instructor.getInstructorByUsername(req.user.username, function(err, instructor) {
		if(err) throw err;

		var classes_ids = [] ; // ids of the classes to which the instructor is registered
		for (i in instructor.classes) {
			classes_ids.push(instructor.classes[i].class_id.toString()); // populate the list of ids
		}

		// check if the student is already in the class
		if(classes_ids.includes(info['class_id'])) {
			req.flash('error_msg', 'You are already registered to this class');
		} else {
			Instructor.register(info, function(err, student) {
				if(err) throw err;
			});
			req.flash('success_msg', 'You are now registered');
		}
		res.redirect('/instructors/classes');
	});
	
});

router.get('/classes/:id/lessons/new', function(req, res, next){
	res.render('instructors/newlesson',{class_id:req.params.id});
});
//Adding new Lessons to classes
router.post('/classes/:id/lessons/new', function(req, res, next){
	// Get Values
	var info = [];
	info['class_id'] = req.params.id;
	info['lesson_number'] = req.body.lesson_number;
	info['lesson_title'] = req.body.lesson_title;
	info['lesson_body'] = req.body.lesson_body;

	Class.addLesson(info, function(err, lesson){
		console.log('Lesson Added..');
	});

	req.flash('success_msg','Lesson Added');
	res.redirect('/instructors/classes');
});

//NEW!! Adding new Classes from Instructor page
router.get('/classes/new', function(req, res, next){
	res.render('instructors/newclass');
})

router.post('/classes/new', function(req, res, next){
	// Get Values
	var info = [];
	info['class_id'] = req.params.id;
	info['title'] = req.body.title;
	info['description'] = req.body.description;
	info['instructor'] = req.body.instructor;
	info['lessons'] = [{}];

	if(errors){
		res.render('/classes', {
			errors: errors
		});
	} else {
		var newClass = new Class({
			title: title,
			description:description,
			instructor: instructor,
			lesssons: [{}]
		});

		Class.addClass(info, function(err, lesson){
			console.log('Class Added..');
		});

		req.flash('success_msg','Class Added');
		res.redirect('/instructors/classes');
	}	
});






module.exports = router;