var mongojs = require('mongojs');
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var connString = "mongodb://admin:admin@ds149535.mlab.com:49535/heroku_zkn79f3b";
var app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
var port = process.env.PORT || 3000;
var db = mongojs(connString);
var topics = db.collection('topics');
var questions = db.collection('questions');

db.on('connect', function () {
	console.log('database connected. Starting server');

})

app.post('/newTopic', (req,res)=>{
	var topic = {
		title: req.body.title,
		content: req.body.content
	};
	topics.insert(topic, function(err,data){
		if(data){
			res.json({
				code: 200,
				topic: data._id
			})
		}else{
			res.json({
				code: 400,
				error: err
			})
		}
	})
})

app.post('/newQuestion', (req,res)=>{
	var question = {
		title: req.body.title,
		option1: req.body.option1,
		option2: req.body.option2,
		option3: req.body.option3,
		option4: req.body.option4,
		correct: req.body.correct,
		topic: req.body.topic
	}
	questions.insert(question, function(err,data){
		if(data){
			res.json({
				code: 200,
				question: data._id
			})
		}else{
			res.json({
				code: 400,
				error: err
			})
		}
	})

})

app.get('/allTopic', (req,res)=>{
	topics.find((err,docs)=>{
		if(!err){
			res.json({
				code: 200,
				count: docs.length,
				topics: docs
			})
		}else{
			res.json({
				code: 400,
				error: err
			})
		}
	})
})

app.get('/allQuestion/:topic', (req,res)=>{
	questions.find({topic: req.params.topic}, (err,docs)=>{
		if(!err){
			res.json({
				code: 200,
				count: docs.length,
				questions: docs
			})
		}else{
			res.json({
				code: 400,
				error: err
			})
		}
	})
})

app.listen(port, function(){
	console.log('Server started');
});
